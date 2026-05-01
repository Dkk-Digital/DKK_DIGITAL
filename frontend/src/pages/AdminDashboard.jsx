import React, { useState } from 'react';
import { Tabs, Tab, Box, Container } from '@mui/material';
import Layout from '../components/Layout';
import UserManagement from '../components/UserManagement';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import NotificationCenter from '../components/NotificationCenter';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ mb: 3, bgcolor: '#f5f5f5', borderBottom: '2px solid #667eea', borderRadius: 1 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: '1px solid #e0e0e0',
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                '&.Mui-selected': {
                  color: '#667eea',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#667eea',
              },
            }}
          >
            <Tab label="Analytics Dashboard" />
            <Tab label="User Management" />
            <Tab label="Notifications" />
          </Tabs>
        </Box>

        {activeTab === 0 && <AnalyticsDashboard />}
        {activeTab === 1 && <UserManagement />}
        {activeTab === 2 && <NotificationCenter />}
      </Container>
    </Layout>
  );
};

export default AdminDashboard;
