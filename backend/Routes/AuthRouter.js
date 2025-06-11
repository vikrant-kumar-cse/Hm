const { login, sendEmailVerification, verifyAndSignup,forgotpassword,resetPassword } = require('../Controllers/AuthController');
const { emailValidationforSignup,signupValidation, loginValidation } = require('../Middlewares/AuthValidation');


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










module.exports = router;