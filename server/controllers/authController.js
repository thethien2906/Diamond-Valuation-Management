
const User = require('../models/User')
const  {hashPassword, comparePassword} = require('../helpers/auth')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
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
      
      // Generate a unique userID
      const userID = new mongoose.Types.ObjectId();
      
      // Hash the password
      const hashedPassword = await hashPassword(password);
      
      // Create the user with generated userID
      const user = await User.create({ userID, name, email, password: hashedPassword });
      
      return res.status(201).json(user);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'No user found' });
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
  



  module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    logoutUser, // Add logoutUser to the exported functions
  };