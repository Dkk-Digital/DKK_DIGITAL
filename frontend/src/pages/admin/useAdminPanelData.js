import { useCallback, useEffect, useState } from 'react';
import { inquiryService, serviceService } from '../../services';

const useAdminPanelData = () => {
  const [stats, setStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [allInquiries, setAllInquiries] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, recentInquiriesRes, allInquiriesRes, servicesRes] = await Promise.all([
        inquiryService.getStats(),
        inquiryService.getAll({ status: 'new' }),
        inquiryService.getAll(),
        serviceService.getAll(),
      ]);

      setStats(statsRes.data.stats);
      setRecentInquiries(recentInquiriesRes.data.inquiries || []);
      setAllInquiries(allInquiriesRes.data.inquiries || []);
      setServices(servicesRes.data.services || []);
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
    loading,
    refresh: loadData,
  };
};

export default useAdminPanelData;
