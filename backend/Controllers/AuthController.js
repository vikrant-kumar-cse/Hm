const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");
require('dotenv').config();
const sendEmail = require('../utils/sendEmail');


// Email Send
const sendEmailVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const link = `http://localhost:3000/verify?token=${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; background-color: #f4f7fa;">
        <div style="text-align: center;">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQECu3VN0mYmxc1xkTVOUE94lynjy6lVgayMg&s" alt="Hostel Welcome Image" style="width: 100%; max-width: 400px; margin-bottom: 20px; border-radius: 8px;" />
          <h2 style="color: #333;">Welcome to GECWC Hostel 🏠</h2>
        </div>
        <p style="font-size: 16px; color: #555; text-align: center;">
          Thank you for registering with us! We're excited to have you join the GECWC Hostel community. Please verify your email address to complete your registration. Just click the button below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background-color: #28a745; color: #fff; padding: 12px 25px; text-decoration: none; font-size: 16px; border-radius: 5px;">
            Verify Email
          </a>
        </div>
        <p style="font-size: 14px; color: #999; text-align: center;">
          If you didn’t sign up, you can safely ignore this email.
        </p>
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">
          © ${new Date().getFullYear()} GECWC Hostel | All rights reserved.
        </p>
      </div>
    `;

    await sendEmail(email, 'Verify your Email - GECWC Hostel', html);
    res.json({ message: 'Verification email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending email', error: err.message });
  }
};




const verifyAndSignup = async (req, res) => {
  const { token, name, password, mobile, role } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      mobile,
      role,
      isEmailVerified: true
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token', error: err.message });
  }
};




const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        /*const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )*/
       // controllers/auth.js ya authController.js
       const jwtToken = jwt.sign({
        email: user.email,
        _id: user._id,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
     
        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                name: user.name,
                role: user.role // ✅ ADD THIS LINE!
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}



const forgotpassword = async (req,res)=>
{
  const {email}=req.body;
  try{
    const user =await UserModel.findOne({email});
    if(!user)
    {
      return res.status(404).json({message:'User Not Found'});
    }
    const token=jwt.sign({email},process.env.JWT_SECRET,{expiresIn: '15m'});
    const resetLink= `http://localhost:3000/forgot-password-verify?token=${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; border: 1px solid #e0e0e0;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="font-size: 16px; color: #555;">
          We received a request to reset your password. Click the button below to reset it.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #007bff; color: #fff; padding: 12px 25px; text-decoration: none; font-size: 16px; border-radius: 5px;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #999;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `;

    await sendEmail(email,'Reset Your Password - GECWC Hostel',html);
    res.json({message: 'Password Reset Email Sent'});

  }
  catch(error)
  {
    console.error(error);
    res.status(500).json({message:'server error',error:error.message});
  }
};



const resetPassword = async(req,res)=>
{
  const { token, newPassword } = req.body;

  try{
      const decoded =jwt.verify(token,process.env.JWT_SECRET);
      const user= await UserModel.findOne({email:decoded.email});

      if(!user) return res.status(404).json({message:'User Not Found'});

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password= hashedPassword;

      await user.save();
      res.json({message:'Password Reset Successfully'});
  }
  catch(error)
  {
    console.error(error);
    res.status(500).json({message:'Server Error',error:error.message});
  }
};


module.exports = {
    login,
    sendEmailVerification,
    verifyAndSignup,
    forgotpassword,
    resetPassword
}