// === Imports ===
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');
const UserModel = require('./Models/userdbModel');

// === App Setup ===
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // Serves from PoshakNova/

// === MongoDB Connection ===
mongoose.connect("mongodb://127.0.0.1:27017/authDB")
  .then(() => console.log("✅ Database Connected Successfully"))
  .catch(err => console.error("❌ Database Connection Error:", err));

// === Email Transporter (Gmail SMTP) ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jhaa77313@gmail.com',
    pass: 'wjytwbbiclqfbzly' // App password (Use env vars in production)
  }
});


// === Routes ===

// [1] Home Route
app.get('/', (req, res) => {
  res.redirect('/test.html');
});

// [2] User Registration
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        required: ["name", "email", "password"]
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationTokenExpires = Date.now() + 3600000; // 1 hour

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires
    });

    // Send verification email
    const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      from: '"Poshak Nova" <poshaknova@gmail.com>',
      to: email,
      subject: 'Verify Your Email',
      html: `
        <h2>Verify Your Email</h2>
        <p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>
        <p>Or copy this link into your browser: ${verificationUrl}</p>
      `
    });

    return res.status(201).json({
      message: "Registration successful! Please check your email to verify your account.",
      user: { _id: newUser._id, name: newUser.name, email: newUser.email }
    });

  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// [3] Generate and Send Verification Code
app.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Generate 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = Date.now() + 3600000; // 1 hour expiry

    // Update user with verification code
    await UserModel.findOneAndUpdate(
      { email },
      { verificationCode, verificationCodeExpires }
    );

    // Send email with code
    await transporter.sendMail({
      from: '"Poshak Nova" <poshaknova@gmail.com>',
      to: email,
      subject: 'Your Verification Code',
      html: `
        <h2>Your Verification Code</h2>
        <p>Here is your 6-digit verification code:</p>
        <h3 style="font-size: 24px; letter-spacing: 2px;">${verificationCode}</h3>
        <p>This code will expire in 1 hour.</p>
      `
    });

    res.json({ message: "Verification code sent successfully" });
  } catch (err) {
    console.error("Send Verification Error:", err);
    res.status(500).json({ message: "Failed to send verification code", error: err.message });
  }
});

// [4] Verify Code
app.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await UserModel.findOne({ 
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() } // Check if code is still valid
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired verification code" 
      });
    }

    // Mark user as verified and clear code
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// [5] User Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// === Server Startup ===
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
