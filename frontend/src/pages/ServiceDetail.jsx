import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, Chip, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { serviceService } from '../services';
import { errorAlert } from '../utils/alerts';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(217,70,239,0.04) 100%)',
  borderRadius: '24px',
  padding: '64px 40px',
  marginTop: '40px',
  marginBottom: '40px',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  [theme.breakpoints.down('sm')]: {
    padding: '32px 20px',
    borderRadius: '20px',
    marginTop: '24px',
  },
}));

const DetailCard = styled(Card)(({ theme }) => ({
  padding: '36px',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  background: 'rgba(255, 255, 255, 0.65)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    boxShadow: '0 16px 40px rgba(0,0,0,0.04)',
    borderColor: 'rgba(79,70,229,0.12)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '24px',
  },
}));

const ServiceImage = styled('img')(() => ({
  width: '100%',
  height: '100%',
  maxHeight: '380px',
  objectFit: 'cover',
  borderRadius: '20px',
  boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
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
          <CircularProgress color="primary" />
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
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button component={RouterLink} to="/services" variant="text" sx={{ mb: 4, textTransform: 'none', fontWeight: 700, color: '#4f46e5', fontSize: '1.025rem', '&:hover': { background: 'transparent', color: '#a21caf' } }}>
            &larr; Back to Services
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeroSection>
            <Grid container spacing={5} alignItems="center">
              <Grid item xs={12} md={8}>
                <Stack spacing={2.5}>
                  <Chip label={service.category} sx={{ width: 'fit-content', fontWeight: 700, background: 'rgba(79,70,229,0.06)', color: '#4f46e5', border: '1px solid rgba(79,70,229,0.1)' }} />
                  <Typography variant="h3" sx={{ fontWeight: 900, fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.5rem' }, background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', letterSpacing: '-1.2px' }}>
                    {service.title}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#64748b', maxWidth: 720, fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' }, lineHeight: 1.6, fontWeight: 500 }}>
                    {service.shortDescription}
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#4f46e5', fontWeight: 900, fontSize: { xs: '1.8rem', sm: '2.25rem', md: '2.75rem' }, letterSpacing: '-0.5px' }}>
                    ₹{Number(service.price).toLocaleString('en-IN')}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                {service.image?.url ? (
                  <ServiceImage src={service.image.url} alt={service.title} />
                ) : (
                  <DetailCard>
                    <Typography variant="overline" sx={{ color: '#4f46e5', fontWeight: 800, letterSpacing: '1px' }}>
                      Service Overview
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 1.5, lineHeight: 1.6 }}>
                      {service.description}
                    </Typography>
                  </DetailCard>
                )}
              </Grid>
            </Grid>
          </HeroSection>
        </motion.div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <DetailCard>
                <Typography variant="h5" sx={{ mb: 2.5, fontWeight: 800, background: 'linear-gradient(135deg, #1e293b 0%, #4b5563 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', letterSpacing: '-0.3px' }}>
                  What's Included
                </Typography>
                {service.features && service.features.length > 0 ? (
                  <Box component="ul" sx={{ m: 0, pl: 3, color: '#64748b', fontSize: '1.05rem' }}>
                    {service.features.map((feature, index) => (
                      <Box component="li" key={index} sx={{ mb: 1.5, lineHeight: 1.6 }}>
                        {feature}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    No features listed for this service yet.
                  </Typography>
                )}
              </DetailCard>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <DetailCard>
                <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 800, letterSpacing: '-0.3px' }}>
                  Ready to Start?
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3.5, lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Discuss your goals and set realistic, hyper-growth markers with our digital marketing specialists.
                </Typography>
                <Stack spacing={2}>
                  <Button component={RouterLink} to="/contact" variant="contained" className="btn-gradient" fullWidth sx={{ py: 1.6, borderRadius: '14px', fontWeight: 700, fontSize: '1.025rem' }}>
                    Contact Us
                  </Button>
                  <Button component={RouterLink} to="/services" variant="outlined" fullWidth sx={{ py: 1.6, borderRadius: '14px', fontWeight: 700, fontSize: '1.025rem', borderColor: 'rgba(79,70,229,0.3)', color: '#4f46e5', '&:hover': { borderColor: '#4f46e5', background: 'rgba(79,70,229,0.03)' } }}>
                    Explore All Services
                  </Button>
                </Stack>
              </DetailCard>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default ServiceDetail;