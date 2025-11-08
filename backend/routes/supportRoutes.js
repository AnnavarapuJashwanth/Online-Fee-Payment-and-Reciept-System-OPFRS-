import express from "express";
import {
  getUserTickets,
  getAllTickets,
  createTicket,
  addResponse,
  updateTicketStatus,
  getTicketById,
} from "../controllers/supportController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// User routes (protected with verifyToken)
router.get("/user", verifyToken, getUserTickets);
router.get("/:id", verifyToken, getTicketById);
router.post("/", verifyToken, createTicket);
router.post("/:id/response", verifyToken, addResponse);

// Admin routes (protected with verifyAdmin)
router.get("/admin/tickets", verifyAdmin, getAllTickets);
router.get("/all", verifyAdmin, getAllTickets); // Keep for backward compatibility
router.put("/:id/status", verifyAdmin, updateTicketStatus);

export default router;
