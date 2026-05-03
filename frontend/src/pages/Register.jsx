import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, CircularProgress, Link, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';
import { authService } from '../services';
import { useAuth } from '../context/AuthContext';
import { errorAlert, successAlert } from '../utils/alerts';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(25,118,210,0.08) 0%, rgba(124,77,255,0.06) 100%)',
  padding: '60px 0',
  borderRadius: '16px',
  marginBottom: '60px',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: '48px 16px',
    marginBottom: '40px',
  },
}));

const AuthForm = styled(Box)(({ theme }) => ({
  maxWidth: '500px',
  margin: '0 auto',
  padding: '50px',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,252,255,0.8) 100%)',
  borderRadius: '16px',
  border: '1px solid rgba(25,118,210,0.08)',
  boxShadow: '0 10px 30px rgba(16,24,40,0.06)',
  animation: 'fadeInUp 0.8s ease',
  [theme.breakpoints.down('sm')]: {
    padding: '24px',
  },
}));

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  // Social states
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [socialData, setSocialData] = useState({ name: '', email: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      errorAlert('Please fill all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      errorAlert('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      login(response.data.user, response.data.token);
      successAlert('Registered successfully!');
      navigate('/client/dashboard');
    } catch (error) {
      errorAlert(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSocialDialog = (provider) => {
    setSelectedProvider(provider);
    setSocialData({
      name: `New ${provider} User`,
      email: `new-${provider.toLowerCase().replace(/\s+/g, '')}-user@example.com`
    });
    setOpenDialog(true);
  };

  const handleSocialSubmit = async (e) => {
    e.preventDefault();
    if (!socialData.email || !socialData.name) {
      errorAlert('Please provide all details for the social login.');
      return;
    }
    try {
      setLoading(true);
      setOpenDialog(false);
      const response = await authService.socialLogin({
        name: socialData.name,
        email: socialData.email,
        provider: selectedProvider
      });
      login(response.data.user, response.data.token);
      successAlert(`Registered with ${selectedProvider} successfully!`);

      if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (error) {
      errorAlert(error.response?.data?.message || 'Social login/registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 12 } }}>
        <HeroSection className="fade-in-down">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' }, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Create Your Account
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: '600px', margin: '0 auto', px: { xs: 2, sm: 0 } }}>
            Join us today and get started with our digital marketing services.
          </Typography>
        </HeroSection>

        <AuthForm component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: '#1976d2', py: 1.5, mb: 2 }}
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>

          <Divider sx={{ my: 3 }}><Typography color="textSecondary" variant="body2">OR CONTINUE WITH</Typography></Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleOpenSocialDialog('Google')}
              sx={{
                borderColor: '#EA4335',
                color: '#EA4335',
                fontWeight: 600,
                py: 1.2,
                '&:hover': {
                  backgroundColor: 'rgba(234,67,53,0.06)',
                  borderColor: '#EA4335'
                }
              }}
            >
              Continue with Google
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleOpenSocialDialog('Facebook')}
              sx={{
                borderColor: '#1877F2',
                color: '#1877F2',
                fontWeight: 600,
                py: 1.2,
                '&:hover': {
                  backgroundColor: 'rgba(24,119,242,0.06)',
                  borderColor: '#1877F2'
                }
              }}
            >
              Continue with Facebook
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleOpenSocialDialog('Instagram')}
              sx={{
                borderColor: '#dc2743',
                color: '#dc2743',
                fontWeight: 600,
                py: 1.2,
                '&:hover': {
                  backgroundColor: 'rgba(220,39,67,0.06)',
                  borderColor: '#dc2743'
                }
              }}
            >
              Continue with Instagram
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" sx={{ color: '#1976d2' }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </AuthForm>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ textAlign: 'center', pb: 1, fontWeight: 700 }}>
            {selectedProvider} Sign Up Simulation
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 3, color: '#555', textAlign: 'center' }}>
              Register instantly using our secure OAuth testing simulator. Customize the details or use the generated demo accounts.
            </Typography>
            <Box component="form" onSubmit={handleSocialSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={socialData.name}
                onChange={(e) => setSocialData({ ...socialData, name: e.target.value })}
                required
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={socialData.email}
                onChange={(e) => setSocialData({ ...socialData, email: e.target.value })}
                required
                variant="outlined"
              />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 1, py: 1.2, backgroundColor: selectedProvider === 'Google' ? '#EA4335' : selectedProvider === 'Facebook' ? '#1877F2' : '#dc2743' }}>
                Confirm Registration via {selectedProvider}
              </Button>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenDialog(false)} color="inherit" fullWidth>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Register;

