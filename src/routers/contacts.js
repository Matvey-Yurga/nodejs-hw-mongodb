import { Router } from "express";
import { getStudentsController, getStudentByIdController,createStudentController,patchStudentController, deleteStudentController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
const router = Router();
router.get('/', ctrlWrapper(getStudentsController));
          
router.get("/:contactId", ctrlWrapper(getStudentByIdController));

router.post("/", ctrlWrapper(createStudentController));

router.patch("/:contactId", ctrlWrapper(patchStudentController));

router.delete("/:contactId", ctrlWrapper(deleteStudentController));

export default router;