// Role-based permissions matrix
export const PERMISSIONS = {
  // Inquiry permissions
  'inquiry.create': ['client', 'admin'],
  'inquiry.view': ['admin'],
  'inquiry.update': ['admin'],
  'inquiry.delete': ['admin'],
  'inquiry.respond': ['admin'],

  // Service permissions
  'service.create': ['admin'],
  'service.view': ['client', 'admin'],
  'service.update': ['admin'],
  'service.delete': ['admin'],

  // Project permissions
  'project.create': ['client', 'admin'],
  'project.view.own': ['client', 'admin'],
  'project.view.all': ['admin'],
  'project.update': ['admin'],
  'project.delete': ['admin'],

  // User permissions
  'user.create': ['admin'],
  'user.view': ['admin'],
  'user.update.own': ['client', 'admin'],
  'user.update.others': ['admin'],
  'user.delete': ['admin'],
  'user.manage_roles': ['admin'],

  // Blog permissions
  'blog.create': ['admin'],
  'blog.view': ['client', 'admin'],
  'blog.update': ['admin'],
  'blog.delete': ['admin'],
  'blog.publish': ['admin'],

  // Message permissions
  'message.send': ['client', 'admin'],
  'message.view': ['client', 'admin'],
  'message.delete': ['client', 'admin'],

  // Analytics permissions
  'analytics.view': ['admin'],
  'analytics.export': ['admin'],

  // Admin panel access
  'admin.access': ['admin'],
};

// Check if a user has a specific permission
export const hasPermission = (user, permission) => {
  if (!user || !user.role) return false;
  const requiredRoles = PERMISSIONS[permission] || [];
  return requiredRoles.includes(user.role);
};

// Check if a user has any of the specified permissions
export const hasAnyPermission = (user, permissions = []) => {
  return permissions.some((permission) => hasPermission(user, permission));
};

// Check if a user has all of the specified permissions
export const hasAllPermissions = (user, permissions = []) => {
  return permissions.every((permission) => hasPermission(user, permission));
};

// Get all permissions for a role
export const getPermissionsForRole = (role) => {
  return Object.entries(PERMISSIONS)
    .filter(([_, roles]) => roles.includes(role))
    .map(([permission, _]) => permission);
};

// Role hierarchy levels (higher number = higher privilege)
export const ROLE_HIERARCHY = {
  client: 1,
  admin: 3,
};

// Check if a user can manage another user (based on role hierarchy)
export const canManageUser = (actor, target) => {
  const actorLevel = ROLE_HIERARCHY[actor.role] || 0;
  const targetLevel = ROLE_HIERARCHY[target.role] || 0;
  return actorLevel > targetLevel;
};

export default {
  PERMISSIONS,
  ROLE_HIERARCHY,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getPermissionsForRole,
  canManageUser,
};
