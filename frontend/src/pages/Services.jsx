import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Typography, CircularProgress, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { serviceService } from '../services';
import { errorAlert } from '../utils/alerts';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(217,70,239,0.04) 100%)',
  padding: '96px 0',
  borderRadius: '24px',
  marginBottom: '64px',
  textAlign: 'center',
  border: '1px solid rgba(255,255,255,0.4)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  [theme.breakpoints.down('sm')]: {
    padding: '64px 16px',
    marginBottom: '48px',
  },
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  padding: '36px 30px',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  height: '100%',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  borderRadius: '22px',
  background: 'rgba(255, 255, 255, 0.65)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '&:hover': {
    boxShadow: '0 24px 50px rgba(79,70,229,0.08)',
    transform: 'translateY(-8px)',
    borderColor: 'rgba(79,70,229,0.18)',
    background: '#ffffff',
  },
}));

const ServiceImage = styled('img')(() => ({
  width: '100%',
  height: '190px',
  objectFit: 'cover',
  borderRadius: '16px',
  marginBottom: '20px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
}));

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    fetchServices();
  }, [categoryParam]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await serviceService.getAll();
      let filtered = response.data.services || [];
      if (categoryParam) {
        filtered = filtered.filter(s => 
          s.category?.toLowerCase().includes(categoryParam.toLowerCase()) || 
          s.title?.toLowerCase().includes(categoryParam.toLowerCase())
        );
      }
      setServices(filtered);
    } catch (error) {
      errorAlert('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
          <CircularProgress color="primary" />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 12 } }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeroSection>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.5rem' }, background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', letterSpacing: '-1px' }}>
              Solutions for Growth
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', maxWidth: '620px', margin: '0 auto', px: { xs: 1, sm: 0 }, fontSize: '1.125rem', fontWeight: 500 }}>
              Tailor-made and hyper-optimized marketing strategies to convert potential audiences into loyal, lasting brand relationships.
            </Typography>
          </HeroSection>
        </motion.div>

        {services.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" sx={{ color: '#64748b' }}>
              No services available at the moment.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={service._id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
                  style={{ height: '100%' }}
                >
                  <ServiceCard>
                    <Box>
                      {service.image?.url && (
                        <ServiceImage src={service.image.url} alt={service.title} />
                      )}
                      <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 800, background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', letterSpacing: '-0.3px', fontSize: '1.35rem' }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5, lineHeight: 1.7, fontSize: '0.925rem' }}>
                        {service.shortDescription}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#4f46e5', fontWeight: 700, mb: 1, fontSize: '1.25rem' }}>
                        ₹{Number(service.price).toLocaleString('en-IN')}
                      </Typography>
                      <Box sx={{ mb: 2.5 }}>
                        <Typography variant="caption" sx={{ color: '#94a3b8', background: 'rgba(79,70,229,0.05)', py: 0.5, px: 1.2, borderRadius: '6px', fontWeight: 600 }}>
                          Category: {service.category}
                        </Typography>
                      </Box>
                      {service.features && service.features.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>
                            Core Features:
                          </Typography>
                          <ul style={{ fontSize: '13px', color: '#64748b', margin: '6px 0', paddingLeft: '20px', lineHeight: 1.6 }}>
                            {service.features.slice(0, 3).map((feature, i) => (
                              <li key={i}>{feature}</li>
                            ))}
                          </ul>
                        </Box>
                      )}
                    </Box>
                    <Button
                      component={RouterLink}
                      to={`/services/${service._id}`}
                      variant="contained"
                      className="btn-gradient"
                      fullWidth
                      sx={{ mt: 1, borderRadius: '12px', py: 1.4, fontWeight: 700, boxShadow: 'none' }}
                    >
                      View Solutions
                    </Button>
                  </ServiceCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default Services;
