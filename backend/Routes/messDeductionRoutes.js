const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const MessDeductionRequest = require('../Models/MessDeductionRequest');

// Set up multer for document uploads
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

// ✅ POST /messdeduction/mess — Submit request with file
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
      documents
    });

    await newRequest.save();

    // 🔔 Real-time notification emit
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

// ✅ GET /messdeduction/all — Get all mess deduction requests 
router.get('/all', async (req, res) => {
  try {
    const allRequests = await MessDeductionRequest.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(allRequests);
  } catch (error) {
    console.error('Error fetching all mess deduction requests:', error);
    res.status(500).json({ message: 'Server error while fetching all records' });
  }
});

// ✅ GET /messdeduction/:rollNumber — Fetch data by rollNumber
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

// ✅ PUT /messdeduction/decision/:id — Approve or Reject by Warden
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
      { new: true } // return updated document
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

router.put('/approve/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and update the mess deduction request
    const updatedRequest = await MessDeductionRequest.findByIdAndUpdate(
      id,
      { 
        status: 'Approved',
        wardenApproval: true,
        approvedAt: new Date(),
        // You can also add approvedBy field if you want to track who approved
        // approvedBy: req.user?.id // if you have user authentication
      },
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Mess deduction request not found' });
    }

    // 🔔 Emit real-time notification to the student
    const io = req.app.get('io');
    io.emit(`mess-approved-${updatedRequest.rollNumber}`, {
      type: 'MESS_REQUEST_APPROVED',
      title: ' Your Mess Reduction Request was Approved',
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

// Reject mess deduction request
router.put('/reject/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body; // Optional rejection reason
    
    // Find and update the mess deduction request
    const updatedRequest = await MessDeductionRequest.findByIdAndUpdate(
      id,
      { 
        status: 'Rejected',
        wardenApproval: false,
        rejectedAt: new Date(),
        rejectionReason: rejectionReason || 'No reason provided',
        // You can also add rejectedBy field if you want to track who rejected
        // rejectedBy: req.user?.id // if you have user authentication
      },
      { new: true } // Return the updated document
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

// ✅ NEW: GET /messdeduction/document/:filename — Serve documents
router.get('/document/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    // Get file extension to set appropriate content type
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
    
    // Send file
    res.sendFile(filePath);
    
  } catch (error) {
    console.error('Error serving document:', error);
    res.status(500).json({ message: 'Error serving document' });
  }
});

// ✅ UPDATED: Preview/Get single mess deduction request with document URL
router.get('/preview/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const messDeductionRequest = await MessDeductionRequest.findById(id);
    
    if (!messDeductionRequest) {
      return res.status(404).json({ message: 'Mess deduction request not found' });
    }

    // Add document URL if document exists
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











//Mess Manger Route
// GET /messmanager/requests
router.get('/messmanager/requests', async (req, res) => {
  try {
    const approvedRequests = await MessDeductionRequest.find({ wardenApproval: 'true' });
    res.status(200).json(approvedRequests);
  } catch (error) {
    console.error('Error fetching approved requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/messmanager_approve/:id', async(req,res)=>{
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










// care tacker
router.get('/caretacker/requests', async (req, res) => {
  try {
    const approvedRequests = await MessDeductionRequest.find({
      wardenApproval: 'true',
      messManagerApproval: 'true',
    });
    res.status(200).json(approvedRequests);
  } catch (error) {
    console.error('Error fetching approved requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/approve-caretaker/:id', async(req,res)=>
{
  try
  {
    const {id}=req.params;

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

  }catch(error)
  {
    res.status(500).json({message:'Server Error'});
  }
})



// Tracking
const mongoose = require("mongoose");

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





module.exports = router;