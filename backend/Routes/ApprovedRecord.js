const express = require("express");
const router = express.Router();
const MessReduction =require("../Models/MessDeductionRequest");
const { Parser } = require("json2csv");  // for CSV export

// GET: /mess/download?month=2025-08
router.get("/download", async (req, res) => {
    try {
      const { month } = req.query; // e.g. 2025-08
      if (!month) {
        return res.status(400).json({ message: "Month is required in YYYY-MM format" });
      }
  
      const startDate = new Date(`${month}-01T00:00:00Z`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
  
      // Fetch approved data
      const records = await MessReduction.find({
        status: "Approved",   // ✅ fix case
        approvedAt: { $gte: startDate, $lt: endDate }  // ✅ use approvedAt
      });
  
      if (records.length === 0) {
        return res.status(404).json({ message: "No approved data found for this month" });
      }
  
      // Convert JSON -> CSV
      const fields = [
        "nameOfStudent",
        "rollNumber",
        "branchAndSem",
        "roomNo",
        "reason",
        "numberOfDays",
        "approvedAt"
      ];
      const parser = new Parser({ fields });
      const csv = parser.parse(records);
  
      res.header("Content-Type", "text/csv");
      res.attachment(`mess_reduction_${month}.csv`);
      return res.send(csv);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  });
  
module.exports = router;
