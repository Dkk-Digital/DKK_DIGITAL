import React from 'react';
import { Container, Box, Typography, Grid, Paper, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

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

const PolicyCard = styled(Paper)(({ theme }) => ({
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

const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1.45rem',
  marginBottom: '16px',
  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  letterSpacing: '-0.4px',
}));

const PrivacyPolicy = () => {
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
              Privacy Policy
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
              At DKK Digital, we value your privacy and are committed to protecting your personal data. Here is everything you need to know about how we manage your information.
            </Typography>
          </HeroSection>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PolicyCard>
            <Typography
              variant="subtitle2"
              sx={{ color: '#94a3b8', mb: 3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}
            >
              Effective Date: May 3, 2026
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12}>
                <StyledSectionTitle variant="h5">
                  1. Information We Collect
                </StyledSectionTitle>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                  We collect information that you provide directly to us when using our services. This includes:
                </Typography>
                <Box sx={{ pl: 2, mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8, display: 'flex', gap: 1, mb: 1 }}>
                    • <strong>Personal Details:</strong> Name, email address, phone number, and physical address when you register or inquire about our services.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8, display: 'flex', gap: 1, mb: 1 }}>
                    • <strong>Business Details:</strong> Business name, website URL, and current digital marketing footprints.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8, display: 'flex', gap: 1 }}>
                    • <strong>Log Data:</strong> IP address, browser type, pages visited, and timestamps.
                  </Typography>
                </Box>
                <Divider sx={{ my: 3, opacity: 0.6 }} />
              </Grid>

              <Grid item xs={12}>
                <StyledSectionTitle variant="h5">
                  2. How We Use Your Information
                </StyledSectionTitle>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                  Your information helps us deliver a secure, optimized, and personalized experience. Specifically, we use your data to:
                </Typography>
                <Box sx={{ pl: 2, mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8, display: 'flex', gap: 1, mb: 1 }}>
                    • Provide, manage, and enhance our digital marketing and software services.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8, display: 'flex', gap: 1, mb: 1 }}>
                    • Communicate updates, reports, and administrative notifications.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8, display: 'flex', gap: 1 }}>
                    • Prevent fraudulent activity, enforce security protocols, and comply with legal requirements.
                  </Typography>
                </Box>
                <Divider sx={{ my: 3, opacity: 0.6 }} />
              </Grid>

              <Grid item xs={12}>
                <StyledSectionTitle variant="h5">
                  3. Cookies and Tracking Technologies
                </StyledSectionTitle>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                  We utilize tracking cookies, web beacons, and persistent device markers to assess user behaviors and site activity. This helps us refine our digital interfaces, personalize content, and offer optimized marketing products. You can adjust your browser settings to decline tracking cookies, though this may limit certain features of our application.
                </Typography>
                <Divider sx={{ my: 3, opacity: 0.6 }} />
              </Grid>

              <Grid item xs={12}>
                <StyledSectionTitle variant="h5">
                  4. Sharing Your Data
                </StyledSectionTitle>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                  We do not trade, sell, or rent your personal information to third parties. We may disclose data to trusted service providers who assist us in hosting, running analytics, and supporting our platform operations, provided they agree to keep your details completely confidential.
                </Typography>
                <Divider sx={{ my: 3, opacity: 0.6 }} />
              </Grid>

              <Grid item xs={12}>
                <StyledSectionTitle variant="h5">
                  5. Your Rights and Choices
                </StyledSectionTitle>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                  Depending on your jurisdiction, you have specific rights regarding your personal information:
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8, display: 'flex', gap: 1, mb: 1 }}>
                    • Accessing the personal data we hold about you.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8, display: 'flex', gap: 1, mb: 1 }}>
                    • Requesting the rectification or erasure of inaccurate information.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8, display: 'flex', gap: 1 }}>
                    • Opting out of marketing communications by using the provided unsubscribe mechanisms.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </PolicyCard>
        </motion.div>
      </Container>
    </Layout>
  );
};

export default PrivacyPolicy;
