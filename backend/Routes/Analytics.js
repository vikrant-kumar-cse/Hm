const express = require("express");
const router = express.Router();
const messDeductionRequest = require("../Models/MessDeductionRequest");
const hostelAllotment = require("../Models/Allotments");
const User = require("../Models/User");
const { verifyAdmin } = require("../Middlewares/Auth"); // Only admin access

// ========================
// 1️⃣ Mess Reduction Trends (Month-wise)
// ========================
router.get("/mess-trends", async (req, res) => {
  try {
    const trends = await messDeductionRequest.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            status: "$status"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json({ success: true, data: trends });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========================
// 2️⃣ Occupancy Trends (Hostel usage over time)
// ========================
router.get("/occupancy-trends", async (req, res) => {
  try {
    const trends = await hostelAllotment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            hostelName: "$hostelName"
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json({ success: true, data: trends });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========================
// 3️⃣ Role Performance Reports (Approvals/Rejections per Warden)
// ========================
router.get("/role-performance", async (req, res) => {
  try {
    const performance = await messDeductionRequest.aggregate([
      {
        $group: {
          _id: { wardenId: "$wardenId", status: "$status" },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.wardenId",
          foreignField: "_id",
          as: "warden"
        }
      },
      { $unwind: "$warden" },
      {
        $project: {
          wardenName: "$warden.name",
          status: "$_id.status",
          count: 1
        }
      }
    ]);

    res.json({ success: true, data: performance });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;






