import express from "express";
import { getStudentFees, getStudentPaymentSummary } from "../controllers/studentFeeController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Student fee routes (protected with verifyToken)
router.get("/student", verifyToken, getStudentFees);
router.get("/student/summary", verifyToken, getStudentPaymentSummary);

export default router;
