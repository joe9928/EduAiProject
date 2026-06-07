import { Prisma, DiscussionThread, DiscussionPost } from "@prisma/client";
import { prisma } from "../../database/prisma.client";
import {
  CreateThreadDto,
  CreatePostDto,
  UpdateThreadDto,
  UpdatePostDto,
  ModerateThreadDto,
  ThreadListItemDto,
  ThreadDetailDto,
  PostDto,
  ThreadPaginatedResult,
} from "./discussion.types";
import { ThreadFilterInput } from "./discussion.validation";

// Author select shape — reused across queries to avoid repetition
const authorSelect = {
  id: true,
  firstName: true,
  lastName: true,
};

export class DiscussionRepository {
  // ─── Threads ──────────────────────────────────────────────────────────────

  async createThread(
    dto: CreateThreadDto,
    courseId: string,
    authorId: string,
  ): Promise<DiscussionThread> {
    return prisma.discussionThread.create({
      data: {
        title: dto.title,
        body: dto.body,
        courseId,
        authorId,
      },
    });
  }

  async findThreadsByCourse(
    courseId: string,
    filters: ThreadFilterInput,
  ): Promise<ThreadPaginatedResult> {
    const { page, limit, search } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.DiscussionThreadWhereInput = {
      courseId,
      deletedAt: null,
    };

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const [threads, total] = await Promise.all([
      prisma.discussionThread.findMany({
        where,
        skip,
        take: limit,
        // Pinned threads appear first, then newest first
        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
        include: {
          author: { select: authorSelect },
          // _count gives post count without loading all post records
          _count: { select: { posts: { where: { deletedAt: null } } } },
        },
      }),
      prisma.discussionThread.count({ where }),
    ]);

    const data: ThreadListItemDto[] = threads.map((t) => ({
      id: t.id,
      title: t.title,
      author: t.author,
      isPinned: t.isPinned,
      isLocked: t.isLocked,
      // _count.posts gives the number of non-deleted posts
      postCount: t._count.posts,
      createdAt: t.createdAt,
    }));

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findThreadById(id: string): Promise<DiscussionThread | null> {
    return prisma.discussionThread.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findThreadWithPosts(id: string): Promise<ThreadDetailDto | null> {
    const thread = await prisma.discussionThread.findUnique({
      where: { id, deletedAt: null },
      include: {
        author: { select: authorSelect },
        posts: {
          where: { deletedAt: null },
          orderBy: { createdAt: "asc" },
          include: {
            author: { select: authorSelect },
          },
        },
      },
    });

    if (!thread) return null;

    // Flatten DB posts into nested tree structure
    // DB stores parentId — we build the parent/child tree in memory
    return {
      id: thread.id,
      courseId: thread.courseId,
      title: thread.title,
      body: thread.body,
      author: thread.author,
      isPinned: thread.isPinned,
      isLocked: thread.isLocked,
      posts: this.buildPostTree(thread.posts),
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    };
  }

  async updateThread(
    id: string,
    dto: UpdateThreadDto,
  ): Promise<DiscussionThread> {
    return prisma.discussionThread.update({
      where: { id },
      data: dto,
    });
  }

  async moderateThread(
    id: string,
    dto: ModerateThreadDto,
  ): Promise<DiscussionThread> {
    return prisma.discussionThread.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Soft-deletes a thread by setting `deletedAt`.
   *
   * **Downstream visibility:**
   * - The thread itself is excluded by all queries that filter `deletedAt: null`.
   * - Its posts are **not** individually updated; they become invisible because
   *   the only paths to fetch posts are through the parent thread’s visibility.
   * - If direct post queries are added in the future, they must also respect
   *   `deletedAt` on the parent thread to maintain this invariant.
   */
  async softDeleteThread(id: string): Promise<DiscussionThread> {
    // Soft delete — set deletedAt timestamp, keep the row
    // Replies are hidden implicitly because we always
    // filter through the parent thread first
    return prisma.discussionThread.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ─── Posts ────────────────────────────────────────────────────────────────

  async createPost(
    dto: CreatePostDto,
    threadId: string,
    authorId: string,
  ): Promise<DiscussionPost> {
    return prisma.discussionPost.create({
      data: {
        body: dto.body,
        threadId,
        authorId,
        // null if top-level reply, parentId if nested
        parentId: dto.parentId ?? null,
      },
    });
  }

  async findPostById(id: string): Promise<DiscussionPost | null> {
    return prisma.discussionPost.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async updatePost(id: string, dto: UpdatePostDto): Promise<DiscussionPost> {
    return prisma.discussionPost.update({
      where: { id },
      data: { body: dto.body },
    });
  }

  async softDeletePost(id: string): Promise<DiscussionPost> {
    return prisma.discussionPost.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Transforms a flat array of posts (adjacency list) into a nested tree
   * of {@link PostDto} objects, matching the recursive structure expected
   * by the API consumer.
   *
   * **Algorithm:**
   * 1. First pass: create a {@link PostDto} for each post (with empty `replies`)
   *    and store them in a Map keyed by ID.
   * 2. Second pass: for each post, if it has a `parentId`, push it into its
   *    parent's `replies` array; otherwise it becomes a root node.
   *
   * **Orphan handling:** If a post references a `parentId` that is not present
   * in the flat list (e.g., the parent was soft-deleted), that post is silently
   * dropped. This means deleting a post effectively deletes its entire reply
   * subtree. This behaviour is intentional; it keeps the tree consistent
   * without placeholder “deleted” nodes. Change with caution.
   *
   * **Performance:** Two passes over O(n) nodes, O(n) memory. Suitable for
   * threads with up to ~500 posts. Larger threads should move to a paginated,
   * flat representation.
   *
   * @param posts - Flat list of non-deleted posts including author data.
   * @returns The root-level posts with nested replies.
   */
  private buildPostTree(
    posts: Array<{
      id: string;
      body: string;
      author: { id: string; firstName: string; lastName: string };
      parentId: string | null;
      createdAt: Date;
    }>,
  ): PostDto[] {
    const map = new Map<string, PostDto>();
    const roots: PostDto[] = [];

    // First pass — create PostDto for every post
    for (const post of posts) {
      map.set(post.id, {
        id: post.id,
        body: post.body,
        author: post.author,
        parentId: post.parentId,
        createdAt: post.createdAt,
        replies: [],
      });
    }

    // Second pass — wire children to parents
    for (const post of posts) {
      const node = map.get(post.id)!;
      if (post.parentId) {
        // Has a parent — push into parent's replies
        const parent = map.get(post.parentId);
        if (parent) parent.replies.push(node);
      } else {
        // No parent — this is a root post
        roots.push(node);
      }
    }

    return roots;
  }
}
