import {type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { sendVerificationEmail } from '../services/email.service.js';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    
    // Check existing
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ success: false, message: 'Email already exists' });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);
    const verification_token = crypto.randomBytes(32).toString('hex');
    
    const newUser = new User({
      name,
      email,
      password_hash,
      verification_token
    });

    await newUser.save();

    // Send the email
    const verifyUrl = `http://localhost:3000/auth/verify?token=${verification_token}`;
    const previewUrl = await sendVerificationEmail(email, verifyUrl);

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful. Please check your email.',
      previewUrl // for the dev outbox
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verify = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;
    if (!token) {
      res.status(400).send('No token provided');
      return;
    }

    const user = await User.findOne({ verification_token: token as string });
    if (!user) {
      res.status(400).send('Invalid or expired verification token');
      return;
    }

    user.is_verified = true;
    user.verification_token = ""; // clear token
    await user.save();

    // Redirect to frontend login page
    res.redirect('http://localhost:5173/login?verified=true');
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    if (!user.is_verified) {
      res.status(403).json({ success: false, message: 'Please verify your email first' });
      return;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  // @ts-ignore
  const user = req.user;
  res.json({ 
    success: true, 
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    } 
  });
};
