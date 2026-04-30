import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Typography, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';
import { serviceService } from '../services';
import toast from 'react-hot-toast';

const ServiceCard = styled(Card)(({ theme }) => ({
  padding: '30px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    transform: 'translateY(-5px)',
  },
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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 700 }}>
          Our Services
        </Typography>

        {services.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ color: '#666' }}>
              No services available at the moment.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service._id}>
                <ServiceCard>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
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
