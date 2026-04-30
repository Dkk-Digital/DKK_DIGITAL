import React from 'react';
import { Box, Container, Typography, Grid, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 100%)',
  borderTop: '1px solid rgba(255,255,255,0.1)',
  marginTop: '80px',
  paddingTop: '60px',
  paddingBottom: '30px',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: 'rgba(255,255,255,0.7)',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '10px',
  fontSize: '0.95rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#7c4dff',
    paddingLeft: '4px',
  },
}));

const Footer = () => {
  return (
    <FooterBox>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, background: 'linear-gradient(90deg, #7c4dff, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              DKK Digital
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Your trusted partner for digital marketing solutions.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#fff' }}>
              Services
            </Typography>
            <FooterLink href="#services">SEO</FooterLink>
            <FooterLink href="#services">Social Media</FooterLink>
            <FooterLink href="#services">PPC</FooterLink>
            <FooterLink href="#services">Content Marketing</FooterLink>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#fff' }}>
              Company
            </Typography>
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#fff' }}>
              Legal
            </Typography>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
            <FooterLink href="#">Cookie Policy</FooterLink>
          </Grid>
        </Grid>
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 3 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
            &copy; {new Date().getFullYear()} DKK Digital. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </FooterBox>
  );
};

export default Footer;
