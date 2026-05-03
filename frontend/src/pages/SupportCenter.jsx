import React from 'react';
import { Container, Box, Typography, Grid, Paper, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ExpandMore as ExpandMoreIcon, MailOutline as MailIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(217,70,239,0.04) 100%)',
  padding: '80px 0',
  borderRadius: '24px',
  marginBottom: '48px',
  textAlign: 'center',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  [theme.breakpoints.down('sm')]: {
    padding: '56px 16px',
    marginBottom: '32px',
  },
}));

const SupportCard = styled(Paper)(({ theme }) => ({
  padding: '40px 36px',
  borderRadius: '22px',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  background: 'rgba(255, 255, 255, 0.65)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 20px 45px rgba(79,70,229,0.06)',
    borderColor: 'rgba(79,70,229,0.15)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '28px 20px',
  },
}));

const ContactCard = styled(Paper)(({ theme }) => ({
  padding: '36px',
  borderRadius: '22px',
  border: '1px solid rgba(79, 70, 229, 0.1)',
  background: 'linear-gradient(135deg, rgba(79,70,229,0.03) 0%, rgba(217,70,239,0.02) 100%)',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  height: '100%',
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  border: '1px solid rgba(255,255,255,0.4)',
  borderRadius: '16px !important',
  marginBottom: '14px',
  backdropFilter: 'blur(6px)',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: '0 0 14px 0',
    background: 'rgba(255,255,255,0.4)',
    border: '1px solid rgba(79,70,229,0.15)',
  }
}));

const faqData = [
  {
    question: "What digital marketing solutions do you specialize in?",
    answer: "We focus on conversion-driven digital strategies including SEO Optimization, Content Marketing, Paid Advertising (PPC), and Hyper-targeted Social Media Strategies designed to maximize your ROI."
  },
  {
    question: "How do I create a service inquiry?",
    answer: "To start an inquiry, head to the Services page, select a service of interest, or go directly to our Contact Us page to send a customized brief to our growth consultants."
  },
  {
    question: "Can I manage my inquiries online?",
    answer: "Yes. Once registered as a client, you gain access to the client dashboard where you can monitor inquiries, review quotes, and collaborate directly with our team."
  },
  {
    question: "What is your response time for support inquiries?",
    answer: "We aim to address all incoming inquiries and support requests within 24 to 48 business hours. If you are an active premium client, urgent tickets are addressed sooner."
  }
];

const SupportCenter = () => {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeroSection>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                mb: 2.5,
                fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-1.2px',
              }}
            >
              Support Center
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                maxWidth: '720px',
                margin: '0 auto',
                px: { xs: 2, sm: 0 },
                fontSize: '1.125rem',
                fontWeight: 500,
                lineHeight: 1.6,
              }}
            >
              We're here to help! Explore the FAQs below or reach out directly to our dedicated support team.
            </Typography>
          </HeroSection>
        </motion.div>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SupportCard>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    letterSpacing: '-0.3px',
                  }}
                >
                  Frequently Asked Questions
                </Typography>

                {faqData.map((faq, index) => (
                  <StyledAccordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: '#4f46e5' }} />}
                      sx={{ py: 1 }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#334155' }}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8 }}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </StyledAccordion>
                ))}
              </SupportCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ height: '100%' }}
            >
              <ContactCard>
                <MailIcon sx={{ fontSize: 54, color: '#4f46e5', mb: 1, filter: 'drop-shadow(0 4px 12px rgba(79,70,229,0.2))' }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.2px' }}>
                  Need Further Help?
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', maxWidth: '320px', lineHeight: 1.6, mb: 2 }}>
                  Can't find the answers you're looking for? Contact us directly and we'll respond within 24-48 business hours.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/contact"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)',
                    boxShadow: '0 8px 25px rgba(79,70,229,0.2)',
                    fontWeight: 700,
                    px: 3.5,
                    py: 1.4,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4338ca 0%, #c026d3 100%)',
                    }
                  }}
                >
                  Contact Support
                </Button>
              </ContactCard>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default SupportCenter;
