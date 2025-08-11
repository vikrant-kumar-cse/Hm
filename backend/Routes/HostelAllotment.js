const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Allotment = require('../Models/Allotments');

const router = express.Router();

// Upload Folder
const uploadPath = 'uploads/HostelAllotment';
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// ✅ POST /hostel/allotment — Submit allotment form
router.post('/allotment', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'aadhar', maxCount: 1 },
  { name: 'regSlip', maxCount: 1 },
  { name: 'hostelSlip', maxCount: 1 },
  { name: 'messSlip', maxCount: 1 },
]), async (req, res) => {
  try {
    const { personal, emergency, academic, hostel } = JSON.parse(req.body.data);

    const documents = {
      photo: req.files['photo']?.[0]?.filename || '',
      aadhar: req.files['aadhar']?.[0]?.filename || '',
      regSlip: req.files['regSlip']?.[0]?.filename || '',
      hostelSlip: req.files['hostelSlip']?.[0]?.filename || '',
      messSlip: req.files['messSlip']?.[0]?.filename || ''
    };

    const newAllotment = new Allotment({ personal, emergency, academic, hostel, documents });

    await newAllotment.save();
    res.status(201).json({ message: 'Allotment submitted successfully!', data: newAllotment });
  } catch (err) {
    console.error('Allotment Error:', err);
    res.status(500).json({ message: 'Failed to save allotment', error: err.message });
  }
});

// ✅ GET /hostel/all — Get all requests
router.get('/all', async (req, res) => {
  try {
    const records = await Allotment.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    console.error('Fetch All Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /hostel/caretaker-requests — Get requests for caretaker approval
// IMPORTANT: This must come BEFORE the /:id route
router.get('/caretaker-requests', async (req, res) => {
  try {
    const records = await Allotment.find({
      wardenApproval: true,  // Warden approved
      $or: [
        { caretackerApproval: { $exists: false } }, // Caretaker hasn't processed yet
        { caretackerApproval: null }
      ],
      status: 'Approved'  // Still approved status
    }).sort({ approvedAt: -1 }); // Sort by warden approval date
    
    res.status(200).json(records);
  } catch (error) {
    console.error('Fetch Caretaker Requests Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /hostel/caretaker-all-requests — Alternative route
// IMPORTANT: This must come BEFORE the /:id route
router.get('/caretaker-all-requests', async (req, res) => {
  try {
    const records = await Allotment.find({
      wardenApproval: true  // Show all warden-approved requests
    }).sort({ approvedAt: -1 });
    
    res.status(200).json(records);
  } catch (error) {
    console.error('Fetch All Caretaker Requests Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /hostel/preview/:id — With file URLs
// IMPORTANT: This must come BEFORE the general /:id route
router.get('/preview/:id', async (req, res) => {
  try {
    const record = await Allotment.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Not found' });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const docUrls = {};

    // ✅ Loop through all document fields
    Object.entries(record.documents).forEach(([key, filename]) => {
      if (filename) {
        docUrls[`${key}Url`] = `${baseUrl}/hostel-allotment/document/${filename}`;
      }
    });

    res.status(200).json({ message: 'Success', data: { ...record.toObject(), ...docUrls } });
  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).json({ message: 'Error fetching preview' });
  }
});

// ✅ GET /hostel/document/:filename — Serve document
router.get('/document/:filename', (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', uploadPath, req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });

    const ext = path.extname(req.params.filename).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png'
    };

    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${req.params.filename}"`);
    res.sendFile(filePath);
  } catch (error) {
    console.error('Document error:', error);
    res.status(500).json({ message: 'Error serving document' });
  }
});

// ✅ PUT /hostel/approve/:id — Warden Approve allotment
router.put('/approve/:id', async (req, res) => {
  try {
    const updated = await Allotment.findByIdAndUpdate(req.params.id, {
      status: 'Approved',
      wardenApproval: true,
      approvedAt: new Date()
    }, { new: true });

    if (!updated) return res.status(404).json({ message: 'Not found' });

    res.status(200).json({ message: 'Approved successfully', data: updated });
  } catch (err) {
    console.error('Approve Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PUT /hostel/caretacker-approve/:id — Caretaker Approve allotment
router.put('/caretacker-approve/:id', async (req, res) => {
  try {
    const updated = await Allotment.findByIdAndUpdate(req.params.id, {
      status: 'Approved',
      caretackerApproval: true,
      approvedAt: new Date()
    }, { new: true });

    if (!updated) return res.status(404).json({ message: 'Not found' });

    res.status(200).json({ message: 'Approved successfully', data: updated });
  } catch (err) {
    console.error('Approve Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PUT /hostel/reject/:id — Warden Reject allotment
router.put('/reject/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    const updated = await Allotment.findByIdAndUpdate(req.params.id, {
      status: 'Rejected',
      wardenApproval: false,
      rejectedAt: new Date(),
      rejectionReason: reason || 'No reason provided'
    }, { new: true });

    if (!updated) return res.status(404).json({ message: 'Not found' });

    res.status(200).json({ message: 'Rejected successfully', data: updated });
  } catch (err) {
    console.error('Reject Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PUT /hostel/caretacker-reject/:id — Caretaker Reject allotment
router.put('/caretacker-reject/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    const updated = await Allotment.findByIdAndUpdate(req.params.id, {
      status: 'Rejected',
      caretackerApproval: false,
      rejectedAt: new Date(),
      rejectionReason: reason || 'No reason provided'
    }, { new: true });

    if (!updated) return res.status(404).json({ message: 'Not found' });

    res.status(200).json({ message: 'Rejected successfully', data: updated });
  } catch (err) {
    console.error('Reject Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /hostel/:id — Get single record by ID
// IMPORTANT: This MUST be the LAST route because it catches everything
router.get('/:id', async (req, res) => {
  try {
    const record = await Allotment.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json(record);
  } catch (err) {
    console.error('Fetch Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;