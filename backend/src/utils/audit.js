// Audit log types
export const AUDIT_ACTIONS = {
  // Inquiry actions
  INQUIRY_CREATED: 'inquiry_created',
  INQUIRY_UPDATED: 'inquiry_updated',
  INQUIRY_DELETED: 'inquiry_deleted',
  INQUIRY_STATUS_CHANGED: 'inquiry_status_changed',

  // Service actions
  SERVICE_CREATED: 'service_created',
  SERVICE_UPDATED: 'service_updated',
  SERVICE_DELETED: 'service_deleted',

  // Project actions
  PROJECT_CREATED: 'project_created',
  PROJECT_UPDATED: 'project_updated',
  PROJECT_DELETED: 'project_deleted',

  // User actions
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_DELETED: 'user_deleted',
  USER_ROLE_CHANGED: 'user_role_changed',
  USER_LOGIN: 'user_login',

  // Blog actions
  BLOG_CREATED: 'blog_created',
  BLOG_UPDATED: 'blog_updated',
  BLOG_DELETED: 'blog_deleted',
  BLOG_PUBLISHED: 'blog_published',

  // Message actions
  MESSAGE_SENT: 'message_sent',
  MESSAGE_DELETED: 'message_deleted',
};

// In-memory audit log (in production, use a database or external service)
let auditLogs = [];

export const logAudit = (action, userId, details = {}) => {
  const auditEntry = {
    id: auditLogs.length + 1,
    timestamp: new Date(),
    action,
    userId,
    details,
    ipAddress: details.ipAddress,
    userAgent: details.userAgent,
  };

  auditLogs.push(auditEntry);

  // Keep only last 10,000 entries to prevent memory overflow
  if (auditLogs.length > 10000) {
    auditLogs = auditLogs.slice(-10000);
  }

  console.log(`[AUDIT] ${action} by user ${userId}`, details);
  return auditEntry;
};

export const getAuditLogs = (filters = {}) => {
  let filtered = auditLogs;

  if (filters.action) {
    filtered = filtered.filter((log) => log.action === filters.action);
  }

  if (filters.userId) {
    filtered = filtered.filter((log) => log.userId === filters.userId);
  }

  if (filters.startDate) {
    filtered = filtered.filter((log) => log.timestamp >= new Date(filters.startDate));
  }

  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    endDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter((log) => log.timestamp <= endDate);
  }

  // Return most recent first
  return filtered.sort((a, b) => b.timestamp - a.timestamp);
};

export const clearOldAuditLogs = (daysOld = 90) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const before = auditLogs.length;
  auditLogs = auditLogs.filter((log) => log.timestamp > cutoffDate);
  const after = auditLogs.length;

  console.log(`[AUDIT] Cleared ${before - after} logs older than ${daysOld} days`);
};

export const auditMiddleware = (req, res, next) => {
  // Add audit helpers to request
  req.audit = {
    log: (action, details = {}) => {
      return logAudit(action, req.user?._id, {
        ...details,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });
    },
  };

  next();
};

export default {
  AUDIT_ACTIONS,
  logAudit,
  getAuditLogs,
  clearOldAuditLogs,
  auditMiddleware,
};
