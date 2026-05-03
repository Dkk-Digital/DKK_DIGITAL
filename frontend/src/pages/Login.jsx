import React, { useState, useEffect } from 'react';
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

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: '8px' }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" style={{ marginRight: '8px' }}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
    <defs>
      <linearGradient id="instaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433"/>
        <stop offset="25%" stopColor="#e6683c"/>
        <stop offset="50%" stopColor="#dc2743"/>
        <stop offset="75%" stopColor="#cc2366"/>
        <stop offset="100%" stopColor="#bc1888"/>
      </linearGradient>
    </defs>
    <path fill="url(#instaGrad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.322 3.608 1.29.97.97 1.235 2.234 1.294 3.608.058 1.266.069 1.646.069 4.85s-.011 3.584-.069 4.85c-.062 1.366-.322 2.634-1.29 3.608-.97.97-2.234 1.235-3.608 1.294-1.266.058-1.646.069-4.85.069s-3.584-.011-4.85-.069c-1.366-.062-2.634-.322-3.608-1.29-.97-.97-1.235-2.234-1.294-3.608-.058-1.266-.069-1.646-.069-4.85s.011-3.584.069-4.85c.062-1.366.322-2.634 1.29-3.608.97-.97 2.234-1.235 3.608-1.294 1.266-.058 1.646-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-1.35.061-2.423.278-3.327 1.182-.904.904-1.121 1.977-1.182 3.327-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.061 1.35.278 2.423 1.182 3.327.904.904 1.977 1.121 3.327 1.182 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.35-.061 2.423-.278 3.327-1.182.904-.904 1.121-1.977 1.182-3.327.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.061-1.35-.278-2.423-1.182-3.327-.904-.904-1.977-1.121-3.327-1.182-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c0 .796-.646 1.441-1.442 1.441s-1.442-.645-1.442-1.441c0-.797.646-1.442 1.442-1.442s1.442.645 1.442 1.442z"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  // Social Login states
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [socialData, setSocialData] = useState({ name: '', email: '' });
  const [googleClientId, setGoogleClientId] = useState(import.meta.env.VITE_GOOGLE_CLIENT_ID || '843073176458-fv66p5vhd649mbjsluffmbvgn4unh1ff.apps.googleusercontent.com');

  useEffect(() => {
    if (openDialog && selectedProvider === 'Google' && googleClientId) {
      const timer = setTimeout(() => {
        handleRenderGsi();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [openDialog, selectedProvider, googleClientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleRenderGsi = () => {
    if (!googleClientId) {
      errorAlert('Please enter your valid Google Client ID');
      return;
    }
    if (!window.google) {
      errorAlert('Google script is still loading or blocked. Please refresh.');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          try {
            const base64Url = response.credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const payload = JSON.parse(jsonPayload);

            setLoading(true);
            setOpenDialog(false);
            const apiResponse = await authService.socialLogin({
              name: payload.name,
              email: payload.email,
              provider: 'Google'
            });
            login(apiResponse.data.user, apiResponse.data.token);
            successAlert('Logged in with Google Identity Services successfully!');

            if (apiResponse.data.user.role === 'admin') {
              navigate('/admin/dashboard');
            } else {
              navigate('/client/dashboard');
            }
          } catch (err) {
            errorAlert('Google Identity authentication failed or token invalid.');
          } finally {
            setLoading(false);
          }
        }
      });

      window.google.accounts.id.renderButton(
        document.getElementById("gsi-button"),
        { theme: "outline", size: "large", width: 350 }
      );
    } catch (err) {
      errorAlert('Failed to initialize Google Identity Services. Check your Client ID.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      errorAlert('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(formData);
      login(response.data.user, response.data.token);
      successAlert('Logged in successfully!');

      if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (error) {
      errorAlert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSocialDialog = (provider) => {
    setSelectedProvider(provider);
    setSocialData({
      name: '',
      email: ''
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
      successAlert(`Logged in with ${selectedProvider} successfully!`);

      if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (error) {
      errorAlert(error.response?.data?.message || 'Social login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 12 } }}>
        <HeroSection className="fade-in-down">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' }, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: '600px', margin: '0 auto', px: { xs: 2, sm: 0 } }}>
            Login to your account to access your personalized dashboard.
          </Typography>
        </HeroSection>

        <AuthForm component="form" onSubmit={handleSubmit}>
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
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: '#1976d2', py: 1.5, mb: 2 }}
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>

          <Divider sx={{ my: 3 }}><Typography color="textSecondary" variant="body2">OR CONTINUE WITH</Typography></Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleOpenSocialDialog('Google')}
              startIcon={<GoogleIcon />}
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
              startIcon={<FacebookIcon />}
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
              startIcon={<InstagramIcon />}
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
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" sx={{ color: '#1976d2' }}>
                Register here
              </Link>
            </Typography>
          </Box>

        </AuthForm>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ textAlign: 'center', pb: 1, fontWeight: 700 }}>
            {selectedProvider} Authentication
          </DialogTitle>
          <DialogContent>
            {selectedProvider === 'Google' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Real GSI Option */}
                <Box sx={{ p: 2, border: '1px solid rgba(25,118,210,0.12)', borderRadius: '12px', background: 'rgba(25,118,210,0.02)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1976d2' }}>
                    Option A: Real Google Identity Services
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                    Put your Real Google Client ID and click Initialize to test official login.
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    label="Google Client ID"
                    value={googleClientId}
                    onChange={(e) => setGoogleClientId(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 1.5 }}
                  />
                  <Button variant="outlined" fullWidth onClick={handleRenderGsi} sx={{ mb: 1.5 }}>
                    Initialize Google Sign-In
                  </Button>
                  <Box id="gsi-button" sx={{ display: 'flex', justifyContent: 'center' }}></Box>
                </Box>

                <Divider sx={{ my: 1 }}><Typography color="textSecondary" variant="body2">OR SIMULATE</Typography></Divider>

                {/* Simulation Option */}
                <Box sx={{ p: 2, border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#555' }}>
                    Option B: Simulation Mode
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                    Sign in instantly with custom credentials without needing a Client ID.
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
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 1, py: 1.2, backgroundColor: '#EA4335' }}>
                      Sign In via Simulation
                    </Button>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body2" sx={{ mb: 3, color: '#555', textAlign: 'center' }}>
                  Sign in instantly using our secure OAuth testing simulator. Customize the details or use the generated demo accounts.
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
                  <Button type="submit" variant="contained" fullWidth sx={{ mt: 1, py: 1.2, backgroundColor: selectedProvider === 'Facebook' ? '#1877F2' : '#dc2743' }}>
                    Confirm Sign In via {selectedProvider}
                  </Button>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenDialog(false)} color="inherit" fullWidth>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Login;

