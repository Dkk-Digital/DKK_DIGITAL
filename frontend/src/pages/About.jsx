import React from 'react';
import { Container, Box, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';

const AboutSection = styled(Box)(({ theme }) => ({
  padding: '60px 0',
}));

const About = () => {
  return (
    <Layout>
      <AboutSection>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 700 }}>
            About DKK Digital
          </Typography>

          <Box sx={{ mb: 6 }}>
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
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {value.desc}
                  </Typography>
                </Paper>
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
        </Container>
      </AboutSection>
    </Layout>
  );
};

export default About;
