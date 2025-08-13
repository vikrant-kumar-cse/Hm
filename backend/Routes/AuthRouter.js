const { login, sendEmailVerification, verifyAndSignup,forgotpassword,resetPassword } = require('../Controllers/AuthController');
const { emailValidationforSignup,signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");
//const User = require("./Models/User");


//ye change hua hai 2 line
const auth = require('../Middlewares/Auth');
const role = require('../Middlewares/roleMiddleware'); // ✅ Fix here



const router = require('express').Router();

router.post('/login', loginValidation, login);
/*router.post('/signup', signupValidation, verifyOtpAndSignup);*/


router.post('/send-verification-email',emailValidationforSignup, sendEmailVerification);
router.post('/verify-and-signup',signupValidation, verifyAndSignup);


router.post('/Sendforgotemail',forgotpassword);
router.post('/reset-password',resetPassword);



// ✅ Example route - Only admin can access
router.get('/admin', auth, role('admin'), (req, res) => {
    res.send('Hello Admin ');
  });





// routes/adminRoutes.js
const User = require('../Models/User'); // ✅ REQUIRED

router.get('/users', auth, role('admin'), async (req, res) => {
  try {
    const users = await User.find({}, 'email role name'); // Select only email and role
    res.json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/User/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Use lowercase 'user' variable
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.delete('/users/:id', auth, role('admin'), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

//Update User Details
router.put('/users/:userId',auth, role('admin'), async (req, res) => {
  const { userId } = req.params;
  const { name, email, role } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's details
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    await user.save();

    res.status(200).json({ message: "User details updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});





















router.get("/export/csv", async (req, res) => {
  try {
    const users = await User.find().lean(); // lean() for plain JS objects

    // Fields according to your schema
    const fields = [
      "_id",
      "name",
      "email",
      "mobile",
      "isEmailVerified",
      "role",
      "createdAt"
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(users);

    res.header("Content-Type", "text/csv");
    res.attachment("users.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Error exporting CSV", error: err.message });
  }
});

/**
 * Export as Excel
 */
router.get("/export/excel", async (req, res) => {
  try {
    const users = await User.find().lean();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // Columns based on your schema
    worksheet.columns = [
      { header: "ID", key: "_id", width: 30 },
      { header: "Name", key: "name", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Mobile", key: "mobile", width: 15 },
      { header: "Email Verified", key: "isEmailVerified", width: 15 },
      { header: "Role", key: "role", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 }
    ];

    // Add Rows
    users.forEach((user) => {
      worksheet.addRow(user);
    });

    // Download settings
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: "Error exporting Excel", error: err.message });
  }
});




module.exports = router;