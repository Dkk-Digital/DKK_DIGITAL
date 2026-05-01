import { useCallback, useEffect, useState } from 'react';
import { authService, inquiryService, serviceService } from '../../services';

const useAdminPanelData = () => {
  const [stats, setStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [allInquiries, setAllInquiries] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, recentInquiriesRes, allInquiriesRes, servicesRes, usersRes] = await Promise.all([
        inquiryService.getStats(),
        inquiryService.getAll({ status: 'new' }),
        inquiryService.getAll(),
        serviceService.getAll(),
        authService.getAllUsers(),
      ]);

      setStats(statsRes.data.stats);
      setRecentInquiries(recentInquiriesRes.data.inquiries || []);
      setAllInquiries(allInquiriesRes.data.inquiries || []);
      setServices(servicesRes.data.services || []);
      setUsers(usersRes.data.users || []);
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
    loading,
    refresh: loadData,
  };
};

export default useAdminPanelData;
