import React, { useMemo } from 'react';
import { Box, Button, Card, Container, Grid, Stack, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import useAdminPanelData from './useAdminPanelData';

const MotionGrid = motion(Grid);
const MotionCard = motion(Card);

const MetricCard = styled(Card)(({ theme }) => ({
  padding: '24px',
  borderRadius: 20,
  border: '1px solid rgba(255,255,255,0.4)',
  background: 'rgba(255,255,255,0.7)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 40px rgba(15,23,42,0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
  },
}));

const SectionCard = styled(Card)({
  borderRadius: 22,
  border: '1px solid rgba(255,255,255,0.5)',
  background: 'rgba(255,255,255,0.65)',
  backdropFilter: 'blur(24px)',
  boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 15px 35px rgba(15,23,42,0.08)',
  },
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const AdminOverview = () => {
  const { stats, recentInquiries, services, users, loading } = useAdminPanelData();

  const chartData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'New', count: stats.new || 0, color: '#f59e0b' },
      { name: 'Contacted', count: stats.contacted || 0, color: '#0ea5e9' },
      { name: 'Converted', count: stats.converted || 0, color: '#16a34a' },
      { name: 'Rejected', count: (stats.total || 0) - ((stats.new||0) + (stats.contacted||0) + (stats.converted||0)), color: '#ef4444' }
    ];
  }, [stats]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" disableGutters component={motion.div} initial="hidden" animate="visible" variants={containerVariants}>
      <Box sx={{ mb: 4 }} component={motion.div} variants={itemVariants}>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 1, background: 'linear-gradient(90deg, #0f172a, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Overview
        </Typography>
        <Typography sx={{ color: '#64748b', maxWidth: 760, fontSize: '1.1rem' }}>
          Real-time metrics, inquiry tracking, and system health at a glance.
        </Typography>
      </Box>

      <MotionGrid container spacing={3} sx={{ mb: 4 }} variants={containerVariants}>
        {[
          { label: 'Total inquiries', value: stats?.total ?? 0, tone: '#2563eb' },
          { label: 'New', value: stats?.new ?? 0, tone: '#f59e0b' },
          { label: 'Converted', value: stats?.converted ?? 0, tone: '#16a34a' },
          { label: 'Total Users', value: users.length, tone: '#8b5cf6' },
        ].map((metric) => (
          <MotionGrid item xs={12} sm={6} md={3} key={metric.label} variants={itemVariants}>
            <MetricCard>
              <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
                {metric.label}
              </Typography>
              <Typography variant="h3" sx={{ mt: 1, fontWeight: 900, color: metric.tone }}>
                {metric.value}
              </Typography>
            </MetricCard>
          </MotionGrid>
        ))}
      </MotionGrid>

      <MotionGrid container spacing={3} sx={{ mb: 4 }} variants={containerVariants}>
        <MotionGrid item xs={12} md={7} variants={itemVariants}>
          <SectionCard sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
              Inquiry Pipeline
            </Typography>
            <Box sx={{ height: 280, width: '100%' }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.2)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(241,245,249,0.5)' }}
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 25px rgba(15,23,42,0.1)' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </SectionCard>
        </MotionGrid>

        <MotionGrid item xs={12} md={5} variants={itemVariants}>
          <SectionCard sx={{ p: { xs: 2, md: 3 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Quick Actions
            </Typography>
            <Typography sx={{ color: '#64748b', mb: 3, fontSize: '0.95rem' }}>
              Jump straight to the tools you need most.
            </Typography>
            <Stack spacing={2} sx={{ flexGrow: 1, justifyContent: 'center' }}>
              <Button component={RouterLink} to="/admin/services" variant="contained" size="large" sx={{ py: 1.5, borderRadius: 3, textTransform: 'none', fontSize: '1.05rem', fontWeight: 700, background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', boxShadow: '0 10px 25px rgba(37,99,235,0.3)' }}>
                Manage Services Catalog
              </Button>
              <Button component={RouterLink} to="/admin/inquiries" variant="outlined" size="large" sx={{ py: 1.5, borderRadius: 3, textTransform: 'none', fontSize: '1.05rem', fontWeight: 700, borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
                Review Pending Inquiries
              </Button>
              <Button component={RouterLink} to="/admin/users" variant="outlined" size="large" sx={{ py: 1.5, borderRadius: 3, textTransform: 'none', fontSize: '1.05rem', fontWeight: 700, color: '#64748b', borderColor: 'rgba(148,163,184,0.3)' }}>
                Manage User Access
              </Button>
            </Stack>
          </SectionCard>
        </MotionGrid>
      </MotionGrid>

      <MotionGrid container spacing={3} variants={containerVariants}>
        <MotionGrid item xs={12} lg={6} variants={itemVariants}>
          <SectionCard sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Recent Inquiries</Typography>
              <Button component={RouterLink} to="/admin/inquiries" size="small" sx={{ textTransform: 'none', fontWeight: 700 }}>View All</Button>
            </Box>
            {recentInquiries.length === 0 ? (
              <Typography sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>No recent inquiries.</Typography>
            ) : (
              <Stack spacing={2}>
                {recentInquiries.slice(0, 4).map((inquiry) => (
                  <Box key={inquiry._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 3, transition: 'background 0.2s', '&:hover': { background: 'rgba(241,245,249,0.8)' } }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{inquiry.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>{inquiry.subject}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>{new Date(inquiry.createdAt).toLocaleDateString()}</Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </SectionCard>
        </MotionGrid>

        <MotionGrid item xs={12} lg={6} variants={itemVariants}>
          <SectionCard sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Newest Users</Typography>
              <Button component={RouterLink} to="/admin/users" size="small" sx={{ textTransform: 'none', fontWeight: 700 }}>View All</Button>
            </Box>
            {users.length === 0 ? (
              <Typography sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>No users found.</Typography>
            ) : (
              <Stack spacing={2}>
                {users.slice(0, 4).map((user) => (
                  <Box key={user._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 3, transition: 'background 0.2s', '&:hover': { background: 'rgba(241,245,249,0.8)' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)', display: 'grid', placeItems: 'center', color: '#0284c7', fontWeight: 800 }}>
                        {user.name.charAt(0).toUpperCase()}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{user.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>{user.email}</Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', px: 1.5, py: 0.5, borderRadius: 99, background: user.role === 'admin' ? 'rgba(37,99,235,0.1)' : 'rgba(22,163,74,0.1)', color: user.role === 'admin' ? '#1d4ed8' : '#15803d', textTransform: 'capitalize' }}>
                      {user.role}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </SectionCard>
        </MotionGrid>
      </MotionGrid>
    </Container>
  );
};

export default AdminOverview;
