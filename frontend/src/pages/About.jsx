import React from 'react';
import { Container, Box, Typography, Grid, Paper, Card, CardContent, CardMedia, Chip, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const AboutSection = styled(Box)(({ theme }) => ({
  padding: '80px 0',
  [theme.breakpoints.down('md')]: {
    padding: '56px 0',
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(25,118,210,0.08) 0%, rgba(124,77,255,0.06) 100%)',
  padding: '60px 0',
  borderRadius: '16px',
  marginBottom: '60px',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: '48px 16px',
    marginBottom: '40px',
  },
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

const teamMembers = [
  {
    name: 'Deepanshu Khandelwal',
    role: 'Digital Marketing Specialist',
    tagline: 'Turning Clicks into Customers 📈',
    description: 'A growth-focused marketer dedicated to scaling brands online with content that converts.',
    whatIDo: ['SEO', 'Paid Ads', 'Analytics'],
    skills: ['Meta Ads', 'Google Ads', 'Sales Funnels', 'GA4'],
    highlights: ['Growth-Focused', 'Content that Converts', 'Scaling Brands'],
    image: '/images/deepanshu.png',
    gradient: 'linear-gradient(135deg, #ff6b00 0%, #ff8e3c 100%)',
    color: '#ff6b00'
  },
  {
    name: 'Keshav Khandelwal',
    role: 'Digital Marketing Specialist',
    tagline: 'I help brands grow online 🚀',
    description: 'Turning clicks into customers by driving results and generating high-quality leads for scaling businesses.',
    whatIDo: ['Digital Marketing Specialist'],
    skills: ['Meta Ads', 'Google Ads', 'Sales Funnels'],
    highlights: ['1+ Years Driving Results', '10+ Brands Scaled', 'Generated Leads', '3X Increased ROI'],
    image: '/images/keshav.png',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    color: '#f59e0b'
  },
  {
    name: 'Aakriti Khandelwal',
    role: 'Visual Designer',
    tagline: 'Designs that tell stories & sell ✨',
    description: 'Crafting clean, modern, and impactful designs that elevate brand identity and drive engagement.',
    whatIDo: ['Clean', 'Modern', 'Impactful'],
    skills: ['Logos', 'Branding', 'Social Media Design', 'Brand Identity', 'UI Design'],
    highlights: ['5-Star Skills', 'Creative Storytelling', 'Brand Growth'],
    image: '/images/aakriti.png',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
    color: '#8b5cf6'
  }
];

const About = () => {
  return (
    <Layout>
      <Container maxWidth="lg">
        <HeroSection className="fade-in-down">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' }, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            About DKK Digital
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: '700px', margin: '0 auto', px: { xs: 2, sm: 0 } }}>
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

          {/* Team Section */}
          <Box sx={{ mt: 8, mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>
              Meet Our Team
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', textAlign: 'center', mb: 6, maxWidth: '600px', mx: 'auto' }}>
              The creative minds and strategic thinkers driving your brand's growth and success.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {teamMembers.map((member, index) => (
                <Grid
                  container
                  spacing={6}
                  key={index}
                  alignItems="center"
                  direction={index % 2 === 0 ? 'row' : 'row-reverse'}
                >
                  <Grid item xs={12} md={5}>
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      <Box sx={{
                        position: 'relative',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0, left: 0, right: 0, bottom: 0,
                          background: `linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)`,
                          pointerEvents: 'none'
                        }
                      }}>
                        <Box
                          component="img"
                          src={member.image}
                          alt={member.name}
                          sx={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                    </motion.div>
                  </Grid>

                  <Grid item xs={12} md={7}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                          {member.name}
                        </Typography>
                        <Box sx={{ display: 'inline-block', px: 2, py: 0.5, borderRadius: '12px', background: member.gradient, color: 'white', mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {member.role}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ color: '#444', fontWeight: 600, mb: 2 }}>
                          {member.tagline}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666', mb: 4, lineHeight: 1.8 }}>
                          {member.description}
                        </Typography>
                      </Box>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="overline" sx={{ fontWeight: 700, color: '#999', mb: 1, display: 'block' }}>
                            What I Do
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {member.whatIDo.map((item, i) => (
                              <Typography key={i} variant="body2" sx={{ display: 'flex', alignItems: 'center', fontWeight: 500, color: '#444' }}>
                                <Box component="span" sx={{ color: member.color, mr: 1 }}>✦</Box> {item}
                              </Typography>
                            ))}
                          </Box>

                          <Typography variant="overline" sx={{ fontWeight: 700, color: '#999', mt: 3, mb: 1, display: 'block' }}>
                            Highlights
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {member.highlights.map((item, i) => (
                              <Chip key={i} label={item} size="small" sx={{ bgcolor: `${member.color}15`, color: member.color, fontWeight: 600 }} />
                            ))}
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Typography variant="overline" sx={{ fontWeight: 700, color: '#999', mb: 1, display: 'block' }}>
                            Core Skills & Platforms
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {member.skills.map((skill, i) => (
                              <Chip
                                key={i}
                                label={skill}
                                sx={{
                                  bgcolor: 'rgba(0,0,0,0.04)',
                                  color: '#333',
                                  fontWeight: 500,
                                  borderRadius: '8px'
                                }}
                              />
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </motion.div>
                  </Grid>
                </Grid>
              ))}
            </Box>
          </Box>
        </AboutSection>
      </Container>
    </Layout>
  );
};

export default About;
