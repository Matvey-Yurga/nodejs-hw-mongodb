import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserController,loginUserController,logoutUserController, refreshUserController } from "../controllers/auth.js";
import { registerSchema,loginSchema } from "../validation/auth.js";

const router = Router();

router.post("/register", ctrlWrapper(registerUserController), validateBody(registerSchema));
router.post("/login", ctrlWrapper(loginUserController), validateBody(loginSchema));
router.post('/logout', ctrlWrapper(logoutUserController));
router.post('/refresh', ctrlWrapper(refreshUserController));
export default router;