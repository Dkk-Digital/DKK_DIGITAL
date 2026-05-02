import React from 'react';
import { Container, Box, Typography, Grid, Paper, Chip } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

import StarIcon from '@mui/icons-material/Star';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ShieldIcon from '@mui/icons-material/Shield';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupIcon from '@mui/icons-material/Group';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import MemoryIcon from '@mui/icons-material/Memory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import HandymanIcon from '@mui/icons-material/Handyman';

const AnimatedBox = motion.create(Box);

const PageWrapper = styled(Box)({
  background: '#ffffff',
  overflow: 'hidden',
});

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: '140px 0 100px',
  background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
  borderRadius: '0 0 40px 40px',
  marginBottom: '80px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(255,255,255,0) 60%)',
    animation: 'spin 40s linear infinite',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  },
  [theme.breakpoints.down('sm')]: {
    padding: '100px 16px 80px',
    borderRadius: '0 0 24px 24px',
  },
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  padding: '40px',
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.03)',
  height: '100%',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.12)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
  },
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
  background: `linear-gradient(135deg, ${alpha(color, 0.15)} 0%, ${alpha(color, 0.05)} 100%)`,
  color: color,
  '& svg': {
    fontSize: '32px',
  }
}));

const SectionTitle = ({ children, align = 'center', subtitle }) => (
  <Box sx={{ mb: 8, textAlign: align }}>
    {subtitle && (
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 800, letterSpacing: 2, display: 'block', mb: 1 }}>
          {subtitle}
        </Typography>
      </motion.div>
    )}
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
      <Typography variant="h2" sx={{ 
        fontWeight: 800, 
        fontSize: { xs: '2.25rem', md: '3.5rem' },
        color: '#0f172a',
        mb: 2,
        letterSpacing: '-0.02em'
      }}>
        {children}
      </Typography>
    </motion.div>
    <motion.div initial={{ width: 0 }} whileInView={{ width: '80px' }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }}>
      <Box sx={{ 
        height: '6px', 
        background: 'linear-gradient(90deg, #6366f1, #a855f7)', 
        borderRadius: '4px',
        margin: align === 'center' ? '0 auto' : '0'
      }} />
    </motion.div>
  </Box>
);

