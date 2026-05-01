import React from 'react';
import { Box, Button, Card, Container, Grid, Stack, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import useAdminPanelData from './useAdminPanelData';

const MetricCard = styled(Card)(({ theme }) => ({
  padding: '24px',
  borderRadius: 20,
  border: '1px solid rgba(148,163,184,0.12)',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(245,248,252,0.92))',
  boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
  },
}));

const SectionCard = styled(Card)({
  borderRadius: 22,
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
});

const AdminOverview = () => {
  const { stats, recentInquiries, services, users, loading } = useAdminPanelData();

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: { xs: 8, md: 12 } }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 1 }}>
          Admin overview
        </Typography>
        <Typography sx={{ color: '#64748b', maxWidth: 760 }}>
          Track inquiries, keep services updated, and move between the admin sections from the sidebar.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total inquiries', value: stats?.total ?? 0, tone: '#2563eb' },
          { label: 'New', value: stats?.new ?? 0, tone: '#f59e0b' },
          { label: 'Contacted', value: stats?.contacted ?? 0, tone: '#0ea5e9' },
          { label: 'Converted', value: stats?.converted ?? 0, tone: '#16a34a' },
          { label: 'Users', value: users.length, tone: '#8b5cf6' },
        ].map((metric) => (
          <Grid item xs={12} sm={6} md={metric.label === 'Users' ? 12 : 3} key={metric.label}>
            <MetricCard>
              <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {metric.label}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 900, color: metric.tone }}>
                {metric.value}
              </Typography>
            </MetricCard>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <SectionCard sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Quick actions
            </Typography>
            <Typography sx={{ color: '#64748b', mb: 3 }}>
              Go straight to the areas you work in most.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button component={RouterLink} to="/admin/services" variant="contained" sx={{ textTransform: 'none', background: 'linear-gradient(90deg, #2563eb, #0ea5e9)' }}>
                Manage services
              </Button>
              <Button component={RouterLink} to="/admin/users" variant="outlined" sx={{ textTransform: 'none' }}>
                Manage users
              </Button>
              <Button component={RouterLink} to="/admin/inquiries" variant="outlined" sx={{ textTransform: 'none' }}>
                Review inquiries
              </Button>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Service snapshot
            </Typography>
            {services.length === 0 ? (
              <Typography sx={{ color: '#64748b' }}>No services have been added yet.</Typography>
            ) : (
              <Stack spacing={1.5}>
                {services.slice(0, 4).map((service) => (
                  <Box key={service._id} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{service.title}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {service.category}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: '#2563eb' }}>₹{service.price}</Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          User snapshot
        </Typography>
        {users.length === 0 ? (
          <Typography sx={{ color: '#64748b' }}>No users found.</Typography>
        ) : (
          <Stack spacing={1.5}>
            {users.slice(0, 5).map((user) => (
              <Box key={user._id} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    {user.email}
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 700, color: user.role === 'admin' ? '#1d4ed8' : '#16a34a', textTransform: 'capitalize' }}>
                  {user.role}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </SectionCard>

      <SectionCard sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          Recent inquiries
        </Typography>
        {recentInquiries.length === 0 ? (
          <Typography sx={{ color: '#64748b' }}>No recent inquiries.</Typography>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Name</th>
                  <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Email</th>
                  <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Subject</th>
                  <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inquiry) => (
                  <tr key={inquiry._id}>
                    <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.12)' }}>{inquiry.name}</td>
                    <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.12)' }}>{inquiry.email}</td>
                    <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.12)' }}>{inquiry.subject}</td>
                    <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.12)', color: '#64748b' }}>
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        )}
      </SectionCard>
    </Container>
  );
};

export default AdminOverview;
