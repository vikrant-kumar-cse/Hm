const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Notice = require('../Models/Notice');

const router = express.Router();

// Upload Folder
const uploadPath = 'uploads/Notices';
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ✅ POST /notices/upload — Upload a new notice
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const newNotice = new Notice({
      title,
      description,
      file: req.file?.filename || null
    });
    await newNotice.save();
    res.status(201).json({ message: 'Notice uploaded successfully', data: newNotice });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /notices/all — Get all notices
router.get('/all', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (err) {
    console.error('Fetch Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ DELETE /notices/delete/:id — Delete a notice
router.delete('/delete/:id', async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    // Delete file if exists
    if (notice.file) {
      const filePath = path.join(__dirname, '..', uploadPath, notice.file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET /notices/file/:filename — Serve file
router.get('/file/:filename', (req, res) => {
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
  } catch (err) {
    console.error('File Error:', err);
    res.status(500).json({ message: 'File serving error' });
  }
});

module.exports = router;
