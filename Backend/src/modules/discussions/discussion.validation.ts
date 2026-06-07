import { z } from "zod";

/**
 * Validation schemas for all forum HTTP request payloads and query parameters.
 *
 * These schemas are applied by the `ZodValidationPipe` (see `src/pipes/zod.pipe.ts`).
 * They enforce structural and format constraints. **Domain rules** (e.g., whether
 * a parent post exists or a thread is locked) are checked in the service layer.
 */

/**
 * Schema for creating a new thread.
 *
 * The author is resolved from the authenticated user, not from the payload.
 * Title and body will be further sanitized (XSS, Markdown stripping) by
 * {@link ThreadService.create} before storage.
 */
export const createThreadSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  body: z
    .string()
    .min(1, "Body is required")
    .max(10000, "Body must be at most 10,000 characters"),
});

/**
 * Schema for creating a post (reply) in a thread.
 *
 * `parentId` is optional; if omitted the post becomes a top‑level reply.
 * When provided, it must be a valid UUID and will be verified in the service
 * to belong to the same thread and not be a reply to a locked thread.
 */
export const createPostSchema = z.object({
  body: z.string().min(1, "Reply body is required").max(10000),
  parentId: z
    .string()
    .uuid("Invalid parent post ID")
    .optional()
    .describe("ID of the post being replied to, or omit for top‑level"),
});

/**
 * Partial update schema for a thread. All fields optional – only the provided
 * fields will be updated. The service ensures that `title` uniqueness is checked
 * if supplied.
 */
export const updateThreadSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  body: z.string().min(1).max(10000).optional(),
});

/**
 * Post updates are restricted to the body only – a post cannot be moved to a
 * different thread after creation (business rule). The author cannot be changed.
 */
export const updatePostSchema = z.object({
  body: z.string().min(1, "Body is required").max(10000),
});

/**
 * Moderation actions on a thread. Both flags are optional because the moderator
 * may only want to change one setting. To **unpin** or **unlock**, explicitly
 * send `false` for the respective flag. An empty payload `{}` leaves the current
 * state unchanged.
 */
export const moderateThreadSchema = z.object({
  isPinned: z.boolean().optional(),
  isLocked: z.boolean().optional(),
});

/**
 * Query parameters for listing threads with pagination and optional full‑text search.
 *
 * - `page` defaults to 1 (first page).
 * - `limit` defaults to 20, max 100 to prevent large data scans.
 * - `search` accepts a keyword up to 100 characters; the service applies it
 *   as a LIKE / full‑text search on thread titles.
 *
 * Query strings are coerced automatically, so clients can send `page=1` as a string.
 */
export const threadFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().max(100).optional(),
});

// ─── Type inference ─────────────────────────────────────────────────────
export type CreateThreadInput = z.infer<typeof createThreadSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdateThreadInput = z.infer<typeof updateThreadSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type ModerateThreadInput = z.infer<typeof moderateThreadSchema>;
export type ThreadFilterInput = z.infer<typeof threadFilterSchema>;