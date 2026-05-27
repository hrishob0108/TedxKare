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
      process.env.JWT_SECRET,
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

// ==================== CREATE / RESET ADMIN ====================
// Public: Create or reset admin account credentials
export const createAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
        message: 'Please provide both an email and a password.',
      });
    }

    // Security Check: If at least one admin already exists in the database,
    // only authenticated admins can create or update admin credentials.
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'Authentication required',
          message: 'An administrator account already exists. You must be logged in as an admin to create or modify admin accounts.',
        });
      }

      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
      } catch (error) {
        return res.status(401).json({
          error: 'Invalid or expired token',
          message: 'Your administrator session is invalid or has expired.',
        });
      }
    }

    const exists = await Admin.findOne({ email });

    if (exists) {
      exists.password = password;
      await exists.save();
      console.log(`✓ Admin password updated for: ${exists.email}`);
      return res.json({
        success: true,
        message: 'Admin account credentials updated successfully.',
        admin: { id: exists._id, email: exists.email }
      });
    }

    const admin = new Admin({ email, password });
    await admin.save();
    console.log(`✓ New Admin account created: ${admin.email}`);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully.',
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
  changePassword,
  verifyToken,
  createAdmin,
};
