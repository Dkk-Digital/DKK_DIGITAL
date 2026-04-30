import React from 'react';
import { Container, Box, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';

const AboutSection = styled(Box)(({ theme }) => ({
  padding: '80px 0',
}));

const HeroSection = styled(Box)(() => ({
  background: 'linear-gradient(135deg, rgba(25,118,210,0.08) 0%, rgba(124,77,255,0.06) 100%)',
  padding: '60px 0',
  borderRadius: '16px',
  marginBottom: '60px',
  textAlign: 'center',
}));

const ValueCard = styled(Paper)(({ theme }) => ({
  padding: '30px',
  borderRadius: '16px',
  border: '1px solid rgba(25,118,210,0.08)',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,252,255,0.8) 100%)',
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(25,118,210,0.15)',
  },
}));

const About = () => {
  return (
    <Layout>
      <Container maxWidth="lg">
        <HeroSection className="fade-in-down">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            About DKK Digital
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: '700px', margin: '0 auto' }}>
            Discover our story, mission, and the values that drive us to deliver excellence in digital marketing.
          </Typography>
        </HeroSection>

      <AboutSection>
        <Box sx={{ mb: 6, animation: 'fadeInUp 0.8s ease' }}>
            <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 3 }}>
              DKK Digital is a leading digital marketing agency dedicated to helping businesses grow in the online space. With years of experience and a team of passionate professionals, we deliver results-driven strategies tailored to your business needs.
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
            Our Mission
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 6 }}>
            To empower businesses with innovative digital marketing solutions that drive growth, engagement, and success in an increasingly digital world.
          </Typography>

          <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
            Our Values
          </Typography>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {[
              { title: 'Excellence', desc: 'We strive for the highest quality in everything we do.' },
              { title: 'Innovation', desc: 'We embrace new technologies and creative strategies.' },
              { title: 'Integrity', desc: 'We maintain transparency and honesty in all dealings.' },
              { title: 'Customer Focus', desc: 'Your success is our success.' },
            ].map((value, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <ValueCard className={`fade-in-up stagger-${(index % 4) + 1}`}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {value.desc}
                  </Typography>
                </ValueCard>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
            Why Choose Us?
          </Typography>
          <Grid container spacing={2}>
            {[
              'Experienced Team of Digital Marketing Experts',
              'Data-Driven Strategies and Proven Results',
              '24/7 Support and Regular Communication',
              'Customized Solutions for Your Business',
              'Latest Tools and Technologies',
              'Transparent Reporting and Analytics',
            ].map((reason, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#1976d2',
                      borderRadius: '50%',
                      mr: 2,
                    }}
                  />
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    {reason}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
      </AboutSection>
      </Container>
    </Layout>
  );
};

export default About;
