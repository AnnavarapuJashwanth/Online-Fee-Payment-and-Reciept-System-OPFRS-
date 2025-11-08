import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    regno: { // ✅ consistent lowercase field
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true, 
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    // Profile fields
    year: {
      type: String,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      default: "1st Year",
    },
    semester: {
      type: String,
      enum: ["1st Semester", "2nd Semester"],
      default: "1st Semester",
    },
    branch: {
      type: String,
      enum: [
        "Computer Science and Engineering",
        "CSE - AI & ML",
        "CSE - Cyber Security",
        "CSE - Data Science",
        "CSE - IoT",
        "Electronics and Communication Engineering",
        "Electrical and Electronics Engineering",
        "Mechanical Engineering",
        "Chemical Engineering",
        "Agriculture Engineering",
        "Civil Engineering",
        "Textile Technology",
        "Biotechnology",
        "Bioinformatics",
        "Food Technology"
      ],
      default: "Computer Science and Engineering",
    },
    section: {
      type: String,
      default: "A",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["Category A", "Category B"],
      default: "Category A",
    },
    // Fee details
    semesterFee: {
      type: Number,
      default: 50000, // Default semester fee
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    pendingFee: {
      type: Number,
      default: function() {
        return this.semesterFee;
      },
    },
  },
  { timestamps: true }
);

// ✅ ensure indexes are updated cleanly
userSchema.index({ regno: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
