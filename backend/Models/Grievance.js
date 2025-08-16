// models/Grievance.js
const mongoose = require("mongoose");

const grievanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  branch: { type: String, required: true },
  rollNumber: { type: String, required: true },
  problem: { type: String, required: true },

  // Path to uploaded document
  documentPath: { type: String, default: "" },

  // Status of grievance
  status: {
    type: String,
    enum: ["Pending", "Solved", "Rejected"],
    default: "Pending",
  },

  // Reason only needed if rejected
  rejectionReason: { type: String, default: "" },
});

module.exports = mongoose.model("Grievance", grievanceSchema);
