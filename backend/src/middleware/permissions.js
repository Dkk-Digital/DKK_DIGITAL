import { hasPermission, canManageUser } from '../utils/permissions.js';

/**
 * Middleware to check if user has required permission(s)
 * @param {string|Array} requiredPermission - Permission or array of permissions
 * @param {boolean} requireAll - If true, user must have all permissions; if false, any permission is sufficient
 * @returns {Function} - Express middleware
 */
export const requirePermission = (requiredPermission, requireAll = false) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];

    let hasAccess = false;

    if (requireAll) {
      hasAccess = permissions.every((permission) => hasPermission(req.user, permission));
    } else {
      hasAccess = permissions.some((permission) => hasPermission(req.user, permission));
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
        requiredPermission: permissions,
      });
    }

    next();
  };
};

/**
 * Middleware to check if user can manage another user
 * Used for update/delete user operations
 * @returns {Function} - Express middleware
 */
export const requireCanManageUser = () => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const targetUserId = req.params.id;

      // Import User model
      const { default: User } = await import('../models/User.js');

      const targetUser = await User.findById(targetUserId);

      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      if (!canManageUser(req.user, targetUser)) {
        return res.status(403).json({
          success: false,
          message: 'You cannot manage this user due to insufficient privileges',
        });
      }

      req.targetUser = targetUser;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error checking permissions',
        error: error.message,
      });
    }
  };
};

/**
 * Middleware to check if user can access their own resource or is an admin
 * @param {string} userIdParam - The parameter name containing the user ID (default: 'userId')
 * @returns {Function} - Express middleware
 */
export const requireOwnerOrAdmin = (userIdParam = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const targetUserId = req.params[userIdParam] || req.body[userIdParam];

    // Allow if user is admin or accessing their own resource
    if (req.user.role === 'admin' || req.user._id.toString() === targetUserId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'You can only access your own resources',
    });
  };
};

export default {
  requirePermission,
  requireCanManageUser,
  requireOwnerOrAdmin,
};
