import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, CircularProgress, Grid, Paper } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import Layout from '../components/Layout';
import { inquiryService } from '../services';
import { errorAlert, successAlert } from '../utils/alerts';
import { motion } from 'framer-motion';

// Icons
import EmailIcon from '@mui/icons-material/EmailRounded';
import PhoneIcon from '@mui/icons-material/PhoneRounded';
import LocationOnIcon from '@mui/icons-material/LocationOnRounded';
import AccessTimeIcon from '@mui/icons-material/AccessTimeRounded';
import SendIcon from '@mui/icons-material/SendRounded';

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
    background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, rgba(255,255,255,0) 60%)',
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

const GlassFormContainer = styled(Paper)(({ theme }) => ({
  padding: '48px',
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '32px 24px',
  },
}));

const InfoCard = styled(Box)(({ theme }) => ({
  padding: '24px',
  borderRadius: '20px',
  background: '#fff',
  border: '1px solid #f1f5f9',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
  display: 'flex',
  alignItems: 'flex-start',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.06)',
    borderColor: '#e2e8f0'
  }
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  width: '56px',
  height: '56px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '20px',
  flexShrink: 0,
  background: `linear-gradient(135deg, ${alpha(color, 0.15)} 0%, ${alpha(color, 0.05)} 100%)`,
  color: color,
  '& svg': {
    fontSize: '28px',
  }
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: '#f8fafc',
    transition: 'all 0.2s',
    '& fieldset': {
      borderColor: '#e2e8f0',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: '#cbd5e1',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#38bdf8',
      borderWidth: '2px',
    },
    '&.Mui-focused': {
      background: '#fff',
      boxShadow: '0 4px 12px rgba(56, 189, 248, 0.1)',
    }
  },
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    serviceInterest: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      errorAlert('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      await inquiryService.create(formData);
      successAlert('Inquiry submitted successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        serviceInterest: '',
      });
    } catch (error) {
      errorAlert(error.response?.data?.message || 'Failed to submit inquiry');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <EmailIcon />,
      color: '#3b82f6',
      title: 'Chat with us',
      text: 'Our friendly team is here to help.',
      detail: 'hello@dkkdigital.com'
    },
    {
      icon: <LocationOnIcon />,
      color: '#8b5cf6',
      title: 'Visit us',
      text: 'Come say hello at our office HQ.',
      detail: 'New Delhi, India'
    },
    {
      icon: <PhoneIcon />,
      color: '#ec4899',
      title: 'Call us',
      text: 'Mon-Fri from 9am to 6pm.',
      detail: '+91 (123) 456-7890'
    },
    {
      icon: <AccessTimeIcon />,
      color: '#10b981',
      title: 'Working Hours',
      text: 'Available for your digital needs.',
      detail: '24/7 Digital Support'
    }
  ];

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
                <Typography variant="subtitle2" sx={{ color: '#38bdf8', fontWeight: 700, letterSpacing: 1.5 }}>
                  GET IN TOUCH
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
                Let's Build Something <br/>
                <Box component="span" sx={{ 
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}>
                  Extraordinary
                </Box>
              </Typography>
              
              <Typography variant="h6" sx={{ 
                color: '#475569', 
                maxWidth: '650px', 
                margin: '0 auto', 
                fontWeight: 400,
                lineHeight: 1.8,
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}>
                Have a question or ready to get started? We'd love to hear from you. Reach out to our team and let's discuss your next digital breakthrough.
              </Typography>
            </motion.div>
          </Container>
        </HeroSection>

        <Container maxWidth="lg" sx={{ mb: 12 }}>
          <Grid container spacing={8}>
            {/* Left Column: Contact Info */}
            <Grid item xs={12} md={5}>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <Box sx={{ mb: 6 }}>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#0f172a', mb: 2 }}>
                    Contact Information
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', mb: 4, fontSize: '1.1rem' }}>
                    Fill out the form and our team will get back to you within 24 hours.
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {contactInfo.map((info, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (idx * 0.1), duration: 0.5 }}
                    >
                      <InfoCard>
                        <IconWrapper color={info.color}>
                          {info.icon}
                        </IconWrapper>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, fontSize: '1.1rem' }}>
                            {info.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                            {info.text}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: info.color }}>
                            {info.detail}
                          </Typography>
                        </Box>
                      </InfoCard>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Right Column: Form */}
            <Grid item xs={12} md={7}>
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <GlassFormContainer component="form" onSubmit={handleSubmit}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 4 }}>
                    Send us a message
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Service Interest"
                        name="serviceInterest"
                        value={formData.serviceInterest}
                        onChange={handleChange}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="How can we help?"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        multiline
                        rows={5}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        endIcon={!loading && <SendIcon />}
                        sx={{ 
                          py: 2, 
                          mt: 2,
                          borderRadius: '12px',
                          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          textTransform: 'none',
                          boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                            boxShadow: '0 15px 25px rgba(99, 102, 241, 0.3)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </GlassFormContainer>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </PageWrapper>
    </Layout>
  );
};

export default Contact;
