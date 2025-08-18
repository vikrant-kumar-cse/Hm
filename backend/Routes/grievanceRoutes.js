const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Grievance = require('../Models/Grievance');
const sendMail = require('../utils/sendEmail'); // ✅ reusable mail util

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
// Mark Grievance as Solved (Hostel Team)
// =======================
router.put('/:id/solve', async (req, res) => {
  try {
    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { status: "Solved" },
      { new: true }
    );
    if (!grievance) return res.status(404).json({ error: "Grievance not found" });

    await sendMail(
      grievance.email,
      'Grievance Solved ✅',
      `Hello ${grievance.name},\n\nYour grievance has been solved.\n\nRegards,\nHostel Team`
    );

    res.json({ message: "✅ Grievance marked as solved", data: grievance });
  } catch (err) {
    console.error("❌ Error solving grievance:", err);
    res.status(500).json({ error: "Failed to update grievance" });
  }
});

// =======================
// Reject Grievance (Hostel Team)
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

    await sendMail(
      grievance.email,
      'Grievance Rejected ❌',
      `Hello ${grievance.name},\n\nYour grievance has been rejected.\nReason: ${reason}\n\nRegards,\nHostel Team`
    );

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

    await sendMail(
      grievance.email,
      'Grievance Forwarded ➡️',
      `Hello ${grievance.name},\n\nYour grievance has been forwarded to the Warden for further action.\n\nRegards,\nHostel Team`
    );

    res.json({ message: "➡️ Grievance forwarded to Warden", data: grievance });
  } catch (err) {
    console.error("❌ Error forwarding grievance:", err);
    res.status(500).json({ error: "Failed to forward grievance" });
  }
});

// =======================
// Warden Solves/Rejects Grievance
// =======================
router.put('/warden/:id/update', async (req, res) => {
  try {
    const { status, reason } = req.body;

    if (!["Solved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Status must be Solved or Rejected" });
    }

    const updateData = { status };
    if (status === "Rejected") updateData.rejectionReason = reason;

    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!grievance) return res.status(404).json({ error: "Grievance not found" });

    // ✅ Prepare mail
    let subject, text;
    if (status === "Solved") {
      subject = "✅ Grievance Solved by Warden";
      text = `Hello ${grievance.name},\n\nYour grievance regarding "${grievance.problem}" has been solved by the Warden.\n\nRegards,\nHostel Management`;
    } else {
      subject = "❌ Grievance Rejected by Warden";
      text = `Hello ${grievance.name},\n\nYour grievance regarding "${grievance.problem}" has been rejected by the Warden.\nReason: ${reason}\n\nRegards,\nHostel Management`;
    }

    await sendMail(grievance.email, subject, text);

    res.json({ message: `Grievance ${status.toLowerCase()} by Warden`, data: grievance });
  } catch (err) {
    console.error("❌ Error updating grievance by warden:", err);
    res.status(500).json({ error: "Failed to update grievance" });
  }
});

module.exports = router;
