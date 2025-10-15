import { Router } from "express";
import { getStudentsController, getStudentByIdController,createStudentController,patchStudentController, deleteStudentController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createStudentSchema, UpdateStudentSchema } from "../validation/students.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
// import { checkRoles } from '../middlewares/checkRoles.js';
// import { ROLES } from '../constants/index.js';
const router = Router();
router.use(authenticate);
router.get('/', ctrlWrapper(getStudentsController));
          
router.get("/:contactId", isValidId, ctrlWrapper(getStudentByIdController));

router.post("/", validateBody(createStudentSchema), ctrlWrapper(createStudentController));

router.patch("/:contactId", isValidId, validateBody(UpdateStudentSchema), ctrlWrapper(patchStudentController));

router.delete("/:contactId", isValidId, ctrlWrapper(deleteStudentController));

export default router;