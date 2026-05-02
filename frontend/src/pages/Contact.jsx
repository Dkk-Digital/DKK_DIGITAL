import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { inquiryService } from '../services';
import { errorAlert, successAlert } from '../utils/alerts';

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

const ContactForm = styled(Box)(({ theme }) => ({
  maxWidth: '640px',
  margin: '0 auto',
  padding: '54px 48px',
  background: 'rgba(255, 255, 255, 0.65)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
  [theme.breakpoints.down('sm')]: {
    padding: '32px 24px',
  },
}));

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

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeroSection>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.5rem' }, background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', letterSpacing: '-1.2px' }}>
              Let's Connect
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', maxWidth: '600px', margin: '0 auto', px: { xs: 2, sm: 0 }, fontSize: '1.125rem', fontWeight: 500 }}>
              Interested in speaking with our experts? Leave us a detailed message below and we'll get right back to you.
            </Typography>
          </HeroSection>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ContactForm component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.4)',
                }
              }}
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.4)',
                }
              }}
            />

            <TextField
              fullWidth
              label="Contact Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.4)',
                }
              }}
            />

            <TextField
              fullWidth
              label="Service Interest"
              name="serviceInterest"
              value={formData.serviceInterest}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.4)',
                }
              }}
            />

            <TextField
              fullWidth
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.4)',
                }
              }}
            />

            <TextField
              fullWidth
              label="Brief Details About Your Business"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              variant="outlined"
              multiline
              rows={5}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.4)',
                }
              }}
            />

            <Button
              fullWidth
              variant="contained"
              className="btn-gradient"
              sx={{ py: 1.8, borderRadius: '14px', fontSize: '1.05rem', fontWeight: 700 }}
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={26} color="inherit" /> : 'Send Message'}
            </Button>
          </ContactForm>
        </motion.div>
      </Container>
    </Layout>
  );
};

export default Contact;
