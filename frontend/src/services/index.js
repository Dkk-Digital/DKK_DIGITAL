import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  socialLogin: (data) => api.post('/auth/social-login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getAllUsers: () => api.get('/auth/users'),
  updateUserRole: (id, data) => api.put(`/auth/users/${id}/role`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
  getStats: () => api.get('/auth/users/stats/overview'),
};

export const serviceService = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
  getStats: () => api.get('/services/stats/overview'),
  search: (query, filters) => {
    const params = { search: query, ...filters };
    return api.get('/services', { params });
  },
};

export const projectService = {
  getMyProjects: () => api.get('/projects/client/my-projects'),
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  getStats: () => api.get('/projects/stats/overview'),
  search: (query, filters) => {
    const params = { search: query, ...filters };
    return api.get('/projects', { params });
  },
};

export const inquiryService = {
  create: (data) => api.post('/inquiries', data),
  getAll: (params) => api.get('/inquiries', { params }),
  getById: (id) => api.get(`/inquiries/${id}`),
  updateStatus: (id, data) => api.put(`/inquiries/${id}`, data),
  delete: (id) => api.delete(`/inquiries/${id}`),
  getStats: () => api.get('/inquiries/stats/overview'),
  search: (query, filters) => {
    const params = { search: query, ...filters };
    return api.get('/inquiries', { params });
  },
};

export const blogService = {
  getAll: (params) => api.get('/blogs', { params }),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
  search: (query, filters) => {
    const params = { search: query, ...filters };
    return api.get('/blogs', { params });
  },
};

export const messageService = {
  send: (data) => api.post('/messages', data),
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (userId) => api.get(`/messages/${userId}`),
  delete: (id) => api.delete(`/messages/${id}`),
  getStats: () => api.get('/messages/stats/overview'),
};
