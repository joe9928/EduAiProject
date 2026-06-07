import { Router } from "express";
import { authenticate, authorize } from "../../common/middleware/jwt.middleware";
import { validate, validateQuery } from "../../common/middleware/validate.middleware";
import { Role } from "@prisma/client";
import * as discussionController from "./discussion.controller";
import {
  createThreadSchema,
  createPostSchema,
  updateThreadSchema,
  updatePostSchema,
  moderateThreadSchema,
  threadFilterSchema,
} from "./discussion.validation";

const router = Router();

// ─── Thread routes ──────────────────────────────────────────────────────────

/**
 * POST /courses/:courseId/threads
 * Create a new thread.
 * Any authenticated user can create a thread. The course ID comes from the URL.
 * Validation ensures title & body lengths.
 */
router.post(
  "/courses/:courseId/threads",
  authenticate,
  validate(createThreadSchema),          // validate request body
  discussionController.createThread
);

/**
 * GET /courses/:courseId/threads
 * List threads for a course with pagination & optional search.
 * Query parameters are validated and coerced.
 */
router.get(
  "/courses/:courseId/threads",
  authenticate,
  validateQuery(threadFilterSchema),     // validate query string
  discussionController.getThreads
);

/**
 * GET /threads/:id
 * Retrieve a single thread with its nested post tree.
 */
router.get(
  "/threads/:id",
  authenticate,
  discussionController.getThread
);

/**
 * PATCH /threads/:id
 * Update a thread's title or body. Author check is performed inside the service.
 * We still validate the request body to enforce field constraints.
 */
router.patch(
  "/threads/:id",
  authenticate,
  validate(updateThreadSchema),          // even if optional fields, validates format
  discussionController.updateThread
);

/**
 * PATCH /threads/:id/moderate
 * Pin or lock a thread. Only LECTURER or ADMINISTRATOR may perform this action.
 * Authorization is enforced at the middleware level for early rejection,
 * and also re-checked in the service (defense in depth).
 */
router.patch(
  "/threads/:id/moderate",
  authenticate,
  authorize(Role.LECTURER, Role.ADMINISTRATOR), // immediate role gate
  validate(moderateThreadSchema),               // validate body (optional booleans)
  discussionController.moderateThread
);

/**
 * DELETE /threads/:id
 * Soft-delete a thread. The service checks whether the requester is the author
 * or a moderator. No body validation needed because no body is expected.
 */
router.delete(
  "/threads/:id",
  authenticate,
  discussionController.deleteThread
);

// ─── Post routes ────────────────────────────────────────────────────────────

/**
 * POST /threads/:id/posts
 * Add a new post to a thread. Requires a valid body.
 */
router.post(
  "/threads/:id/posts",
  authenticate,
  validate(createPostSchema),
  discussionController.createPost
);

/**
 * PATCH /posts/:id
 * Update a post's body. Only the author can do this (checked in service).
 */
router.patch(
  "/posts/:id",
  authenticate,
  validate(updatePostSchema),
  discussionController.updatePost
);

/**
 * DELETE /posts/:id
 * Soft-delete a post. Service checks author/moderator rights.
 */
router.delete(
  "/posts/:id",
  authenticate,
  discussionController.deletePost
);

export default router;