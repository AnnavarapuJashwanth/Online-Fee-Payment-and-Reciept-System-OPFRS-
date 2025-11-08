import express from "express";
import {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllAnnouncements);
router.get("/:id", getAnnouncementById);

// Protected routes (admin only for create/update/delete)
router.post("/", verifyToken, createAnnouncement);
router.put("/:id", verifyToken, updateAnnouncement);
router.delete("/:id", verifyToken, deleteAnnouncement);

export default router;
