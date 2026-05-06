import React, { useEffect, useState } from 'react';
import { Box, Container, Button, Typography, Grid, Card } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import TiltCard from '../components/TiltCard';
import { serviceService } from '../services';
import { errorAlert } from '../utils/alerts';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(217, 70, 239, 0.03) 50%, rgba(59, 130, 246, 0.02) 100%)',
  padding: '140px 0 100px 0',
  textAlign: 'center',
  minHeight: '620px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-40%',
    right: '-15%',
    width: '650px',
    height: '650px',
    background: 'radial-gradient(circle, rgba(217, 70, 239, 0.07) 0%, transparent 65%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    filter: 'blur(40px)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-35%',
    left: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(79, 70, 229, 0.07) 0%, transparent 65%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    filter: 'blur(40px)',
  },
  [theme.breakpoints.down('md')]: {
    minHeight: 'auto',
    padding: '96px 16px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '72px 16px',
  },
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  padding: '44px 32px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.7)',
  borderRadius: '24px',
  boxShadow: '0 12px 40px rgba(31, 38, 135, 0.05)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '&:hover': {
    boxShadow: '0 24px 60px rgba(79, 70, 229, 0.12)',
    borderColor: 'rgba(79, 70, 229, 0.3)',
    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.7) 100%)',
  },
}));

const ServiceImage = styled('img')(() => ({
  width: '100%',
  height: '170px',
  objectFit: 'cover',
  borderRadius: '16px',
  marginBottom: '24px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
}));

const Home = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceService.getAll();
        setServices(response.data.services.slice(0, 6));
      } catch (error) {
        errorAlert('Failed to load services');
      }
    };

    fetchServices();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Typography variant="h1" sx={{ fontWeight: 900, mb: 2.5, fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.25rem' }, background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', lineHeight: 1.1, letterSpacing: '-1.5px' }}>
              We Innovate Your Digital Presence
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <Typography variant="h5" sx={{ color: '#4b5563', mb: 5, fontWeight: 500, letterSpacing: '-0.3px', maxWidth: '720px', mx: 'auto', fontSize: { xs: '1.1rem', sm: '1.35rem', md: '1.45rem' }, lineHeight: 1.5 }}>
              Expert strategies in SEO, Content, and Growth tailored to expand your business horizon and achieve measurable dominance.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <Box sx={{ display: 'flex', gap: 2.5, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={RouterLink}
                to="/services"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #a21caf 100%)',
                  px: { xs: 4, sm: 5 },
                  py: 1.8,
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '1.025rem',
                  boxShadow: '0 10px 30px rgba(79,70,229,0.25)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 15px 40px rgba(79,70,229,0.38)',
                  },
                }}
              >
                Discover Our Services
              </Button>
              <Button
                component={RouterLink}
                to="/contact"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(79,70,229,0.3)',
                  color: '#4f46e5',
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  backdropFilter: 'blur(8px)',
                  px: { xs: 4, sm: 5 },
                  py: 1.8,
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '1.025rem',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: '#4f46e5',
                    color: '#fff',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 30px rgba(79,70,229,0.15)',
                    borderColor: 'transparent',
                  },
                }}
              >
                Let's Work Together
              </Button>
            </Box>
          </motion.div>
        </Container>
      </HeroSection>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 9, md: 14 } }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 2, fontWeight: 900, fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.5rem' }, background: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', letterSpacing: '-1px' }}>
          Explore Our Solutions
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', mb: { xs: 6, md: 9 }, color: '#64748b', maxWidth: '640px', margin: '0 auto', px: { xs: 1, sm: 0 }, fontSize: '1.125rem', lineHeight: 1.6, fontWeight: 500 }}>
          Purpose-built marketing products to drive hyper-growth, user engagement, and exceptional brand value.
        </Typography>
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                style={{ height: '100%' }}
              >
                <TiltCard style={{ height: '100%' }}>
                  <ServiceCard>
                    <Box>
                      {service.image?.url && <ServiceImage src={service.image.url} alt={service.title} />}
                      <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 800, background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', letterSpacing: '-0.3px', fontSize: '1.35rem' }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7, fontWeight: 400, fontSize: '0.95rem' }}>
                        {service.shortDescription}
                      </Typography>
                    </Box>
                    <Button
                      component={RouterLink}
                      to={`/services/${service._id}`}
                      variant="text"
                      sx={{ mt: 3.5, textTransform: 'none', fontWeight: 700, color: '#4f46e5', fontSize: '1rem', '&:hover': { background: 'transparent', color: '#a21caf' } }}
                    >
                      View Details &rarr;
                    </Button>
                  </ServiceCard>
                </TiltCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, rgba(79,70,229,0.04) 0%, rgba(217,70,239,0.05) 100%)',
        py: { xs: 8, md: 12 },
        borderTop: '1px solid rgba(79,70,229,0.06)',
        borderBottom: '1px solid rgba(79,70,229,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h4" sx={{ mb: 1.5, fontWeight: 800, fontSize: { xs: '1.8rem', sm: '2.4rem', md: '2.8rem' }, background: 'linear-gradient(135deg, #4f46e5, #d946ef)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', letterSpacing: '-0.8px' }}>
              Ready to Accelerate Your Reach?
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mb: 5, maxWidth: '600px', mx: 'auto', fontSize: '1.1rem', fontWeight: 500 }}>
              Connect with our professionals today to build something truly exceptional.
            </Typography>
            <Button
              component={RouterLink}
              to="/contact"
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)',
                px: { xs: 5, sm: 6 },
                py: 2,
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '1.05rem',
                boxShadow: '0 12px 35px rgba(79,70,229,0.22)',
                transition: 'all 0.4s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 18px 45px rgba(79,70,229,0.35)',
                },
              }}
            >
              Contact Us Now
            </Button>
          </motion.div>
        </Container>
      </Box>
    </Layout>
  );
};

export default Home;
