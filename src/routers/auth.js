import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserController,loginUserController,logoutUserController, refreshUserController, requestResetEmailController } from "../controllers/auth.js";
import { registerSchema,loginSchema, requestResetEmailSchema } from "../validation/auth.js";
import { resetPasswordSchema } from '../validation/auth.js';
import { resetPasswordController } from '../controllers/auth.js';
const router = Router();

router.post("/register",validateBody(registerSchema), ctrlWrapper(registerUserController));
router.post("/login",validateBody(loginSchema), ctrlWrapper(loginUserController));
router.post('/logout', ctrlWrapper(logoutUserController));
router.post('/refresh', ctrlWrapper(refreshUserController));
router.post('/send-reset-email', validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController));
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);
export default router;