const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose");
const MessDeductionRequest = require('../Models/MessDeductionRequest');

// Multer setup for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPEG, PNG allowed'), false);
    }
  }
});

// POST /messdeduction/mess — Submit request with file
router.post('/mess', upload.single('document'), async (req, res) => {
  try {
    const {
      studentID,
      nameOfStudent,
      rollNumber,
      branchAndSem,
      roomNo,
      numberOfDays,
      fromDate,
      toDate,
      reason
    } = req.body;

    const documents = {};
    if (req.file) {
      documents.document = req.file.filename;
    }

    // Set initial status to 'Pending'
    const newRequest = new MessDeductionRequest({
      studentID,
      nameOfStudent,
      rollNumber,
      branchAndSem,
      roomNo,
      numberOfDays,
      fromDate,
      toDate,
      reason,
      documents,
      status: 'Pending',         // <-- Added initial status
      wardenApproval: false,
      messManagerApproval: false,
      caretackerApproval: false
    });

    await newRequest.save();

    // Real-time notification emit
    const io = req.app.get('io');
    io.emit('mess-deduction-submitted', {
      type: 'NEW_MESS_REQUEST',
      title: 'New Mess Reduction Request Submitted',
      student: nameOfStudent,
      roll: rollNumber,
      requestId: newRequest._id,
      time: new Date()
    });

    res.status(201).json({
      message: 'Mess deduction request submitted successfully',
      data: newRequest
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit request', error: err.message });
  }
});

// GET /messdeduction/all — Get all mess deduction requests 
router.get('/all', async (req, res) => {
  try {
    const allRequests = await MessDeductionRequest.find().sort({ createdAt: -1 });
    res.status(200).json(allRequests);
  } catch (error) {
    console.error('Error fetching all mess deduction requests:', error);
    res.status(500).json({ message: 'Server error while fetching all records' });
  }
});

// GET /messdeduction/:rollNumber — Fetch data by rollNumber
router.get('/:rollNumber', async (req, res) => {
  const rollNumber = req.params.rollNumber;

  try {
    const data = await MessDeductionRequest.find({ rollNumber: rollNumber.trim() });

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No record found for this roll number' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching mess deduction data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /messdeduction/decision/:id — Approve or Reject by Warden
router.put('/decision/:id', async (req, res) => {
  const { id } = req.params;
  const { decision } = req.body;

  if (!["approve", "reject"].includes(decision)) {
    return res.status(400).json({ message: 'Invalid decision' });
  }

  try {
    const updated = await MessDeductionRequest.findByIdAndUpdate(
      id,
      {
        status: decision === "approve" ? "Approved" : "Rejected",
        wardenApproval: decision === "approve"
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({
      message: `Request ${decision}d successfully`,
      data: updated
    });
  } catch (error) {
    console.error('Decision error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /messdeduction/approve/:id — Approve request by Warden
router.put('/approve/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRequest = await MessDeductionRequest.findByIdAndUpdate(
      id,
      {
        status: 'Approved',
        wardenApproval: true,
        approvedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Mess deduction request not found' });
    }

    const io = req.app.get('io');
    io.emit(`mess-approved-${updatedRequest.rollNumber}`, {
      type: 'MESS_REQUEST_APPROVED',
      title: 'Your Mess Reduction Request was Approved',
      student: updatedRequest.nameOfStudent,
      time: new Date(),
      requestId: updatedRequest._id
    });

    res.status(200).json({
      message: 'Mess deduction request approved successfully',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error approving mess deduction request:', error);
    res.status(500).json({ message: 'Server error while approving request' });
  }
});

// PUT /messdeduction/reject/:id — Reject mess deduction request
router.put('/reject/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const updatedRequest = await MessDeductionRequest.findByIdAndUpdate(
      id,
      {
        status: 'Rejected',
        wardenApproval: false,
        rejectedAt: new Date(),
        rejectionReason: rejectionReason || 'No reason provided',
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Mess deduction request not found' });
    }

    res.status(200).json({
      message: 'Mess deduction request rejected successfully',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error rejecting mess deduction request:', error);
    res.status(500).json({ message: 'Server error while rejecting request' });
  }
});

// GET /messdeduction/document/:filename — Serve documents
router.get('/document/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';

    switch (ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving document:', error);
    res.status(500).json({ message: 'Error serving document' });
  }
});

// GET /messdeduction/preview/:id — Preview a single request with document URL
router.get('/preview/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const messDeductionRequest = await MessDeductionRequest.findById(id);

    if (!messDeductionRequest) {
      return res.status(404).json({ message: 'Mess deduction request not found' });
    }

    let responseData = messDeductionRequest.toObject();

    if (messDeductionRequest.documents && messDeductionRequest.documents.document) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      responseData.documentUrl = `${baseUrl}/messdeduction/document/${messDeductionRequest.documents.document}`;
    }

    res.status(200).json({
      message: 'Mess deduction request fetched successfully',
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching mess deduction request:', error);
    res.status(500).json({ message: 'Server error while fetching request' });
  }
});

// Mess Manager Routes
router.get('/messmanager/requests', async (req, res) => {
  try {
    // Approved by warden only (wardenApproval: true boolean)
    const approvedRequests = await MessDeductionRequest.find({ wardenApproval: true });
    res.status(200).json(approvedRequests);
  } catch (error) {
    console.error('Error fetching approved requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/messmanager_approve/:id', async(req,res) => {
  try {
    const { id } = req.params;

    const updatedRequest = await MessDeductionRequest.findByIdAndUpdate(
      id,
      { 
        status: 'Approved',
        messManagerApproval: true,
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Mess deduction request not found' });
    }

    res.status(200).json({
      message: 'Mess deduction request approved successfully',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error approving mess deduction request:', error);
    res.status(500).json({ message: 'Server error while approving request' });
  }
});

// Caretaker routes
router.get('/caretacker/requests', async (req, res) => {
  try {
    const approvedRequests = await MessDeductionRequest.find({
      wardenApproval: true,
      messManagerApproval: true,
    });
    res.status(200).json(approvedRequests);
  } catch (error) {
    console.error('Error fetching approved requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/approve-caretaker/:id', async(req,res) => {
  try {
    const {id} = req.params;

    const updatedRequest = await MessDeductionRequest.findByIdAndUpdate(
      id,
      { 
        status: 'Approved',
        caretackerApproval: true,
        approvedAt: new Date()
      },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Mess deduction request not found' });
    }

    res.status(200).json({
      message: 'Mess deduction request approved successfully',
      data: updatedRequest
    });

  } catch(error) {
    res.status(500).json({message:'Server Error'});
  }
});

// Tracking - Get request by ID
router.get("/student/:requestId", async (req, res) => {
  try {
    const requestId = new mongoose.Types.ObjectId(req.params.requestId);

    const request = await MessDeductionRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid request ID" });
  }
});


// **NEW** Warden page fetch only pending requests
// GET /messdeduction/warden/requests — Get only requests with status 'Pending'
router.get('/warden/requests', async (req, res) => {
  try {
    const pendingRequests = await MessDeductionRequest.find({ status: 'Pending' }).sort({ createdAt: -1 });
    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error('Error fetching pending requests for warden:', error);
    res.status(500).json({ message: 'Server error while fetching pending requests' });
  }
});

// GET /messdeduction/caretaker/pending — requests approved by messManager but NOT approved by caretaker
router.get('/caretaker/pending', async (req, res) => {
  try {
    const pendingCaretakerRequests = await MessDeductionRequest.find({
      messManagerApproval: true,
      caretackerApproval: false
    }).sort({ createdAt: -1 });

    res.status(200).json(pendingCaretakerRequests);
  } catch (error) {
    console.error('Error fetching caretaker pending requests:', error);
    res.status(500).json({ message: 'Server error while fetching caretaker pending requests' });
  }
});

// GET /messdeduction/caretaker/today — Approved by caretaker & in today's range
router.get('/caretaker/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of next day

    const approvedToday = await MessDeductionRequest.find({
      caretackerApproval: true,
      fromDate: { $lte: today },   // From date is today or earlier
      toDate: { $gte: today }      // To date is today or later
    }).sort({ createdAt: -1 });

    res.status(200).json(approvedToday);
  } catch (error) {
    console.error('Error fetching today caretaker approved requests:', error);
    res.status(500).json({ message: 'Server error while fetching today caretaker approved requests' });
  }
});


router.get('/status/:rollNumber', async (req, res) => {
  const rollNumber = req.params.rollNumber; 
  try {
    const status = await MessDeductionRequest
      .findOne({ rollNumber: rollNumber.trim() })
      .sort({ createdAt: -1 });

    if (!status) {
      return res.status(404).json({ message: 'Please Give Correct Roll Number' });
    }

    res.status(200).json(status);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});



module.exports = router;
