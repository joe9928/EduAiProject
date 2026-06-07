import { PaginatedResult } from "../../common/types/pagination.types";

// ─── Request DTOs ────────────────────────────────────────────────────────────
/**
 * Payload for creating a new thread.
 * Both title and body are required because a thread must start with content.
 * The author is taken from the authenticated user; do **not** include it in the payload.
 *
 * @example
 * // POST /api/threads
 * {
 *   "title": "Welcome to the forum",
 *   "body": "Introduce yourself..."
 * }
 */
export interface CreateThreadDto {
  title: string;
  body: string;
}

export interface CreatePostDto {
  body: string;
  parentId?: string; // optional — only present for nested replies
}

export interface UpdateThreadDto {
  title?: string;
  body?: string;
}

export interface UpdatePostDto {
  body: string;
}

export interface ModerateThreadDto {
  isPinned?: boolean;
  isLocked?: boolean;
}

// ─── Response DTOs ───────────────────────────────────────────────────────────

export interface AuthorDto {
  id: string;
  firstName: string;
  lastName: string;
}

/**
 * Recursive tree node representing a post and its nested replies.
 * Leaf posts have an empty `replies` array.
 *
 * **Important:** This structure is assembled by {@link PostService.toTree} from a flat
 * list of posts. It assumes a small-to-medium thread size (<500 posts). For massive
 * threads, consider using a separate flat paginated endpoint.
 */
export interface PostDto {
  id: string;
  body: string;
  author: AuthorDto;
  parentId: string | null;
  createdAt: Date;
  //Descedant posts , ordered by creation date ascending 
  replies: PostDto[];
}

export interface ThreadListItemDto {
  id: string;
  title: string;
  author: AuthorDto;
  isPinned: boolean;
  isLocked: boolean;
  postCount: number;
  createdAt: Date;
}

export interface ThreadDetailDto {
  id: string;
  courseId: string;
  title: string;
  body: string;
  author: AuthorDto;
  isPinned: boolean;
  isLocked: boolean;
  posts: PostDto[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Paginated aliases ────────────────────────────────────────────────────────

export type ThreadPaginatedResult = PaginatedResult<ThreadListItemDto>;