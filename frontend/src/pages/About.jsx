import React from 'react';
import { Container, Box, Typography, Grid, Paper, Chip } from '@mui/material';
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
  background: 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(217,70,239,0.04) 100%)',
  padding: '80px 0',
  borderRadius: '24px',
  marginBottom: '64px',
  textAlign: 'center',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  [theme.breakpoints.down('sm')]: {
    padding: '56px 16px',
    marginBottom: '48px',
  },
}));

const ValueCard = styled(Paper)(({ theme }) => ({
  padding: '36px 30px',
  borderRadius: '22px',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  background: 'rgba(255, 255, 255, 0.65)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 24px 50px rgba(79,70,229,0.08)',
    borderColor: 'rgba(79,70,229,0.18)',
    background: '#ffffff',
  },
}));

const teamMembers = [
  {
    name: 'Deepanshu Khandelwal',
    role: 'Digital Marketing Specialist',
    tagline: 'Turning Clicks into Customers 📈',
    description: 'A growth-focused marketer dedicated to scaling brands online with content that converts.',
    whatIDo: ['SEO Strategy', 'Paid Advertising', 'Analytics Monitoring'],
    skills: ['Meta Ads', 'Google Ads', 'Sales Funnels', 'GA4'],
    highlights: ['Growth-Focused', 'Content that Converts', 'Scaling Brands'],
    image: '/images/deepanshu.png',
    gradient: 'linear-gradient(135deg, #ff6b00 0%, #ff8e3c 100%)',
    color: '#ff6b00'
  },
  {
    name: 'Aakriti Khandelwal',
    role: 'Visual Designer',
    tagline: 'Designs that tell stories & sell ✨',
    description: 'Crafting clean, modern, and impactful designs that elevate brand identity and drive engagement.',
    whatIDo: ['Aesthetics Overhaul', 'Visual Strategy', 'Creative Direction'],
    skills: ['Logos', 'Branding', 'Social Media Design', 'Brand Identity', 'UI Design'],
    highlights: ['5-Star Skills', 'Creative Storytelling', 'Brand Growth'],
    image: '/images/aakriti.png',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
    color: '#8b5cf6'
  },
  {
    name: 'Keshav Khandelwal',
    role: 'Digital Marketing Specialist',
    tagline: 'I help brands grow online 🚀',
    description: 'Turning clicks into customers by driving results and generating high-quality leads for scaling businesses.',
    whatIDo: ['Digital Specialist', 'Performance Marketing'],
    skills: ['Meta Ads', 'Google Ads', 'Sales Funnels'],
    highlights: ['1+ Years Driving Results', '10+ Brands Scaled', 'High Quality Leads', '3X Increased ROI'],
    image: '/images/keshav.png',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    color: '#f59e0b'
  }
];

