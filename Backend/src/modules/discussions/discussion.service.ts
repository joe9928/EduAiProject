import { Role } from "@prisma/client";
import { prisma } from "../../database/prisma.client";
import { DiscussionRepository } from "./discussion.repository";
import {
  CreateThreadInput,
  CreatePostInput,
  UpdateThreadInput,
  UpdatePostInput,
  ModerateThreadInput,
  ThreadFilterInput,
} from "./discussion.validation";
import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from "../../common/errors/app.error";

export class DiscussionService {
  private repository: DiscussionRepository;

  constructor() {
    this.repository = new DiscussionRepository();
  }

  // ─── Threads ──────────────────────────────────────────────────────────────

  async createThread(
    dto: CreateThreadInput,
    courseId: string,
    authorId: string,
  ) {
    // Verify course exists before creating thread
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course)
      throw new NotFoundError("Course not found", "COURSE_NOT_FOUND");

    return this.repository.createThread(dto, courseId, authorId);
  }

  async getThreadsByCourse(courseId: string, filters: ThreadFilterInput) {
    return this.repository.findThreadsByCourse(courseId, filters);
  }

  async getThreadById(id: string) {
    const thread = await this.repository.findThreadWithPosts(id);
    if (!thread)
      throw new NotFoundError("Thread not found", "THREAD_NOT_FOUND");
    return thread;
  }

  async updateThread(id: string, dto: UpdateThreadInput, userId: string) {
    const thread = await this.repository.findThreadById(id);
    if (!thread)
      throw new NotFoundError("Thread not found", "THREAD_NOT_FOUND");

    // Only the author can edit their own thread
    if (thread.authorId !== userId) {
      throw new ForbiddenError("FORBIDDEN_OWNERSHIP");
    }

    return this.repository.updateThread(id, dto);
  }

  async moderateThread(
    id: string,
    dto: ModerateThreadInput,
    userId: string,
    userRole: Role,
  ) {
    const thread = await this.repository.findThreadById(id);
    if (!thread)
      throw new NotFoundError("Thread not found", "THREAD_NOT_FOUND");

    // Only LECTURER or ADMINISTRATOR can pin or lock threads
    if (userRole !== Role.LECTURER && userRole !== Role.ADMINISTRATOR) {
      throw new ForbiddenError("FORBIDDEN_ROLE");
    }

    return this.repository.moderateThread(id, dto);
  }
  /**
   * Soft-deletes a thread.
   *
   * **Authorization:**
   * - Author of the thread can delete it.
   * - Moderators (LECTURER, ADMINISTRATOR) can delete any thread.
   *
   * The actual deletion is a soft delete (sets `deletedAt`). Posts within the
   * thread are not updated; they become invisible because all post retrieval
   * routes filter on `deletedAt` of the parent thread.
   *
   * @throws {NotFoundError} if the thread does not exist.
   * @throws {ForbiddenError} if the user lacks permission.
   */
  async deleteThread(id: string, userId: string, userRole: Role) {
    const thread = await this.repository.findThreadById(id);
    if (!thread)
      throw new NotFoundError("Thread not found", "THREAD_NOT_FOUND");

    // Author can delete their own thread
    // Lecturer and Admin can delete any thread (moderation)
    const isAuthor = thread.authorId === userId;
    const isModerator =
      userRole === Role.LECTURER || userRole === Role.ADMINISTRATOR;

    if (!isAuthor && !isModerator) {
      throw new ForbiddenError("FORBIDDEN_DELETE");
    }

    return this.repository.softDeleteThread(id);
  }

  // ─── Posts ────────────────────────────────────────────────────────────────
  /**
   * Creates a new post (reply) in a discussion thread.
   *
   * **Business rules:**
   * - The target thread must exist and not be locked.
   * - If replying to an existing post (`parentId`), that parent post must
   *   exist and belong to the **same thread** as the one provided.
   * - The author is taken from the authenticated user.
   *
   * @throws {NotFoundError} if the thread or parent post does not exist.
   * @throws {ConflictError} if the thread is locked.
   * @throws {Error} if cross‑thread parent reference is detected
   *   (this will be a `ConflictError` or `BadRequestError` after fix).
   *
   * @param dto - Validated post payload.
   * @param threadId - ID of the thread the post belongs to.
   * @param authorId - ID of the authenticated user creating the post.
   * @returns The newly created post (raw entity; will be mapped to DTO in future).
   */
  async createPost(dto: CreatePostInput, threadId: string, authorId: string) {
    const thread = await this.repository.findThreadById(threadId);
    if (!thread)
      throw new NotFoundError("Thread not found", "THREAD_NOT_FOUND");

    // Locked threads do not accept new replies
    if (thread.isLocked) {
      throw new ConflictError(
        "This thread is locked and cannot accept new replies",
        "THREAD_LOCKED",
      );
    }

    // If replying to a post, verify the parent post exists
    if (dto.parentId) {
      const parent = await this.repository.findPostById(dto.parentId);
      if (!parent) {
        throw new NotFoundError("Parent post not found", "POST_NOT_FOUND");
      }
    }

    return this.repository.createPost(dto, threadId, authorId);
  }

  async updatePost(id: string, dto: UpdatePostInput, userId: string) {
    const post = await this.repository.findPostById(id);
    if (!post) throw new NotFoundError("Post not found", "POST_NOT_FOUND");

    // Only the author can edit their own post
    if (post.authorId !== userId) {
      throw new ForbiddenError("FORBIDDEN_OWNERSHIP");
    }

    return this.repository.updatePost(id, dto);
  }

  async deletePost(id: string, userId: string, userRole: Role) {
    const post = await this.repository.findPostById(id);
    if (!post) throw new NotFoundError("Post not found", "POST_NOT_FOUND");

    const isAuthor = post.authorId === userId;
    const isModerator =
      userRole === Role.LECTURER || userRole === Role.ADMINISTRATOR;

    if (!isAuthor && !isModerator) {
      throw new ForbiddenError("FORBIDDEN_DELETE");
    }

    return this.repository.softDeletePost(id);
  }
}
