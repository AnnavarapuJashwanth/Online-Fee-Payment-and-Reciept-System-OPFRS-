import express from "express";
import {
  getUserScholarships,
  getAllScholarships,
  createScholarship,
  updateScholarshipStatus,
  getScholarshipById,
} from "../controllers/scholarshipController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.get("/user", verifyToken, getUserScholarships);
router.get("/all", verifyToken, getAllScholarships);
router.get("/:id", verifyToken, getScholarshipById);
router.post("/", verifyToken, createScholarship);
router.put("/:id", verifyToken, updateScholarshipStatus);

export default router;
