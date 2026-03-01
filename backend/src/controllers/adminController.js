import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

// ==================== ADMIN LOGIN ====================
// Public: Authenticate admin and return JWT token
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
        message: 'Please enter both your email address and password to log in.',
      });
    }

    // Find admin and explicitly select password field
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect. Please check and try again.',
      });
    }

    // Check password
    const isPasswordValid = await admin.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect. Please check and try again.',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== CREATE ADMIN ====================
// Protected: Create a new admin account (first time setup)
// In production, this should be called only once or with special authorization
export const createAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
        message: 'Please provide both an email address and password for the new admin account.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password too short',
        message: 'Password must be at least 6 characters long for security reasons.',
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        error: 'Admin account already exists',
        message: 'An admin account with this email already exists. Contact support if you need help.',
      });
    }

    // Create new admin
    const admin = new Admin({
      email,
      password, // Will be hashed by pre-save middleware
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });

    console.log(`✓ New admin account created for ${email}`);
  } catch (error) {
    next(error);
  }
};

// ==================== CHANGE PASSWORD ====================
// Protected: Change admin password
export const changePassword = async (req, res, next) => {
  try {
    // Check authentication
    if (!req.admin) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Both passwords are required',
        message: 'Please provide your current password and the new password you want to set.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Password too short',
        message: 'Your new password must be at least 6 characters long for security.',
      });
    }

    // Find admin and get password field
    const admin = await Admin.findById(req.admin.id).select('+password');

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Verify current password
    const isPasswordValid = await admin.matchPassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Current password is incorrect',
        message: 'The current password you entered does not match. Please verify and try again.',
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// ==================== VERIFY TOKEN ====================
// Protected: Verify if current token is valid
export const verifyToken = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Your session is invalid or has expired. Please log in again.' 
      });
    }

    // Find admin to confirm still exists
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(401).json({ 
        error: 'Admin account not found',
        message: 'Your admin account cannot be found. Please log in again or contact support.' 
      });
    }

    res.json({
      success: true,
      message: 'Token is valid',
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  createAdmin,
  changePassword,
  verifyToken,
};
