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
      message: 'Account successfully initialized! Please check your email and verify your email address to proceed.',
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

    // Respond with a simple HTML page that auto-closes
    res.send(`
      <html>
        <head>
          <title>Verification Successful</title>
          <style>
            body { background-color: #060e20; color: #dee5ff; font-family: 'Inter', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .container { text-align: center; padding: 40px; background-color: #00225a; border-radius: 16px; border: 1px solid #12244e; box-shadow: 0 16px 32px rgba(0,0,0,0.4); }
            h1 { color: #7bd0ff; margin-bottom: 16px; }
            p { color: #939eb5; margin-bottom: 24px; }
            .logo { width: 64px; height: 64px; background-color: #004c69; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px; color: #7bd0ff; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg>
            </div>
            <h1>Verification Successful!</h1>
            <p>Your data stream is now active. You may close this tab and return to the main arena window.</p>
            <script>
              setTimeout(() => {
                window.close();
              }, 4000);
            </script>
          </div>
        </body>
      </html>
    `);
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
    
    // Set HTTP-Only Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      success: true,
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
export const checkVerificationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.query;
    if (!email) {
      res.status(400).json({ verified: false });
      return;
    }
    const user = await User.findOne({ email: email as string });
    if (!user) {
      res.status(404).json({ verified: false });
      return;
    }
    res.json({ verified: user.is_verified });
  } catch (error: any) {
    res.status(500).json({ verified: false });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
};
