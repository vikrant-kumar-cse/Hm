const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Grievance = require('../Models/Grievance');

// =======================
// Multer setup for file upload
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// =======================
// Submit Grievance
// @route   POST /grievance
// =======================
router.post('/', upload.single('document'), async (req, res) => {
  try {
    const { name, branch, rollNumber, problem } = req.body;

    const newGrievance = new Grievance({
      name,
      branch,
      rollNumber,
      problem,
      documentPath: req.file ? req.file.path : null,
      status: "Pending"   // default status
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
// @route   GET /grievance
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
// @route   PUT /grievance/:id/solve
// =======================
router.put('/:id/solve', async (req, res) => {
  try {
    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { status: "Solved" },
      { new: true }
    );
    if (!grievance) return res.status(404).json({ error: "Grievance not found" });

    res.json({ message: "✅ Grievance marked as solved", data: grievance });
  } catch (err) {
    console.error("❌ Error solving grievance:", err);
    res.status(500).json({ error: "Failed to update grievance" });
  }
});

// =======================
// Reject Grievance
// @route   PUT /grievance/:id/reject
// =======================
router.put('/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || reason.trim() === "") {
      return res.status(400).json({ error: "Rejection reason is required" });
    }

    const grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected", rejectionReason: reason },
      { new: true }
    );
    if (!grievance) return res.status(404).json({ error: "Grievance not found" });

    res.json({ message: "❌ Grievance rejected", data: grievance });
  } catch (err) {
    console.error("❌ Error rejecting grievance:", err);
    res.status(500).json({ error: "Failed to reject grievance" });
  }
});

module.exports = router;
