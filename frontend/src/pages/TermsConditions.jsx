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

const TermsConditions = () => {
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
              Terms & Conditions
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
              Please read these Terms & Conditions carefully before using the services provided by DKK Digital.
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
                  1. Acceptance of Terms
                </StyledSectionTitle>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                  By accessing or using the DKK Digital platform, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must cease using our application immediately.
                </Typography>
                <Divider sx={{ my: 3, opacity: 0.6 }} />
              </Grid>

              <Grid item xs={12}>
                <StyledSectionTitle variant="h5">
                  2. Intellectual Property
                </StyledSectionTitle>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                  All software, layout designs, digital strategies, and content published on our platform are the exclusive property of DKK Digital or our third-party licensors. You are granted a limited, revocable, and non-exclusive license to use the services strictly for authorized business or individual use. Modification, replication, or distribution without prior explicit permission is prohibited.
                </Typography>
                <Divider sx={{ my: 3, opacity: 0.6 }} />
              </Grid>

              <Grid item xs={12}>
                <StyledSectionTitle variant="h5">
                  3. Client Obligations and Conduct
                </StyledSectionTitle>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                  When using our platform, you agree to:
                </Typography>
                <Box sx={{ pl: 2, mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8, display: 'flex', gap: 1, mb: 1 }}>
                    • Provide true, accurate, and current information when registering or opening inquiries.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8, display: 'flex', gap: 1, mb: 1 }}>
                    • Preserve the confidentiality of your account password and restrict access to authorized individuals.
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8, display: 'flex', gap: 1 }}>
                    • Avoid attempts to decrypt, reverse-engineer, or compromise our servers and platform data.
                  </Typography>
                </Box>
                <Divider sx={{ my: 3, opacity: 0.6 }} />
              </Grid>

              <Grid item xs={12}>
                <StyledSectionTitle variant="h5">
                  4. Limitation of Liability
                </StyledSectionTitle>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                  To the maximum extent permitted by applicable law, DKK Digital and its directors, employees, or partners will not be liable for any indirect, incidental, special, or consequential damages resulting from your use or inability to use our platform or services. This includes loss of business revenues, service interruptions, or personal data compromises.
                </Typography>
                <Divider sx={{ my: 3, opacity: 0.6 }} />
              </Grid>

              <Grid item xs={12}>
                <StyledSectionTitle variant="h5">
                  5. Termination
                </StyledSectionTitle>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, mb: 2 }}>
                  We reserve the right to suspend or terminate access to our platform at our sole discretion, without prior notice, for conduct that we believe violates these Terms, compromises platform security, or is otherwise harmful to DKK Digital or our clients.
                </Typography>
              </Grid>
            </Grid>
          </PolicyCard>
        </motion.div>
      </Container>
    </Layout>
  );
};

export default TermsConditions;
