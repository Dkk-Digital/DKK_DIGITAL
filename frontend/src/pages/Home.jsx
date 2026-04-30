import React, { useEffect, useState } from 'react';
import { Box, Container, Button, Typography, Grid, Card } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import { serviceService } from '../services';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(124,77,255,0.05) 100%)',
  padding: '120px 0',
  textAlign: 'center',
  minHeight: '600px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-20%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(25,118,210,0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-30%',
    left: '-10%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(124,77,255,0.06) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  padding: '40px 30px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,252,255,0.8) 100%)',
  border: '1px solid rgba(25,118,210,0.08)',
  borderRadius: '16px',
  '&:hover': {
    boxShadow: '0 20px 40px rgba(25,118,210,0.15)',
    transform: 'translateY(-8px)',
    borderColor: 'rgba(25,118,210,0.2)',
  },
}));

const ServiceImage = styled('img')(() => ({
  width: '100%',
  height: '160px',
  objectFit: 'cover',
  borderRadius: '12px',
  marginBottom: '18px',
}));

const Home = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceService.getAll();
        setServices(response.data.services.slice(0, 6));
      } catch (error) {
        toast.error('Failed to load services');
      }
    };

    fetchServices();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Welcome to DKK Digital
          </Typography>
          <Typography variant="h5" sx={{ color: '#666', mb: 4, fontWeight: 400, letterSpacing: '-0.5px' }}>
            Your Partner in Digital Marketing Excellence
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/services"
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #1976d2, #7c4dff)',
                px: 5,
                py: 1.5,
                borderRadius: '8px',
                fontWeight: 600,
                boxShadow: '0 10px 25px rgba(25,118,210,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 35px rgba(25,118,210,0.3)',
                },
              }}
            >
              Explore Services
            </Button>
            <Button
              component={RouterLink}
              to="/contact"
              variant="outlined"
              sx={{
                borderColor: '#1976d2',
                color: '#1976d2',
                px: 5,
                py: 1.5,
                borderRadius: '8px',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </HeroSection>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 2, fontWeight: 800, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          Our Services
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: 8, color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Comprehensive digital marketing solutions tailored to elevate your brand and drive measurable results.
        </Typography>
        <Grid container spacing={3}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ServiceCard className="float">
                {service.image?.url && <ServiceImage src={service.image.url} alt={service.title} />}
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                  {service.shortDescription}
                </Typography>
                <Button
                  component={RouterLink}
                  to={`/services/${service._id}`}
                  variant="text"
                  sx={{ mt: 2, textTransform: 'none', fontWeight: 600, color: '#1976d2' }}
                >
                  View Service Page
                </Button>
              </ServiceCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, rgba(25,118,210,0.08) 0%, rgba(124,77,255,0.06) 100%)',
        py: 10,
        borderTop: '1px solid rgba(25,118,210,0.1)',
        borderBottom: '1px solid rgba(25,118,210,0.1)',
      }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 800, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Ready to Transform Your Business?
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
            Let's partner together and achieve outstanding growth.
          </Typography>
          <Button
            component={RouterLink}
            to="/contact"
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #1976d2, #7c4dff)',
              px: 6,
              py: 1.8,
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 10px 25px rgba(25,118,210,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 15px 35px rgba(25,118,210,0.3)',
              },
            }}
          >
            Contact Us Today
          </Button>
        </Container>
      </Box>
    </Layout>
  );
};

export default Home;
