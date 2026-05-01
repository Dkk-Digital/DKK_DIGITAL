import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';
import { inquiryService } from '../services';
import toast from 'react-hot-toast';

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

const ContactForm = styled(Box)(({ theme }) => ({
  maxWidth: '600px',
  margin: '0 auto',
  padding: '50px',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,252,255,0.8) 100%)',
  borderRadius: '16px',
  border: '1px solid rgba(25,118,210,0.08)',
  boxShadow: '0 10px 30px rgba(16,24,40,0.06)',
  animation: 'fadeInUp 0.8s ease',
  [theme.breakpoints.down('sm')]: {
    padding: '24px',
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
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      await inquiryService.create(formData);
      toast.success('Inquiry submitted successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        serviceInterest: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit inquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 12 } }}>
        <HeroSection className="fade-in-down">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' }, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Contact Us
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: '600px', margin: '0 auto', px: { xs: 2, sm: 0 } }}>
            Have a question or ready to get started? We'd love to hear from you. Let's connect!
          </Typography>
        </HeroSection>

        <ContactForm component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Service Interest"
            name="serviceInterest"
            value={formData.serviceInterest}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            variant="outlined"
            multiline
            rows={5}
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ backgroundColor: '#1976d2', py: 1.5 }}
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Message'}
          </Button>
        </ContactForm>
      </Container>
    </Layout>
  );
};

export default Contact;
