import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import { config } from '../config/index.js';
import { AuthRequest } from '../middleware/auth.js';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const normalizedEmail = email.trim().toLowerCase();

      // Check duplicate
      const existingUser = UserModel.findOne({ email: normalizedEmail });
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'An account with this email address already exists. Please log in instead.',
        });
        return;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = UserModel.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: 'user',
      });

      // Generate JWT
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Account successfully registered.',
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role || 'user',
          createdAt: newUser.createdAt,
        },
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      res.status(500).json({
        success: false,
        error: 'An error occurred during registration. Please try again.',
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const normalizedEmail = email.trim().toLowerCase();

      const user = UserModel.findOne({ email: normalizedEmail });
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password combination.',
        });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password combination.',
        });
        return;
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
          createdAt: user.createdAt,
        },
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({
        success: false,
        error: 'An error occurred during login. Please try again.',
      });
    }
  }

  static async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized.' });
        return;
      }

      const user = UserModel.findById(req.user.id);
      if (!user) {
        res.status(404).json({ success: false, error: 'User profile not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
          createdAt: user.createdAt,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: 'Failed to retrieve profile.' });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  }
}
