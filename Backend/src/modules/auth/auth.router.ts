import { Router } from "express";
import { validate } from "../../common/middleware/validate.middleware";
import { registerSchema, loginSchema } from "./auth.validation";
import { register, login, refresh, logout, getMe } from "./auth.controller";
import { authenticate } from "../../common/middleware/jwt.middleware";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

export default router;