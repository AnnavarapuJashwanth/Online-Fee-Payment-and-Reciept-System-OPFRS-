import Support from "../models/Support.js";

// Get user support tickets
export const getUserTickets = async (req, res) => {
  try {
    const tickets = await Support.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tickets,
      count: tickets.length,
    });
  } catch (error) {
    console.error("❌ Error fetching tickets:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all support tickets (admin)
export const getAllTickets = async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;

    const tickets = await Support.find(filter)
      .populate("userId", "name email regno")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tickets,
      count: tickets.length,
    });
  } catch (error) {
    console.error("❌ Error fetching tickets:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create support ticket
export const createTicket = async (req, res) => {
  try {
    const { subject, category, priority, description, attachments } = req.body;

    console.log("📝 Creating support ticket for user:", req.user._id);
    console.log("📝 Ticket data:", { subject, category, priority, description });

    // Validate required fields
    if (!subject || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "Subject, category, and description are required",
      });
    }

    const ticket = await Support.create({
      userId: req.user._id,
      subject,
      category,
      priority: priority || "Medium",
      description,
      attachments: attachments || [],
    });

    console.log("✅ Support ticket created:", ticket.ticketId);

    res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error("❌ Error creating ticket:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add response to ticket
export const addResponse = async (req, res) => {
  try {
    const { message, isStaff } = req.body;

    const ticket = await Support.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    ticket.responses.push({
      respondedBy: req.user._id,
      message,
      isStaff: isStaff || false,
      timestamp: Date.now(),
    });

    if (ticket.status === "Open") {
      ticket.status = "In Progress";
    }

    await ticket.save();

    res.json({
      success: true,
      message: "Response added successfully",
      ticket,
    });
  } catch (error) {
    console.error("❌ Error adding response:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update ticket status
export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await Support.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === "Resolved" && { resolvedDate: Date.now() }),
      },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    res.json({
      success: true,
      message: "Ticket status updated successfully",
      ticket,
    });
  } catch (error) {
    console.error("❌ Error updating ticket:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id)
      .populate("userId", "name email regno")
      .populate("responses.respondedBy", "name email");

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    res.json({ success: true, ticket });
  } catch (error) {
    console.error("❌ Error fetching ticket:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
