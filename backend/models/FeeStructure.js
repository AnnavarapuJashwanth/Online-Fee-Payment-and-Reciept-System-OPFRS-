import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema({
  feeName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Tuition", "Examination", "Library", "Laboratory", "Sports", "Transportation", "Hostel", "Miscellaneous"],
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  lateFee: {
    type: Number,
    default: 0,
    min: 0,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  description: {
    type: String,
    trim: true,
  },
  applicableClasses: {
    type: [String],
    default: ["All Classes"],
  },
  department: {
    type: String,
    trim: true,
  },
  semester: {
    type: String,
    trim: true,
  },
  program: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
feeStructureSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("FeeStructure", feeStructureSchema);
