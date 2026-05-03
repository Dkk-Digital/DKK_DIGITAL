import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { logUserActivity } from '../utils/userActivity.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, company, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      company,
      role: role || 'client',
    });

    // Log registration activity
    await logUserActivity({
      userId: user._id,
      action: 'register',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success',
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user and select password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // Log failed login attempt
      await logUserActivity({
        userId: null,
        action: 'failed_login',
        details: { email, reason: 'user_not_found' },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        status: 'failure',
      });
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Log failed login attempt
      await logUserActivity({
        userId: user._id,
        action: 'failed_login',
        details: { reason: 'invalid_password' },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        status: 'failure',
      });
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Log successful login
    await logUserActivity({
      userId: user._id,
      action: 'login',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success',
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, company } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, company, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    // Log profile update
    await logUserActivity({
      userId: req.user._id,
      action: 'update_profile',
      details: { name, phone, company },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success',
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['admin', 'client'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    if (req.params.id === req.user._id.toString() && role !== req.user.role) {
      return res.status(400).json({ success: false, message: 'You cannot change your own role from the admin panel' });
    }

    const oldRole = (await User.findById(req.params.id)).role;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Log role change
    await logUserActivity({
      userId: req.params.id,
      action: 'role_changed',
      details: { oldRole, newRole: role, changedBy: req.user._id },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success',
    });

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account from the admin panel' });
    }

    await User.findByIdAndDelete(req.params.id);

    // Log user deletion
    await logUserActivity({
      userId: req.params.id,
      action: 'account_deleted',
      details: { deletedBy: req.user._id, email: user.email },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      status: 'success',
    });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const total = await User.countDocuments();
    const admins = await User.countDocuments({ role: 'admin' });
    const clients = await User.countDocuments({ role: 'client' });

    res.status(200).json({
      success: true,
      stats: {
        total,
        admins,
        clients,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserActivity = async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    const { getUserActivityLogs } = await import('../utils/userActivity.js');

    const userId = req.params.id || req.user._id;

    const logs = await getUserActivityLogs(userId, parseInt(limit, 10), parseInt(skip, 10));

    res.status(200).json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserActivityStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const { getUserActivityStats } = await import('../utils/userActivity.js');

    const userId = req.params.id || req.user._id;

    const stats = await getUserActivityStats(userId, parseInt(days, 10));

    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const socialLogin = async (req, res) => {
  try {
    const { email, name, provider, phone, company } = req.body;

    if (!email || !name || !provider) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    // Find if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Register user seamlessly
      const hashedPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        company,
        role: 'client',
      });

      await logUserActivity({
        userId: user._id,
        action: 'register_social',
        details: { provider },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        status: 'success',
      });
    } else {
      // Log successful login
      await logUserActivity({
        userId: user._id,
        action: 'login_social',
        details: { provider },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        status: 'success',
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: `Logged in with ${provider} successfully`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

