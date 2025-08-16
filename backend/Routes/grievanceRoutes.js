const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Grievance = require('../Models/Grievance');
const nodemailer = require('nodemailer');

// =======================
// Nodemailer setup
// =======================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,      // .env me aapka email
    pass: process.env.EMAIL_PASS, // .env me aapka email password
  },
});

// =======================
// Multer setup for file upload
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// =======================
// Submit Grievance
// =======================
router.post('/', upload.single('document'), async (req, res) => {
  try {
    const { name, email, branch, rollNumber, hostel, floor, grievanceType, problem } = req.body;

    if (!name || !email || !branch || !rollNumber || !hostel || !floor || !grievanceType || !problem) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newGrievance = new Grievance({
      name,
      email,
      branch,
      rollNumber,
      hostel,
      floor,
      grievanceType,
      problem,
      document: req.file ? req.file.path : null,
      status: "Pending",
      forwardedToWarden: false
    });

    const saved = await newGrievance.save();
    res.status(201).json({ message: '✅ Grievance submitted successfully!', data: saved });
  } catch (err) {
    console.error('❌ Error saving grievance:', err);
    res.status(500).json({ error: 'Server error while saving grievance' });
  }
});

// =======================
// Get all Grievances
// =======================
router.get('/', async (req, res) => {
  try {
    const grievances = await Grievance.find().sort({ createdAt: -1 });
    res.json(grievances);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch grievances' });
  }
});

// =======================
// Mark Grievance as Solved
// =======================
router.put('/:id/solve', async (req, res) => {
  try {
    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { status: "Solved" },
      { new: true }
    );
    if (!grievance) return res.status(404).json({ error: "Grievance not found" });

    // Send email to student
    const mailOptions = {
      from: process.env.EMAIL,
      to: grievance.email,
      subject: 'Grievance Solved ✅',
      text: `Hello ${grievance.name},\n\nYour grievance has been solved.\n\nRegards,\nHostel Team`
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error('❌ Email sending error:', err);
      else console.log('📧 Email sent:', info.response);
    });

    res.json({ message: "✅ Grievance marked as solved", data: grievance });
  } catch (err) {
    console.error("❌ Error solving grievance:", err);
    res.status(500).json({ error: "Failed to update grievance" });
  }
});

// =======================
// Reject Grievance
// =======================
router.put('/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || reason.trim() === "") return res.status(400).json({ error: "Rejection reason is required" });

    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected", rejectionReason: reason },
      { new: true }
    );
    if (!grievance) return res.status(404).json({ error: "Grievance not found" });

    // Send email to student
    const mailOptions = {
      from: process.env.EMAIL,
      to: grievance.email,
      subject: 'Grievance Rejected ❌',
      text: `Hello ${grievance.name},\n\nYour grievance has been rejected.\nReason: ${reason}\n\nRegards,\nHostel Team`
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error('❌ Email sending error:', err);
      else console.log('📧 Email sent:', info.response);
    });

    res.json({ message: "❌ Grievance rejected", data: grievance });
  } catch (err) {
    console.error("❌ Error rejecting grievance:", err);
    res.status(500).json({ error: "Failed to reject grievance" });
  }
});

// =======================
// Forward to Warden
// =======================
router.put('/:id/forward', async (req, res) => {
  try {
    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { forwardedToWarden: true },
      { new: true }
    );
    if (!grievance) return res.status(404).json({ error: "Grievance not found" });

    // Send email to student
    const mailOptions = {
      from: process.env.EMAIL,
      to: grievance.email,
      subject: 'Grievance Forwarded ➡️',
      text: `Hello ${grievance.name},\n\nYour grievance has been forwarded to the Warden for further action.\n\nRegards,\nHostel Team`
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error('❌ Email sending error:', err);
      else console.log('📧 Email sent:', info.response);
    });

    res.json({ message: "➡️ Grievance forwarded to Warden", data: grievance });
  } catch (err) {
    console.error("❌ Error forwarding grievance:", err);
    res.status(500).json({ error: "Failed to forward grievance" });
  }
});

module.exports = router;
