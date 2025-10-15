import { Router } from "express";
import { getStudentsController, getStudentByIdController,createStudentController,patchStudentController, deleteStudentController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createStudentSchema, UpdateStudentSchema } from "../validation/students.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/index.js';
const router = Router();
router.use(authenticate);
router.get('/', checkRoles(ROLES.TEACHER), ctrlWrapper(getStudentsController));
          
router.get("/:contactId",checkRoles(ROLES.TEACHER, ROLES.PARENT), isValidId, ctrlWrapper(getStudentByIdController));

router.post("/",checkRoles(ROLES.TEACHER), validateBody(createStudentSchema), ctrlWrapper(createStudentController));

router.patch("/:contactId", isValidId,checkRoles(ROLES.TEACHER, ROLES.PARENT), validateBody(UpdateStudentSchema), ctrlWrapper(patchStudentController));

router.delete("/:contactId", isValidId,checkRoles(ROLES.TEACHER), ctrlWrapper(deleteStudentController));

export default router;