const About = () => {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeroSection>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2.5, fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.5rem' }, background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', letterSpacing: '-1.2px' }}>
              We Are DKK Digital
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', maxWidth: '720px', margin: '0 auto', px: { xs: 2, sm: 0 }, fontSize: '1.125rem', fontWeight: 500, lineHeight: 1.6 }}>
              A close-knit team dedicated to hyper-targeted performance marketing, beautiful branding, and sustainable digital excellence.
            </Typography>
          </HeroSection>
        </motion.div>

        <AboutSection>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 8 }}>
              <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.8, mb: 4, fontSize: '1.125rem', fontWeight: 500 }}>
                At DKK Digital, our strategies aren't based on simple guesswork. We are a results-focused creative marketing agency dedicated to generating high-quality, conversion-optimized traffic and transforming it into real, sustainable revenue.
              </Typography>
            </Box>
          </motion.div>

          <Typography variant="h4" sx={{ mb: 2.5, fontWeight: 800, background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', letterSpacing: '-0.3px' }}>
            Our Mission
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.8, mb: 8, fontSize: '1.05rem' }}>
            To empower forward-thinking brands with unique and innovative marketing products, conversion-focused funnel designs, and measurable audience engagement.
          </Typography>

          <Typography variant="h4" sx={{ mb: 3.5, fontWeight: 800, background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', letterSpacing: '-0.3px' }}>
            Our Core Values
          </Typography>
          <Grid container spacing={3.5} sx={{ mb: 10 }}>
            {[
              { title: 'Excellence', desc: 'We deliver exceptional marketing assets, high retention visual design, and clean optimization.' },
              { title: 'Innovation', desc: 'We leverage machine learning insights, data analytics, and modern AI tools.' },
              { title: 'Integrity', desc: 'We keep our performance markers transparent and our billing clear.' },
              { title: 'Customer Focus', desc: 'We work closely with you to understand your objectives and grow your base.' },
            ].map((value, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ValueCard>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 800, background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', letterSpacing: '-0.3px' }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7, fontSize: '0.95rem' }}>
                      {value.desc}
                    </Typography>
                  </ValueCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h4" sx={{ mb: 3.5, fontWeight: 800, background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', letterSpacing: '-0.3px' }}>
            Why Choose Us?
          </Typography>
          <Grid container spacing={3} sx={{ mb: 12 }}>
            {[
              'Skilled professionals in core marketing and design',
              'Completely data-driven expansion strategies',
              'Consistent communication and reporting',
              'Tailored marketing funnels for maximum ROI',
              'Sleek and highly engaging user interfaces',
              'Advanced automation and analytical tracking',
            ].map((reason, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -15 : 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box
                      sx={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#4f46e5',
                        borderRadius: '50%',
                        mr: 2.5,
                        boxShadow: '0 0 10px rgba(79,70,229,0.3)',
                      }}
                    />
                    <Typography variant="body1" sx={{ color: '#475569', fontWeight: 500 }}>
                      {reason}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Team Section */}
          <Box sx={{ mt: 8, mb: 6 }}>
            <Typography variant="h3" sx={{ mb: 1.5, fontWeight: 900, textAlign: 'center', background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', letterSpacing: '-1px' }}>
              Meet Our Team
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', textAlign: 'center', mb: 8, maxWidth: '600px', mx: 'auto', fontSize: '1.1rem', fontWeight: 500 }}>
              Passionate professionals working to grow your digital footprint.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7 }}
                    >
                      <Box sx={{
                        position: 'relative',
                        borderRadius: '28px',
                        overflow: 'hidden',
                        boxShadow: '0 16px 45px rgba(0,0,0,0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0, left: 0, right: 0, bottom: 0,
                          background: `linear-gradient(to top, rgba(0,0,0,0.1) 0%, transparent 40%)`,
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
                      transition={{ duration: 0.7, delay: 0.15 }}
                    >
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontSize: { xs: '2.25rem', md: '2.75rem' }, letterSpacing: '-0.8px', background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                          {member.name}
                        </Typography>
                        <Box sx={{ display: 'inline-block', px: 2, py: 0.6, borderRadius: '12px', background: member.gradient, color: 'white', mb: 2, boxShadow: `0 4px 15px ${member.color}25` }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                            {member.role}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ color: '#4b5563', fontWeight: 600, mb: 2.5, letterSpacing: '-0.2px' }}>
                          {member.tagline}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748b', mb: 4, lineHeight: 1.8, fontSize: '1.025rem' }}>
                          {member.description}
                        </Typography>
                      </Box>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="overline" sx={{ fontWeight: 800, color: '#94a3b8', mb: 1, display: 'block', letterSpacing: '1px' }}>
                            CORE OBJECTIVES
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                            {member.whatIDo.map((item, i) => (
                              <Typography key={i} variant="body2" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#334155' }}>
                                <Box component="span" sx={{ color: member.color, mr: 1, fontSize: '1rem' }}>✦</Box> {item}
                              </Typography>
                            ))}
                          </Box>

                          <Typography variant="overline" sx={{ fontWeight: 800, color: '#94a3b8', mt: 3, mb: 1, display: 'block', letterSpacing: '1px' }}>
                            HIGHLIGHTS
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {member.highlights.map((item, i) => (
                              <Chip key={i} label={item} size="small" sx={{ bgcolor: `${member.color}12`, color: member.color, fontWeight: 700, borderRadius: '8px' }} />
                            ))}
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Typography variant="overline" sx={{ fontWeight: 800, color: '#94a3b8', mb: 1, display: 'block', letterSpacing: '1px' }}>
                            PLATFORMS & SKILLS
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {member.skills.map((skill, i) => (
                              <Chip 
                                key={i} 
                                label={skill} 
                                sx={{ 
                                  bgcolor: 'rgba(79,70,229,0.05)', 
                                  color: '#4f46e5',
                                  fontWeight: 600,
                                  borderRadius: '10px'
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
