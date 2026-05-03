import { useCallback, useEffect, useState } from 'react';
import { authService, inquiryService, serviceService, blogService } from '../../services';

const useAdminPanelData = () => {
  const [stats, setStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [allInquiries, setAllInquiries] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, recentInquiriesRes, allInquiriesRes, servicesRes, usersRes, blogsRes] = await Promise.all([
        inquiryService.getStats(),
        inquiryService.getAll({ status: 'new' }),
        inquiryService.getAll(),
        serviceService.getAll(),
        authService.getAllUsers(),
        blogService.getAll(),
      ]);

      setStats(statsRes.data.stats);
      setRecentInquiries(recentInquiriesRes.data.inquiries || []);
      setAllInquiries(allInquiriesRes.data.inquiries || []);
      setServices(servicesRes.data.services || []);
      setUsers(usersRes.data.users || []);
      setBlogs(blogsRes.data.blogs || []);
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
    loading,
    refresh: loadData,
  };
};

export default useAdminPanelData;
