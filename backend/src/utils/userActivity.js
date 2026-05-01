import mongoose from 'mongoose';

// User activity log schema
const userActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'login',
        'logout',
        'register',
        'update_profile',
        'change_password',
        'role_changed',
        'inquiry_created',
        'inquiry_updated',
        'project_created',
        'project_updated',
        'message_sent',
        'file_upload',
        'failed_login',
        'permission_denied',
        'account_deleted',
      ],
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { collection: 'user_activities' }
);

// Indexes for efficient queries
userActivitySchema.index({ userId: 1, createdAt: -1 });
userActivitySchema.index({ action: 1, createdAt: -1 });
userActivitySchema.index({ createdAt: -1 });

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

/**
 * Log user activity
 * @param {Object} options - Activity log options
 * @param {string} options.userId - User ID
 * @param {string} options.action - Action type
 * @param {Object} options.details - Additional details
 * @param {string} options.ipAddress - IP address
 * @param {string} options.userAgent - User agent
 * @param {string} options.status - Status (success/failure)
 * @returns {Promise<Object>} - Created activity log
 */
export const logUserActivity = async (options) => {
  try {
    const activity = new UserActivity({
      userId: options.userId,
      action: options.action,
      details: options.details || null,
      ipAddress: options.ipAddress || null,
      userAgent: options.userAgent || null,
      status: options.status || 'success',
    });

    await activity.save();
    return activity;
  } catch (error) {
    console.error('Error logging user activity:', error);
    // Don't throw - activity logging shouldn't break the main operation
    return null;
  }
};

/**
 * Get user activity logs
 * @param {string} userId - User ID
 * @param {number} limit - Number of logs to retrieve
 * @param {number} skip - Number of logs to skip
 * @returns {Promise<Array>} - Activity logs
 */
export const getUserActivityLogs = async (userId, limit = 50, skip = 0) => {
  try {
    const activities = await UserActivity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    return activities;
  } catch (error) {
    console.error('Error retrieving user activity logs:', error);
    return [];
  }
};

/**
 * Get activity statistics for a user
 * @param {string} userId - User ID
 * @param {number} days - Number of days to check (default: 30)
 * @returns {Promise<Object>} - Activity statistics
 */
export const getUserActivityStats = async (userId, days = 30) => {
  try {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const stats = await UserActivity.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId),
          createdAt: { $gte: cutoffDate },
        },
      },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          lastOccurrence: { $max: '$createdAt' },
        },
      },
    ]);

    return stats;
  } catch (error) {
    console.error('Error retrieving user activity stats:', error);
    return [];
  }
};

/**
 * Get failed login attempts
 * @param {string} userId - User ID
 * @param {number} minutes - Check last N minutes (default: 60)
 * @returns {Promise<number>} - Number of failed attempts
 */
export const getFailedLoginAttempts = async (userId, minutes = 60) => {
  try {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);

    const count = await UserActivity.countDocuments({
      userId,
      action: 'failed_login',
      status: 'failure',
      createdAt: { $gte: cutoffTime },
    });

    return count;
  } catch (error) {
    console.error('Error retrieving failed login attempts:', error);
    return 0;
  }
};

/**
 * Clean up old activity logs
 * @param {number} daysToKeep - Number of days to keep logs (default: 90)
 * @returns {Promise<number>} - Number of deleted logs
 */
export const cleanupOldActivityLogs = async (daysToKeep = 90) => {
  try {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

    const result = await UserActivity.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    return result.deletedCount || 0;
  } catch (error) {
    console.error('Error cleaning up activity logs:', error);
    return 0;
  }
};

export default {
  UserActivity,
  logUserActivity,
  getUserActivityLogs,
  getUserActivityStats,
  getFailedLoginAttempts,
  cleanupOldActivityLogs,
};
