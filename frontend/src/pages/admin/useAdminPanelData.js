import { useCallback, useEffect, useState } from 'react';
import { authService, inquiryService, serviceService, blogService, projectService } from '../../services';

const useAdminPanelData = () => {
  const [stats, setStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [allInquiries, setAllInquiries] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, recentInquiriesRes, allInquiriesRes, servicesRes, usersRes, blogsRes, projectsRes] = await Promise.all([
        inquiryService.getStats(),
        inquiryService.getAll({ status: 'new' }),
        inquiryService.getAll(),
        serviceService.getAll(),
        authService.getAllUsers(),
        blogService.getAll(),
        projectService.getAll(),
      ]);

      setStats(statsRes.data.stats);
      setRecentInquiries(recentInquiriesRes.data.inquiries || []);
      setAllInquiries(allInquiriesRes.data.inquiries || []);
      setServices(servicesRes.data.services || []);
      setUsers(usersRes.data.users || []);
      setBlogs(blogsRes.data.blogs || []);
      setProjects(projectsRes.data.projects || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    stats,
    recentInquiries,
    allInquiries,
    services,
    users,
    blogs,
    projects,
    loading,
    refresh: loadData,
  };
};

export default useAdminPanelData;
