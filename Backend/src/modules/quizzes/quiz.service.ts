import { QuizStatus, AttemptStatus, QuestionType } from "@prisma/client";
import { prisma } from "../../database/prisma.client";
import { QuizRepository } from "./quiz.repository";
import { AddQuestionDto, SubmitAnswerDto } from "./quiz.types";
import {
  QuizFilterInput,
  CreateQuizInput,
  AddQuestionInput,
} from "./quiz.validation";
import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
  ValidationError,
} from "../../common/errors/app.error";
import { PaginatedResult } from "../../common/types/pagination.types";

export class QuizService {
  private repository: QuizRepository;

  constructor() {
    this.repository = new QuizRepository();
  }

  // ─── Quiz Management ────────────────────────────────────────────────────────

  async createQuiz(dto: CreateQuizInput, courseId: string, lecturerId: string) {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course)
      throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");
    if (course.lecturerId !== lecturerId)
      throw new ForbiddenError("FORBIDDEN_OWNERSHIP");

    return this.repository.createQuiz(dto, courseId, lecturerId);
  }

  async getQuizzesByCourse(courseId: string, filters: QuizFilterInput) {
    return this.repository.findQuizzesByCourse(courseId, filters);
  }

  async getQuizById(id: string, includeAnswers = false) {
    const quiz = await this.repository.findQuizById(id);
    if (!quiz) throw new NotFoundError("Quiz not found", "QUIZ_NOT_FOUND");

    if (!includeAnswers) {
      // Strip correctAnswer before sending to students
      // Students must not see answers before submitting
      return {
        ...quiz,
        // Students should never receive correct answers before grading.
        // Remove correctAnswer from every question before returning
        // the quiz payload to non-lecturer consumers.
        questions: quiz.questions.map(({ correctAnswer, ...rest }) => rest),
      };
    }

    return quiz;
  }

  async publishQuiz(id: string, lecturerId: string) {
    const quiz = await this.repository.findQuizById(id);
    if (!quiz) throw new NotFoundError("Quiz not found", "QUIZ_NOT_FOUND");

    const course = await prisma.course.findUnique({
      where: { id: quiz.courseId },
    });
    if (!course || course.lecturerId !== lecturerId)
      throw new ForbiddenError("FORBIDDEN_OWNERSHIP");

    if (quiz.status !== QuizStatus.DRAFT) {
      throw new ConflictError(
        "Only DRAFT quizzes can be published",
        "QUIZ_NOT_DRAFT",
      );
    }

    // Prevent publishing an unusable quiz.
    // A quiz must contain at least one question before
    // students can attempt it.

    if (quiz.questions.length === 0) {
      throw new ConflictError(
        "Cannot publish a quiz with no questions",
        "QUIZ_NO_QUESTIONS",
      );
    }

    return this.repository.updateQuizStatus(id, QuizStatus.PUBLISHED);
  }

  async addQuestion(dto: AddQuestionInput, quizId: string, lecturerId: string) {
    const quiz = await this.repository.findQuizById(quizId);
    if (!quiz) throw new NotFoundError("Quiz not found", "QUIZ_NOT_FOUND");

    const course = await prisma.course.findUnique({
      where: { id: quiz.courseId },
    });
    if (!course || course.lecturerId !== lecturerId)
      throw new ForbiddenError("FORBIDDEN_OWNERSHIP");

    if (quiz.status === QuizStatus.PUBLISHED) {
      throw new ConflictError(
        "Cannot add questions to a published quiz",
        "QUIZ_ALREADY_PUBLISHED",
      );
    }

    // Business rule enforcement moved from validation to here
    if (dto.type === QuestionType.MCQ || dto.type === QuestionType.TRUE_FALSE) {
      if (!dto.options || dto.options.length < 2) {
        throw new ValidationError(
          "MCQ and TRUE_FALSE questions require at least 2 options",
        );
      }
      if (!dto.correctAnswer) {
        throw new ValidationError(
          "MCQ and TRUE_FALSE questions require a correctAnswer",
        );
      }
    }

    return this.repository.addQuestion(dto, quizId);
  }

  // ─── Attempt Management ─────────────────────────────────────────────────────

  async startAttempt(quizId: string, studentId: string) {
    const quiz = await this.repository.findQuizById(quizId);
    if (!quiz) throw new NotFoundError("Quiz not found", "QUIZ_NOT_FOUND");

    if (quiz.status !== QuizStatus.PUBLISHED) {
      throw new ConflictError("Quiz is not available", "QUIZ_NOT_PUBLISHED");
    }

    // Idempotency — resume existing IN_PROGRESS attempt
    // If the student already has an active attempt,
    // return it instead of creating a new row.
    // This prevents duplicate attempts caused by
    // refreshes, retries, or repeated button clicks.
    const active = await this.repository.findActiveAttempt(quizId, studentId);
    if (active) return active;

    // Check attempt limit
    const completed = await this.repository.countCompletedAttempts(
      quizId,
      studentId,
    );
    if (completed >= quiz.maxAttempts) {
      throw new ConflictError(
        `Maximum attempts (${quiz.maxAttempts}) reached`,
        "QUIZ_MAX_ATTEMPTS_REACHED",
      );
    }

    return this.repository.createAttempt(quizId, studentId);
  }

  async saveAnswer(attemptId: string, dto: SubmitAnswerDto, studentId: string) {
    const attempt = await this.repository.findAttemptById(attemptId);
    if (!attempt)
      throw new NotFoundError("Attempt not found", "ATTEMPT_NOT_FOUND");

    // Only the owner can save answers
    if (attempt.studentId !== studentId) throw new ForbiddenError("FORBIDDEN");

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new ConflictError(
        "Cannot modify a submitted attempt",
        "ATTEMPT_ALREADY_SUBMITTED",
      );
    }

    return this.repository.upsertAnswer(attemptId, dto);
  }

  async submitAttempt(attemptId: string, studentId: string) {
    const attempt = await this.repository.findAttemptById(attemptId);
    if (!attempt)
      throw new NotFoundError("Attempt not found", "ATTEMPT_NOT_FOUND");

    if (attempt.studentId !== studentId) throw new ForbiddenError("FORBIDDEN");

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new ConflictError(
        "Attempt already submitted",
        "ATTEMPT_ALREADY_SUBMITTED",
      );
    }

    // Mark as submitted first
    // Lock the attempt before grading.
    //
    // Once submitted, answers can no longer be modified.
    // Grading is a separate process that runs after the
    // submission has been permanently recorded.
    await this.repository.updateAttemptStatus(
      attemptId,
      AttemptStatus.SUBMITTED,
    );

    // Immediately run auto-grading
    return this.autoGrade(attemptId);
  }

  async getAttemptResult(attemptId: string, studentId: string) {
    const attempt = await this.repository.findAttemptById(attemptId);
    if (!attempt)
      throw new NotFoundError("Attempt not found", "ATTEMPT_NOT_FOUND");

    if (attempt.studentId !== studentId) throw new ForbiddenError("FORBIDDEN");

    if (attempt.status === AttemptStatus.IN_PROGRESS) {
      throw new ConflictError(
        "Attempt not yet submitted",
        "ATTEMPT_IN_PROGRESS",
      );
    }

    const quiz = await this.repository.findQuizById(attempt.quizId);

    return {
      ...attempt,
      passed:
        attempt.score !== null && quiz
          ? attempt.score >= quiz.passingScore
          : null,
    };
  }

  // ─── Auto-Grade Algorithm ───────────────────────────────────────────────────

  private async autoGrade(attemptId: string) {
    const answers = await this.repository.getAnswersWithQuestions(attemptId);

    let pointsEarned = 0;
    let pointsPossible = 0;
    // Presence of any SHORT_ANSWER question means
    // the attempt cannot be fully graded automatically.
    // Keep track so we know whether the final status
    // should remain SUBMITTED for lecturer review.
    let hasManualQuestions = false;

    for (const answer of answers) {
      const question = answer.question;
      pointsPossible += question.points;

      if (question.type === QuestionType.SHORT_ANSWER) {
        // Cannot auto-grade — leave isCorrect and pointsAwarded as null
        // Lecturer must grade these manually
        hasManualQuestions = true;
        continue;
      }

      // MCQ and TRUE_FALSE — exact string comparison
      const isCorrect = answer.selectedOption === question.correctAnswer;
      const pointsAwarded = isCorrect ? question.points : 0;

      // Write grade result back to the answer record
      await this.repository.updateAnswerGrade(
        answer.id,
        isCorrect,
        pointsAwarded,
      );

      pointsEarned += pointsAwarded;
    }

    // Score as percentage — consistent with passingScore format
    const score =
      pointsPossible > 0
        ? Math.round((pointsEarned / pointsPossible) * 100)
        : 0;

    // If SHORT_ANSWER questions exist, keep SUBMITTED status
    // Score is partial until lecturer completes manual grading
    // If fully auto-gradable, move to GRADED immediately
    const finalStatus = hasManualQuestions
      ? AttemptStatus.SUBMITTED
      : AttemptStatus.GRADED;

    return this.repository.updateAttemptScore(attemptId, score, finalStatus);
  }

  // ─── Mock AI Quiz Generation ─────────────────────────────────────────────────

  async generateQuizFromMock(
    topic: string,
    questionCount: number,
    courseId: string,
    lecturerId: string,
  ) {
    // Mock AI output.
    //
    // The rest of the quiz creation pipeline works with
    // AddQuestionDto objects, so replacing this mock with
    // OpenAI/Gemini later only requires changing how the
    // DTO array is generated.
    //
    // Everything below this point remains unchanged.
    const mockQuestions: AddQuestionDto[] = Array.from(
      { length: questionCount },
      (_, i) => ({
        type: QuestionType.MCQ,
        text: `Sample question ${i + 1} about ${topic}`,
        options: [
          { id: "a", text: "Option A" },
          { id: "b", text: "Option B" },
          { id: "c", text: "Option C" },
          { id: "d", text: "Option D" },
        ],
        correctAnswer: "a",
        explanation: `The correct answer for question ${i + 1} is Option A.`,
        points: 1,
        order: i + 1,
      }),
    );

    // Create the quiz
    const quiz = await this.createQuiz(
      {
        title: `AI Generated Quiz: ${topic}`,
        description: `Auto-generated quiz covering ${topic}`,
        maxAttempts: 1,
        passingScore: 70,
      },
      courseId,
      lecturerId,
    );

    // Add all generated questions
    for (const question of mockQuestions) {
      await this.repository.addQuestion(question, quiz.id);
    }

    return this.repository.findQuizById(quiz.id);
  }
}
