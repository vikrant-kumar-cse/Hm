const mongoose = require('mongoose');

const allotmentSchema = new mongoose.Schema({
  personal: {
    firstName: String,
    lastName: String,
    fatherName: String,
    motherName: String,
    dob: String,
    gender: String,
    pwd: String,
    address: String,
    district: String,
    state: String,
    country: String,
    mobile: String,
    altContact: String,
  },
  emergency: {
    contactFirstName: String,
    contactLastName: String,
    email: String,
    mobilee: String,
  },
  academic: {
    rollNumber: {
      type: String,
      required: true,
      index: true
    },
    regNumber: String,
    branch: String,
    semester: String,
  },
  hostel: {
    hostelName: String,
    roomNumber: String,
  },
  documents: {
    photo: String,
    aadhar: String,
    regSlip: String,
    hostelSlip: String,
    messSlip: String,
  },

  // ✅ Status and Approval Fields
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  wardenApproval: {
    type: Boolean,
    default: false
  },
  caretackerApproval: {
    type: Boolean,
    default: false
  },
  approvedAt: Date,
  rejectedAt: Date,
  rejectionReason: String

}, {
  timestamps: true // ✅ Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Allotment', allotmentSchema);
