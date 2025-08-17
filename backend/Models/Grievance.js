const mongoose = require("mongoose");

const GrievanceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true ,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address"
      ]

    }, // new email field
    branch: { type: String, required: true },
    rollNumber: { type: String, required: true },
    hostel: { type: String, required: true },
    floor: { type: String, required: true },
    grievanceType: { type: String, required: true },
    problem: { type: String, required: true , maxlength:6000},
    document: String,
    status: { type: String, default: "Pending" },
    rejectionReason: String,
    forwardedToWarden: { type: Boolean, default: false } // new field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Grievance", GrievanceSchema);
