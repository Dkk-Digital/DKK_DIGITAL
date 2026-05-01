import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Typography, CircularProgress, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import Layout from '../components/Layout';
import { serviceService } from '../services';
import toast from 'react-hot-toast';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(25,118,210,0.08) 0%, rgba(124,77,255,0.06) 100%)',
  padding: '80px 0',
  borderRadius: '16px',
  marginBottom: '60px',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: '56px 16px',
    marginBottom: '40px',
  },
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  padding: '30px',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  height: '100%',
  border: '1px solid rgba(25,118,210,0.08)',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,252,255,0.8) 100%)',
  '&:hover': {
    boxShadow: '0 20px 40px rgba(25,118,210,0.15)',
    transform: 'translateY(-8px)',
    borderColor: 'rgba(25,118,210,0.2)',
  },
}));

const ServiceImage = styled('img')(() => ({
  width: '100%',
  height: '180px',
  objectFit: 'cover',
  borderRadius: '12px',
  marginBottom: '18px',
}));

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await serviceService.getAll();
      setServices(response.data.services);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 12 } }}>
        <HeroSection className="fade-in-down">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' }, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Our Services
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: '600px', margin: '0 auto', px: { xs: 1, sm: 0 } }}>
            Explore our comprehensive range of digital marketing solutions designed to accelerate your business growth.
          </Typography>
        </HeroSection>

        {services.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ color: '#666' }}>
              No services available at the moment.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={service._id}>
                <ServiceCard className={`fade-in-up stagger-${(index % 5) + 1} float`}>
                  {service.image?.url && (
                    <ServiceImage src={service.image.url} alt={service.title} />
                  )}
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                    {service.shortDescription}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600, mb: 2 }}>
                    ₹{service.price}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      Category: {service.category}
                    </Typography>
                  </Box>
                  {service.features && service.features.length > 0 && (
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#333' }}>
                        Features:
                      </Typography>
                      <ul style={{ fontSize: '12px', color: '#666', margin: '8px 0' }}>
                        {service.features.slice(0, 3).map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </Box>
                  )}
                  <Button
                    component={RouterLink}
                    to={`/services/${service._id}`}
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 1, borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                  >
                    View Service Page
                  </Button>
                </ServiceCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default Services;