const teamMembers = [
  {
    name: 'Deepanshu Khandelwal',
    role: 'Digital Marketing Specialist',
    tagline: 'Turning Clicks into Customers 📈',
    description: 'A growth-focused marketer dedicated to scaling brands online with content that converts. I specialize in crafting data-driven strategies that amplify online presence and maximize ROI.',
    whatIDo: ['SEO & Organic Growth', 'Paid Advertising Campaigns', 'Data Analytics & Insights'],
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
    description: 'Turning clicks into customers by driving results and generating high-quality leads for scaling businesses. My focus is on creating sustainable pipelines that fuel long-term business growth.',
    whatIDo: ['Lead Generation', 'Conversion Rate Optimization', 'Campaign Management'],
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
    description: 'Crafting clean, modern, and impactful designs that elevate brand identity and drive engagement. I translate complex ideas into intuitive, aesthetically pleasing visual experiences.',
    whatIDo: ['Brand Identity Design', 'UI/UX Experiences', 'Creative Storytelling'],
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
      <PageWrapper>
        {/* Hero Section */}
        <HeroSection>
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <Box sx={{ 
                display: 'inline-block',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: '30px',
                border: '1px solid rgba(255,255,255,0.8)',
                mb: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}>
                <Typography variant="subtitle2" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: 1.5 }}>
                  WELCOME TO DKK DIGITAL
                </Typography>
              </Box>
              
              <Typography variant="h1" sx={{ 
                fontWeight: 900, 
                mb: 3, 
                fontSize: { xs: '3rem', sm: '4rem', md: '5rem' }, 
                lineHeight: 1.1,
                color: '#0f172a',
                letterSpacing: '-0.03em'
              }}>
                We Engineer <br/>
                <Box component="span" sx={{ 
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}>
                  Digital Success
                </Box>
              </Typography>
              
              <Typography variant="h6" sx={{ 
                color: '#475569', 
                maxWidth: '700px', 
                margin: '0 auto', 
                fontWeight: 400,
                lineHeight: 1.8,
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}>
                Discover our story, mission, and the core values that drive our relentless pursuit of excellence in the digital marketing landscape.
              </Typography>
            </motion.div>
          </Container>
        </HeroSection>

        <Container maxWidth="lg">
          {/* Mission & Vision Section */}
          <Box sx={{ py: 8 }}>
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Box sx={{
                      position: 'absolute',
                      top: '-20px',
                      left: '-20px',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)',
                      borderRadius: '30px',
                      zIndex: 0,
                      transform: 'rotate(-3deg)'
                    }} />
                    <Box sx={{
                      position: 'relative',
                      background: '#fff',
                      borderRadius: '30px',
                      p: 6,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                      zIndex: 1
                    }}>
                      <SectionTitle align="left" subtitle="OUR MISSION">
                        Empowering Growth
                      </SectionTitle>
                      <Typography variant="body1" sx={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.8, mb: 4 }}>
                        At DKK Digital, we believe in the transformative power of a strong online presence. Our mission is to empower businesses with innovative, data-driven digital marketing solutions that not only increase visibility but foster genuine engagement.
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.8 }}>
                        We navigate the complexities of the digital world so you can focus on what you do best: running your business. Through strategic thinking and creative execution, we turn your goals into measurable success.
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
                  <Grid container spacing={3}>
                    {[
                      { icon: <AssessmentIcon />, title: "Data-Driven", desc: "Every strategy is backed by deep analytics.", color: "#3b82f6" },
                      { icon: <DesignServicesIcon />, title: "Creative Edge", desc: "Standing out in a crowded digital space.", color: "#8b5cf6" },
                      { icon: <ShowChartIcon />, title: "Scalable Growth", desc: "Systems designed to grow with you.", color: "#ec4899" },
                      { icon: <HeadsetMicIcon />, title: "24/7 Support", desc: "Always here when you need us most.", color: "#10b981" }
                    ].map((item, idx) => (
                      <Grid item xs={12} sm={6} key={idx}>
                        <Paper sx={{ 
                          p: 4, 
                          borderRadius: '20px', 
                          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                          border: '1px solid #f1f5f9',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                            transform: 'translateY(-5px)'
                          }
                        }}>
                          <IconWrapper color={item.color}>
                            {item.icon}
                          </IconWrapper>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                            {item.desc}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </motion.div>
              </Grid>
            </Grid>
          </Box>

          {/* Values Section */}
          <Box sx={{ py: 12 }}>
            <SectionTitle subtitle="OUR VALUES">
              The Principles We Stand By
            </SectionTitle>
            <Grid container spacing={4}>
              {[
                { icon: <StarIcon />, title: 'Excellence', desc: 'We never settle for "good enough". We strive for the highest quality in every campaign, design, and strategy we deliver.', color: '#f59e0b' },
                { icon: <LightbulbIcon />, title: 'Innovation', desc: 'The digital landscape changes daily. We continuously adapt, embracing new technologies and creative strategies to keep you ahead.', color: '#8b5cf6' },
                { icon: <ShieldIcon />, title: 'Integrity', desc: 'Trust is our foundation. We maintain total transparency, honest reporting, and ethical practices in all our dealings.', color: '#10b981' },
                { icon: <FavoriteIcon />, title: 'Customer Focus', desc: 'Your success is our ultimate KPI. We listen, understand, and tailor our approach to align perfectly with your business goals.', color: '#ef4444' },
              ].map((value, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <AnimatedBox
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    sx={{ height: '100%' }}
                  >
                    <GlassCard>
                      <IconWrapper color={value.color}>
                        {value.icon}
                      </IconWrapper>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 800, color: '#0f172a' }}>
                        {value.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7 }}>
                        {value.desc}
                      </Typography>
                    </GlassCard>
                  </AnimatedBox>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Why Choose Us */}
          <Box sx={{ py: 12, borderRadius: '40px', background: '#0f172a', px: { xs: 3, md: 8 }, mb: 12 }}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="overline" sx={{ color: '#38bdf8', fontWeight: 800, letterSpacing: 2, display: 'block', mb: 1 }}>
                THE DKK ADVANTAGE
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, color: '#ffffff', mb: 2 }}>
                Why Choose Us?
              </Typography>
              <Box sx={{ width: '80px', height: '6px', background: 'linear-gradient(90deg, #38bdf8, #818cf8)', borderRadius: '4px', margin: '0 auto' }} />
            </Box>

            <Grid container spacing={4}>
              {[
                { icon: <GroupIcon />, title: 'Expert Team', text: 'Seasoned professionals dedicated to your growth.' },
                { icon: <AutoGraphIcon />, title: 'Proven Results', text: 'A track record of scaling businesses exponentially.' },
                { icon: <HeadsetMicIcon />, title: '24/7 Support', text: 'Round-the-clock assistance and communication.' },
                { icon: <HandymanIcon />, title: 'Custom Solutions', text: 'Strategies tailored specifically to your niche.' },
                { icon: <MemoryIcon />, title: 'Latest Tech', text: 'Leveraging cutting-edge tools for maximum ROI.' },
                { icon: <AssessmentIcon />, title: 'Transparent Analytics', text: 'Clear, jargon-free reporting on your success.' },
              ].map((reason, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      p: 3, 
                      borderRadius: '20px', 
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.08)',
                        transform: 'translateY(-5px)'
                      }
                    }}>
                      <Box sx={{ 
                        color: '#38bdf8', 
                        mr: 3, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        p: 1.5,
                        background: 'rgba(56, 189, 248, 0.1)',
                        borderRadius: '12px'
                      }}>
                        {React.cloneElement(reason.icon, { sx: { fontSize: '28px' }})}
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                          {reason.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                          {reason.text}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Team Section */}
          <Box sx={{ py: 8, mb: 8 }}>
            <SectionTitle subtitle="THE MINDS BEHIND THE MAGIC">
              Meet Our Team
            </SectionTitle>
            <Typography variant="body1" sx={{ color: '#64748b', textAlign: 'center', mb: 10, maxWidth: '600px', mx: 'auto', fontSize: '1.2rem' }}>
              The creative visionaries and strategic powerhouses driving your brand's growth and success.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {teamMembers.map((member, index) => (
                <Grid
                  container
                  spacing={8}
                  key={index}
                  alignItems="center"
                  direction={index % 2 === 0 ? 'row' : 'row-reverse'}
                >
                  <Grid item xs={12} md={5}>
                    <motion.div
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, rotate: index % 2 === 0 ? -2 : 2 }}
                      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    >
                      <Box sx={{
                        position: 'relative',
                        borderRadius: '32px',
                        overflow: 'hidden',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                        transform: 'perspective(1000px) rotateY(0deg)',
                        transition: 'transform 0.5s',
                        '&:hover': {
                          transform: `perspective(1000px) rotateY(${index % 2 === 0 ? '5deg' : '-5deg'})`
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0, left: 0, right: 0, bottom: 0,
                          background: `linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)`,
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
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, fontSize: { xs: '2.5rem', md: '3.5rem' }, color: '#0f172a', letterSpacing: '-0.02em' }}>
                          {member.name}
                        </Typography>
                        <Box sx={{ display: 'inline-block', px: 2.5, py: 1, borderRadius: '12px', background: member.gradient, color: 'white', mb: 3, boxShadow: `0 8px 20px ${alpha(member.color, 0.4)}` }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                            {member.role}
                          </Typography>
                        </Box>
                        <Typography variant="h5" sx={{ color: member.color, fontWeight: 700, mb: 2 }}>
                          {member.tagline}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#475569', mb: 4, lineHeight: 1.9, fontSize: '1.1rem' }}>
                          {member.description}
                        </Typography>
                      </Box>

                      <Grid container spacing={4}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="overline" sx={{ fontWeight: 800, color: '#94a3b8', mb: 2, display: 'block', letterSpacing: 1 }}>
                            WHAT I DO
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {member.whatIDo.map((item, i) => (
                              <Typography key={i} variant="body1" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#334155' }}>
                                <Box component="span" sx={{ color: member.color, mr: 1.5, fontSize: '1.2rem' }}>✦</Box> {item}
                              </Typography>
                            ))}
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Typography variant="overline" sx={{ fontWeight: 800, color: '#94a3b8', mb: 2, display: 'block', letterSpacing: 1 }}>
                            CORE SKILLS
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                            {member.skills.map((skill, i) => (
                              <Chip
                                key={i}
                                label={skill}
                                sx={{
                                  bgcolor: alpha(member.color, 0.1),
                                  color: member.color,
                                  fontWeight: 700,
                                  borderRadius: '10px',
                                  px: 1,
                                  border: `1px solid ${alpha(member.color, 0.2)}`
                                }}
                              />
                            ))}
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Typography variant="overline" sx={{ fontWeight: 800, color: '#94a3b8', mt: 1, mb: 2, display: 'block', letterSpacing: 1 }}>
                            HIGHLIGHTS
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                            {member.highlights.map((item, i) => (
                              <Chip key={i} label={item} sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600, borderRadius: '8px' }} />
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
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default About;

