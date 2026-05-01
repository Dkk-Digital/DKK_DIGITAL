import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, Chip, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';
import { serviceService } from '../services';
import { errorAlert } from '../utils/alerts';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(124,77,255,0.06) 100%)',
  borderRadius: '24px',
  padding: '56px 32px',
  marginTop: '40px',
  marginBottom: '32px',
  [theme.breakpoints.down('sm')]: {
    padding: '28px 16px',
    borderRadius: '20px',
    marginTop: '24px',
  },
}));

const DetailCard = styled(Card)(({ theme }) => ({
  padding: '28px',
  borderRadius: '20px',
  border: '1px solid rgba(25,118,210,0.08)',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,252,255,0.88) 100%)',
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
  },
}));

const ServiceImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  maxHeight: '360px',
  objectFit: 'cover',
  borderRadius: '20px',
  boxShadow: '0 18px 40px rgba(16,24,40,0.12)',
}));

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await serviceService.getById(id);
        setService(response.data.service);
      } catch (error) {
        errorAlert('Failed to load service details');
        navigate('/services', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout>
        <Container sx={{ display: 'flex', justifyContent: 'center', py: { xs: 7, md: 12 } }}>
          <CircularProgress />
        </Container>
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <Container sx={{ py: { xs: 7, md: 12 } }}>
          <Typography variant="h5">Service not found.</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Button component={RouterLink} to="/services" variant="text" sx={{ mb: 3, textTransform: 'none' }}>
          Back to Services
        </Button>

        <HeroSection>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Chip label={service.category} sx={{ width: 'fit-content', fontWeight: 600 }} />
                <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' }, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                  {service.title}
                </Typography>
                <Typography variant="h6" sx={{ color: '#555', maxWidth: 720, fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}>
                  {service.shortDescription}
                </Typography>
                <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 800, fontSize: { xs: '1.7rem', sm: '2rem', md: '2.5rem' } }}>
                  ₹{service.price}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              {service.image?.url ? (
                <ServiceImage src={service.image.url} alt={service.title} />
              ) : (
                <DetailCard>
                  <Typography variant="overline" sx={{ color: '#1976d2', fontWeight: 700 }}>
                    Service Overview
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                    {service.description}
                  </Typography>
                </DetailCard>
              )}
            </Grid>
          </Grid>
        </HeroSection>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <DetailCard>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                What's Included
              </Typography>
              {service.features && service.features.length > 0 ? (
                <Box component="ul" sx={{ m: 0, pl: 3, color: '#555' }}>
                  {service.features.map((feature, index) => (
                    <Box component="li" key={index} sx={{ mb: 1.25 }}>
                      {feature}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: '#666' }}>
                  No features listed for this service yet.
                </Typography>
              )}
            </DetailCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <DetailCard>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Ready to get started?
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                Reach out to discuss your goals and get a tailored plan for this service.
              </Typography>
              <Stack spacing={1.5}>
                <Button component={RouterLink} to="/contact" variant="contained" fullWidth sx={{ textTransform: 'none', fontWeight: 600 }}>
                  Contact Us
                </Button>
                <Button component={RouterLink} to="/services" variant="outlined" fullWidth sx={{ textTransform: 'none', fontWeight: 600 }}>
                  View All Services
                </Button>
              </Stack>
            </DetailCard>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default ServiceDetail;