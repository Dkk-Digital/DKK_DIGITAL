import React from 'react';
import { Box, Container, Typography, Grid, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
  borderTop: '1px solid rgba(255,255,255,0.05)',
  marginTop: '120px',
  paddingTop: '80px',
  paddingBottom: '40px',
  color: '#cbd5e1',
  [theme.breakpoints.down('sm')]: {
    marginTop: '64px',
    paddingTop: '50px',
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: 'rgba(241,245,249,0.65)',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '12px',
  fontSize: '0.925rem',
  fontWeight: 500,
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#d946ef',
    paddingLeft: '6px',
    textShadow: '0 0 8px rgba(217,70,239,0.3)',
  },
}));

const Footer = () => {
  return (
    <FooterBox>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 5 }} sx={{ mb: { xs: 4, md: 6 }, textAlign: { xs: 'center', md: 'left' } }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, background: 'linear-gradient(90deg, #4f46e5, #d946ef)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', letterSpacing: '-0.5px' }}>
              DKK Digital
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(241,245,249,0.5)', lineHeight: 1.7 }}>
              Creating impactful digital marketing solutions tailored to elevate your brand and exceed expectations.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 700, color: '#f8fafc', fontSize: '1.05rem', letterSpacing: '-0.2px' }}>
              Solutions
            </Typography>
            <FooterLink href="/services">SEO Optimization</FooterLink>
            <FooterLink href="/services">Content Marketing</FooterLink>
            <FooterLink href="/services">Paid Advertising (PPC)</FooterLink>
            <FooterLink href="/services">Social Media Strategy</FooterLink>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 700, color: '#f8fafc', fontSize: '1.05rem', letterSpacing: '-0.2px' }}>
              Company
            </Typography>
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/services">Services</FooterLink>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/blog">Our Blog</FooterLink>
            <FooterLink href="/contact">Contact Us</FooterLink>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 700, color: '#f8fafc', fontSize: '1.05rem', letterSpacing: '-0.2px' }}>
              Trust & Legal
            </Typography>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms & Conditions</FooterLink>
            <FooterLink href="#">Support Center</FooterLink>
          </Grid>
        </Grid>
        <Box sx={{ borderTop: '1px solid rgba(241,245,249,0.08)', pt: 3.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(241,245,249,0.4)', textAlign: 'center', fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} DKK Digital. Innovating online spaces.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(241,245,249,0.3)', fontSize: '0.85rem' }}>
            Elevate your reach, expand your horizon.
          </Typography>
        </Box>
      </Container>
    </FooterBox>
  );
};

export default Footer;
