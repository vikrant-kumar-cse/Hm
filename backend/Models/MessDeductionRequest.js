const mongoose = require("mongoose");

const messDeductionRequestSchema = new mongoose.Schema({
  studentID: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  nameOfStudent: String,
  rollNumber: String,
  branchAndSem: String,
  roomNo: String,
  numberOfDays: Number,
  fromDate: Date,
  toDate: Date,
  reason: String,
  email: { type: String, required: true },  // ✅ student email
  documents: {
    document: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  wardenApproval: { type: Boolean, default: false },
  messManagerApproval: { type: Boolean, default: false },
  caretackerApproval: { type: Boolean, default: false },
  rejectionReason: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MessDeductionRequest", messDeductionRequestSchema);
