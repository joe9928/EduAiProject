import {
  QuizStatus,
  AttemptStatus,
  QuestionType,
  Prisma,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  QuizAnswer,
} from "@prisma/client";
import { prisma } from "../../database/prisma.client";
import { CreateQuizDto, AddQuestionDto, SubmitAnswerDto } from "./quiz.types";
import { QuizFilterInput } from "./quiz.validation";
import { PaginatedResult } from "../../common/types/pagination.types";

// Reusable type — quiz with its questions included
type QuizWithQuestions = Quiz & { questions: QuizQuestion[] };

// Reusable type — answer with its parent question included
type AnswerWithQuestion = QuizAnswer & { question: QuizQuestion };

// Reusable type — attempt with answers and their questions
type AttemptWithAnswers = QuizAttempt & { answers: AnswerWithQuestion[] };

export class QuizRepository {
  // ─── Quiz CRUD ─────────────────────────────────────────────────────────────

  async createQuiz(
    dto: CreateQuizDto,
    courseId: string,
    lecturerId: string,
  ): Promise<Quiz> {
    //
    return prisma.quiz.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        timeLimitMin: dto.timeLimitMin ?? null,
        maxAttempts: dto.maxAttempts,
        passingScore: dto.passingScore,
        status: QuizStatus.DRAFT,
        courseId,
        aiGenerated: false,
      },
    });
  }

  async findQuizzesByCourse(
    courseId: string,
    filters: QuizFilterInput,
  ): Promise<PaginatedResult<Quiz & { _count: { questions: number } }>> {
    const { page, limit, status, search } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.QuizWhereInput = { courseId };
    if (status) where.status = status;
    if (search) where.title = { contains: search, mode: "insensitive" };

    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          // Returns only the number of related questions.
          // Much cheaper than loading every question record
          // when the UI only needs a question count.
          _count: { select: { questions: true } },
        },
      }),
      prisma.quiz.count({ where }),
    ]);

    return {
      data: quizzes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findQuizById(id: string): Promise<QuizWithQuestions | null> {
    return prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });
  }

  async updateQuizStatus(id: string, status: QuizStatus): Promise<Quiz> {
    return prisma.quiz.update({
      where: { id },
      data: { status },
    });
  }

  // ─── Questions ─────────────────────────────────────────────────────────────

  async addQuestion(
    dto: AddQuestionDto,
    quizId: string,
  ): Promise<QuizQuestion> {
    return prisma.quizQuestion.create({
      data: {
        quizId,
        type: dto.type,
        text: dto.text,
        // options stored as JSON — cast needed because Prisma types Json as unknown
        options: dto.options
          ? (dto.options as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        correctAnswer: dto.correctAnswer ?? null,
        explanation: dto.explanation ?? null,
        points: dto.points,
        order: dto.order,
      },
    });
  }

  // ─── Attempts ──────────────────────────────────────────────────────────────

  async findActiveAttempt(
    quizId: string,
    studentId: string,
  ): Promise<QuizAttempt | null> {
    // We use findFirst instead of findUnique because
    // quizId + studentId + status is not a unique key.
    // We only need to know whether an IN_PROGRESS
    // attempt already exists.
    return prisma.quizAttempt.findFirst({
      where: {
        quizId,
        studentId,
        status: AttemptStatus.IN_PROGRESS,
      },
    });
  }

  async countCompletedAttempts(
    quizId: string,
    studentId: string,
  ): Promise<number> {
    // Only completed attempts consume a quiz attempt.
    //
    // SUBMITTED = student finished and submitted.
    // GRADED    = submission has already been graded.
    //
    // ABANDONED attempts are ignored because the student
    // never completed the quiz and should not lose one
    // of their allowed attempts.
    return prisma.quizAttempt.count({
      where: {
        quizId,
        studentId,
        status: { in: [AttemptStatus.SUBMITTED, AttemptStatus.GRADED] },
      },
    });
  }

  async createAttempt(quizId: string, studentId: string): Promise<QuizAttempt> {
    return prisma.quizAttempt.create({
      data: {
        quizId,
        studentId,
        status: AttemptStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
    });
  }

  async findAttemptById(id: string): Promise<AttemptWithAnswers | null> {
    return prisma.quizAttempt.findUnique({
      where: { id },
      include: {
        answers: {
          include: {
            // Include parent question so service can access type/correctAnswer
            question: true,
          },
        },
      },
    });
  }

  async updateAttemptStatus(
    attemptId: string,
    status: AttemptStatus,
  ): Promise<QuizAttempt> {
    return prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        status,
        // Conditional object spread.
        // submittedAt is only added to the update payload
        // when the attempt transitions to SUBMITTED.

        ...(status === AttemptStatus.SUBMITTED && { submittedAt: new Date() }),
      },
    });
  }

  async updateAttemptScore(
    attemptId: string,
    score: number,
    status: AttemptStatus,
  ): Promise<QuizAttempt> {
    return prisma.quizAttempt.update({
      where: { id: attemptId },
      data: { score, status },
    });
  }

  // ─── Answers ───────────────────────────────────────────────────────────────

  async upsertAnswer(
    attemptId: string,
    dto: SubmitAnswerDto,
  ): Promise<QuizAnswer> {
    // attemptId + questionId uniquely identifies an answer.
    // This prevents multiple answers being stored for the
    // same question within a single quiz attempt.
    //
    // Upsert allows the student to repeatedly change an
    // answer while keeping only one database record.
    return prisma.quizAnswer.upsert({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId: dto.questionId,
        },
      },
      create: {
        attemptId,
        questionId: dto.questionId,
        selectedOption: dto.selectedOption ?? null,
        textAnswer: dto.textAnswer ?? null,
      },
      update: {
        selectedOption: dto.selectedOption ?? null,
        textAnswer: dto.textAnswer ?? null,
      },
    });
  }

  async updateAnswerGrade(
    answerId: string,
    isCorrect: boolean,
    pointsAwarded: number,
  ): Promise<QuizAnswer> {
    return prisma.quizAnswer.update({
      where: { id: answerId },
      data: { isCorrect, pointsAwarded },
    });
  }

  async getAnswersWithQuestions(
    attemptId: string,
  ): Promise<AnswerWithQuestion[]> {
    // Fetches all answers for an attempt with their parent questions
    // Used by the auto-grade algorithm in the service
    return prisma.quizAnswer.findMany({
      where: { attemptId },
      include: { question: true },
    });
  }
}
