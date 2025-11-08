import express from "express";
import {
  getUserRefunds,
  getAllRefunds,
  createRefund,
  updateRefundStatus,
  getRefundById,
} from "../controllers/refundController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.get("/user", verifyToken, getUserRefunds);
router.get("/all", verifyToken, getAllRefunds);
router.get("/:id", verifyToken, getRefundById);
router.post("/", verifyToken, createRefund);
router.put("/:id", verifyToken, updateRefundStatus);

export default router;
