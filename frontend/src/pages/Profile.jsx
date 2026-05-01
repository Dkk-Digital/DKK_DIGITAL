import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';
import { errorAlert, successAlert } from '../utils/alerts';

const ProfileForm = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,252,255,0.8) 100%)',
  padding: '50px',
  borderRadius: '16px',
  border: '1px solid rgba(25,118,210,0.08)',
  boxShadow: '0 10px 30px rgba(16,24,40,0.06)',
  animation: 'fadeInUp 0.8s ease',
  [theme.breakpoints.down('sm')]: {
    padding: '24px',
  },
}));

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    company: user?.company || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await authService.updateProfile(formData);
      updateUser(response.data.user);
      successAlert('Profile updated successfully');
    } catch (error) {
      errorAlert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: { xs: 7, md: 12 } }}>
        <Box className="fade-in-down" sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' }, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            My Profile
          </Typography>
        </Box>

        <ProfileForm component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={user?.email}
            disabled
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#1976d2', px: 4, width: { xs: '100%', sm: 'auto' } }}
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Update Profile'}
            </Button>
          </Box>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="body2" sx={{ color: '#999', mb: 1 }}>
              Account Role: <strong>{user?.role}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: '#999' }}>
              Member Since: <strong>{new Date(user?.createdAt).toLocaleDateString()}</strong>
            </Typography>
          </Box>
        </ProfileForm>
      </Container>
    </Layout>
  );
};

export default Profile;
