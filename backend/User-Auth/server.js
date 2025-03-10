import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/userModel.js';
import { sendVerificationEmail, sendResetPasswordEmail } from './utils/emailService.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create verification token
    const verificationToken = jwt.sign(
      { email }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken
    });

    await user.save();
    
    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ 
      message: 'Registration successful! Please check your email to verify your account.' 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Error creating account. Please try again.' 
    });
  }
});

// Email verification endpoint
app.get('/api/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find and update user
    const user = await User.findOne({ 
      email: decoded.email,
      verificationToken: token 
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired verification link' 
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Redirect to frontend with success message
    res.redirect('http://localhost:5173/login?verified=true');
  } catch (error) {
    console.error('Verification error:', error);
    res.status(400).json({ 
      message: 'Invalid or expired verification link' 
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check verification
    if (!user.isVerified) {
      return res.status(400).json({ 
        message: 'Please verify your email before logging in' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Send password reset OTP
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = jwt.sign(
      { email, otp },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    await sendResetPasswordEmail(email, otp);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// Verify OTP and reset password
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    const user = await User.findOne({
      email,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token expired' });
    }

    const decoded = jwt.verify(user.resetPasswordToken, process.env.JWT_SECRET);
    if (decoded.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const user = await User.findOne({
      email,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    const decoded = jwt.verify(user.resetPasswordToken, process.env.JWT_SECRET);
    if (decoded.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(400).json({ message: 'Invalid OTP' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});