import React from 'react';
import { Container, Box, Typography, Grid, Paper, Divider, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Shield, Google, Lock, Visibility, AccountBalanceWallet, Email, OpenInNew } from '@mui/icons-material';

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

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: '36px 32px',
  borderRadius: '22px',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  background: 'rgba(255, 255, 255, 0.65)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 8px 30px rgba(0,0,0,0.02)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 20px 45px rgba(79,70,229,0.06)',
    borderColor: 'rgba(79,70,229,0.15)',
    background: '#ffffff',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '28px 20px',
  },
}));

const StyledIconWrapper = styled(Box)(({ theme }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
  background: 'linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(217,70,239,0.08) 100%)',
  color: '#4f46e5',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)',
    color: '#ffffff',
    transform: 'rotate(6deg)',
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

const DkkDigitalInfo = () => {
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
              DKK Digital
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
              Welcome to DKK Digital — a secure digital platform designed to help users manage financial services and digital transactions efficiently. Our platform provides seamless access to modern financial tools with a focus on security, transparency, and user control.
            </Typography>
          </HeroSection>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid container spacing={4}>
            {/* What Our App Does */}
            <Grid item xs={12} md={6}>
              <FeatureCard>
                <StyledIconWrapper>
                  <AccountBalanceWallet sx={{ fontSize: '30px' }} />
                </StyledIconWrapper>
                <StyledSectionTitle variant="h5">
                  What Our App Does
                </StyledSectionTitle>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                  Our goal is to simplify digital finance while maintaining the highest standards of security and usability. With DKK Digital, users can:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Shield sx={{ fontSize: '18px', color: '#4f46e5' }} /> Sign in securely using their Google account
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Visibility sx={{ fontSize: '18px', color: '#4f46e5' }} /> Access and manage their account dashboard
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Lock sx={{ fontSize: '18px', color: '#4f46e5' }} /> Perform digital financial operations
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Shield sx={{ fontSize: '18px', color: '#4f46e5' }} /> Interact with secure and compliant financial infrastructure
                  </Typography>
                </Box>
              </FeatureCard>
            </Grid>

            {/* How We Use Your Data */}
            <Grid item xs={12} md={6}>
              <FeatureCard>
                <StyledIconWrapper>
                  <Google sx={{ fontSize: '30px' }} />
                </StyledIconWrapper>
                <StyledSectionTitle variant="h5">
                  How We Use Your Data
                </StyledSectionTitle>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                  We value your privacy and are committed to protecting your data. When you sign in using Google, we may access:
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8 }}>
                    • Your name
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8 }}>
                    • Your email address
                  </Typography>
                </Box>
                <Divider sx={{ my: 1.5, opacity: 0.6 }} />
                <Typography variant="body2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>
                  We use this information exclusively to:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    • Create and manage your account
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    • Provide secure login access
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    • Communicate important updates related to your account
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 2, color: '#16a34a', fontWeight: 600 }}>
                  We do not sell or share your personal data with third parties.
                </Typography>
              </FeatureCard>
            </Grid>

            {/* Data Security */}
            <Grid item xs={12} md={6}>
              <FeatureCard>
                <StyledIconWrapper>
                  <Lock sx={{ fontSize: '30px' }} />
                </StyledIconWrapper>
                <StyledSectionTitle variant="h5">
                  Data Security
                </StyledSectionTitle>
                <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.8 }}>
                  We implement industry-standard security measures to protect your data and ensure safe usage of our platform. Your transactions and sensitive info are securely encrypted.
                </Typography>
              </FeatureCard>
            </Grid>

            {/* Transparency & User Control */}
            <Grid item xs={12} md={6}>
              <FeatureCard>
                <StyledIconWrapper>
                  <Visibility sx={{ fontSize: '30px' }} />
                </StyledIconWrapper>
                <StyledSectionTitle variant="h5">
                  Transparency & User Control
                </StyledSectionTitle>
                <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.8 }}>
                  You have full control over your data. You can request data deletion or account removal at any time by contacting us directly through our support channels.
                </Typography>
              </FeatureCard>
            </Grid>

            {/* Contact Us */}
            <Grid item xs={12} md={6}>
              <FeatureCard>
                <StyledIconWrapper>
                  <Email sx={{ fontSize: '30px' }} />
                </StyledIconWrapper>
                <StyledSectionTitle variant="h5">
                  Contact Us
                </StyledSectionTitle>
                <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.8, mb: 2 }}>
                  If you have any questions or requests, please feel free to reach out to us at:
                </Typography>
                <Typography variant="body1" sx={{ color: '#4f46e5', fontWeight: 700, mb: 1 }}>
                  📧 Email:{' '}
                  <a href="mailto:support@dkkdigital.co.in" style={{ textDecoration: 'none', color: '#4f46e5' }}>
                    support@dkkdigital.co.in
                  </a>
                </Typography>
              </FeatureCard>
            </Grid>

            {/* Privacy Policy Link */}
            <Grid item xs={12} md={6}>
              <FeatureCard>
                <StyledIconWrapper>
                  <OpenInNew sx={{ fontSize: '30px' }} />
                </StyledIconWrapper>
                <StyledSectionTitle variant="h5">
                  Privacy Policy
                </StyledSectionTitle>
                <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.8, mb: 3 }}>
                  Please review our full Privacy Policy to understand how we handle your data:
                </Typography>
                <Button
                  component={RouterLink}
                  to="/privacy"
                  variant="outlined"
                  sx={{
                    borderColor: '#4f46e5',
                    color: '#4f46e5',
                    borderRadius: '12px',
                    px: 3,
                    py: 1.2,
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(79,70,229,0.06) 0%, rgba(217,70,239,0.04) 100%)',
                      borderColor: '#4f46e5',
                    },
                  }}
                >
                  View Privacy Policy
                </Button>
              </FeatureCard>
            </Grid>
          </Grid>
        </motion.div>

        {/* Important Note banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box
            sx={{
              mt: 6,
              p: 3,
              borderRadius: '18px',
              border: '1px solid rgba(79,70,229,0.12)',
              background: 'linear-gradient(135deg, rgba(79,70,229,0.03) 0%, rgba(217,70,239,0.02) 100%)',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
              Important Note: This website is publicly accessible and does not require login to view this information.
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Layout>
  );
};

export default DkkDigitalInfo;
