import Announcement from "../models/Announcement.js";

// Get all announcements
export const getAllAnnouncements = async (req, res) => {
  try {
    const { category, priority } = req.query;
    const filter = {};
    
    if (category && category !== "All Announcements") {
      filter.category = category;
    }
    if (priority) {
      filter.priority = priority;
    }

    const announcements = await Announcement.find(filter)
      .sort({ createdAt: -1 })
      .populate("postedBy", "name email");

    res.json({
      success: true,
      announcements,
      count: announcements.length,
    });
  } catch (error) {
    console.error("❌ Error fetching announcements:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single announcement
export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate("postedBy", "name email");

    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    res.json({ success: true, announcement });
  } catch (error) {
    console.error("❌ Error fetching announcement:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create announcement (admin only)
export const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      postedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    console.error("❌ Error creating announcement:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update announcement
export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    res.json({
      success: true,
      message: "Announcement updated successfully",
      announcement,
    });
  } catch (error) {
    console.error("❌ Error updating announcement:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    res.json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting announcement:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
