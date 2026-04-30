import React from 'react';
import { Box, Container, Button, Typography, Grid, Card } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#f0f4ff',
  padding: '80px 0',
  textAlign: 'center',
  minHeight: '500px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  padding: '30px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    transform: 'translateY(-5px)',
  },
}));

const Home = () => {
  const services = [
    { title: 'SEO Optimization', description: 'Boost your search engine rankings and organic traffic' },
    { title: 'Social Media Marketing', description: 'Grow your brand presence on social platforms' },
    { title: 'PPC Campaigns', description: 'Drive immediate results with targeted ads' },
    { title: 'Content Marketing', description: 'Create compelling content that converts' },
    { title: 'Email Marketing', description: 'Engage customers with personalized email campaigns' },
    { title: 'Web Design', description: 'Beautiful, responsive websites that perform' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: '#1976d2' }}>
            Welcome to DKK Digital
          </Typography>
          <Typography variant="h5" sx={{ color: '#666', mb: 4 }}>
            Your Partner in Digital Marketing Excellence
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/services"
              variant="contained"
              sx={{ backgroundColor: '#1976d2', px: 4, py: 1.5 }}
            >
              Explore Services
            </Button>
            <Button
              component={RouterLink}
              to="/contact"
              variant="outlined"
              sx={{ borderColor: '#1976d2', color: '#1976d2', px: 4, py: 1.5 }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </HeroSection>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 700 }}>
          Our Services
        </Typography>
        <Grid container spacing={3}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ServiceCard>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {service.description}
                </Typography>
              </ServiceCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 6 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
            Ready to Transform Your Business?
          </Typography>
          <Button
            component={RouterLink}
            to="/contact"
            variant="contained"
            sx={{ backgroundColor: '#1976d2', px: 4, py: 1.5 }}
          >
            Contact Us Today
          </Button>
        </Container>
      </Box>
    </Layout>
  );
};

export default Home;
