import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import upload from "../middleware/upload";

const router = Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", upload.single("categoryImage"), createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
