import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, CircularProgress, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';
import { authService } from '../services';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthForm = styled(Box)(({ theme }) => ({
  maxWidth: '500px',
  margin: '0 auto',
  padding: '40px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(formData);
      login(response.data.user, response.data.token);
      toast.success('Logged in successfully!');

      if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 700 }}>
          Login
        </Typography>

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

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" sx={{ color: '#1976d2' }}>
                Register here
              </Link>
            </Typography>
          </Box>

          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f0f4ff', borderRadius: '4px' }}>
            <Typography variant="caption" sx={{ color: '#666' }}>
              Demo Credentials:
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: '#666' }}>
              Email: admin@dkkdigital.com
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: '#666' }}>
              Password: Admin@123
            </Typography>
          </Box>
        </AuthForm>
      </Container>
    </Layout>
  );
};

export default Login;
