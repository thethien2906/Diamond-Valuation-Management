
const User = require('../models/User')
const  {hashPassword, comparePassword} = require('../helpers/auth')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const transporter = require('../config/nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const test = (req, res) => {
    res.json('heehehe')
}

// const registerUser = async (req, res) => {
//     try {
//         const {name, email, password} = req.body
//         if(!name){
//             return res.json({
//                 error: 'Please add a name'
//             })
//         };
//         if(!password || password.length < 6){
//             return res.json({
//                 error: 'Please add a password of at least 6 characters'
//             })
//         };
//         const existingEmail = await User.findOne({email})
//         if(existingEmail){
//             return res.json({
//                 error: 'Email already exists'
//             })
//         }
//         const hashedPassword = await hashPassword(password)
//         const user = await User.create({name, email, password: hashedPassword})
//         return res.json(user)
//     } catch (error) {
//         console.log(error)
//     }
// }
const registerUser = async (req, res) => {
  try {
      const { name, email, password } = req.body;
      
      // Validate name and password
      if (!name) {
          return res.status(400).json({ error: 'Please add a name' });
      }
      if (!password || password.length < 6) {
          return res.status(400).json({ error: 'Please add a password of at least 6 characters' });
      }
      
      // Check if email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
          return res.status(400).json({ error: 'Email already exists' });
      }



      const verificationToken = crypto.randomBytes(20).toString('hex'); 

      
      
      // Hash the password
      const hashedPassword = await hashPassword(password);
      
      // Create the user with generated userID
      const user = await User.create({ name, email, password: hashedPassword,isVerified: false,
        verificationToken,
        verificationTokenExpiry: Date.now() + 5 * 24 * 60 * 60 * 1000 // Expire in 5 days
    }); 
    const mailOptions = {
      from: 'your_email@gmail.com', // Replace with your email
      to: email,
      subject: 'Verify your email address',
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 600px; margin: auto; color: #fff; background-color: rgb(0, 27, 56); font-size: 18px;">
          <div style="border: 5px solid rgb(0, 27, 56); padding: 10px; background-color: rgb(0, 27, 56); text-align: center;">
            <img src="https://i.pinimg.com/736x/6d/b4/ba/6db4ba2f50ba7a23197ff001b696538e.jpg" style="width: 150px;"/>
          </div>
          <h2 style="color: #fff; font-size: 24px;">Verify Your Email Address</h2>
          <p style="color: #fff; font-size: 18px;">To continue setting up your account, please verify your email address by clicking the button below:</p>
          <a href="http://localhost:5173/verify/${verificationToken}" style="text-decoration: none;">
            <button style="font-size: 18px; padding: 10px 20px; color: #fff; background-color: #007BFF; border: none; cursor: pointer;">Verify Email Address</button>
          </a>
          <p style="color: #fff; font-size: 18px;">This link will expire in 5 days. If you did not make this request, please disregard this email.</p>
          <p style="color: #fff; font-size: 18px;">For help, contact us through our Help center.</p>
        </div>
      `
  };
      await transporter.sendMail(mailOptions);
      return res.status(201).json(user);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
  }
};
// controllers/authController.js (or your verification route handler)
// controllers/authController.js (or your verification route handler)
const verifyEmail = async (req, res) => {
  const token = req.params.token;
  try {
      const user = await User.findOne({ verificationToken: token });

      if (!user) {
          return res.status(400).json({ error: "Invalid token" }); 
      }

      // (Optional) Check for token expiry
      if (user.verificationTokenExpiry && user.verificationTokenExpiry < Date.now()) {
          return res.status(400).json({ error: "Token expired" });
      }

      user.IsVerified = 'true'; // Change IsVerified to 'true'
      // user.verificationToken = undefined; // Clear the token (optional)
      // user.verificationTokenExpiry = undefined; // Clear expiry (optional)

      await user.save();
      res.status(200).json({ message: "Email verified successfully" });

  } catch (error) {
      console.error('Error verifying email:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'No user found' });
    }
    if (user.isEmailVerified=='false') {
      return res.status(401).json({ error: 'Please Verify your email' });
    }
    const match = await comparePassword(password, user.password);

    if (match) {
      jwt.sign(
        {
          email: user.email,
          id: user.userID, // Use userID instead of _id
          name: user.name,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("accessToken", token, { httpOnly: true }).json(user);
        }
      );
    } else {
      return res.status(401).json({ error: 'Wrong Password' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

  

const getProfile = async (req, res) => {
    const {token} = req.cookies
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) throw err
            res.json(user)
        })
    }else{
        res.json(null)
    }
}
const logoutUser = (req, res) => {
    try {
      res.clearCookie("accessToken"); // Clear the cookie containing the JWT
      res.json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  

  const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.error('User not found');
        return res.status(404).json({ error: 'User not found' });
      }
      const resetPasswordCode = crypto.randomBytes(3).toString('hex'); 
      user.resetPasswordCode = resetPasswordCode;
      await user.save();
  
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Password Reset Code',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 600px; margin: auto; color: #fff; background-color: rgb(0, 27, 56); font-size: 18px;">
          <div style="border: 5px solid rgb(0, 27, 56); padding: 10px; background-color: rgb(0, 27, 56);">
            <img src="https://i.pinimg.com/736x/6d/b4/ba/6db4ba2f50ba7a23197ff001b696538e.jpg" style="width: 150px;"/>
          </div>
          <h2 style="color: #fff; font-size: 36px;">Password Reset Request</h2>
          <p style="color: #fff; font-size: 20px;">Dear ${user.name},</p>
          <p style="color: #fff; font-size: 20px;">We received a request to reset your password. Please use the code below to reset your password:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 36px; font-weight: bold; color: #fff; background-color: rgb(0, 27, 56); padding: 5px 10px;">${resetPasswordCode}</span>
          </div>
          <p style="color: #fff; font-size: 20px;">If you did not request a password reset, please ignore this email or contact support.</p>
          <p style="color: #fff; font-size: 20px;">Thank you,</p>
          <p style="color: #fff; font-size: 20px;">Your Company Team</p>
        </div>
      `,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ error: 'Failed to send email' });
        } else {
          console.log('Email sent:', info.response);
          res.status(200).json({ message: 'Password reset code sent to email' });
        }
      });
    } catch (error) {
      console.error('Error in forgot password:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  const verifyResetCode = async (req, res) => {
    const { email, resetCode } = req.body;
    try {
      const user = await User.findOne({ email, resetPasswordCode: resetCode });
      if (!user) {
        return res.status(400).json({ error: 'Invalid reset code' });
      }
      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.error('Error in verify reset code:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  const resetPassword = async (req, res) => {
    const { userId, newPassword } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetPasswordCode = '';
      await user.save();
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Error in reset password:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    logoutUser, 
    verifyEmail,
    forgotPassword,
    verifyResetCode,
    resetPassword
  };