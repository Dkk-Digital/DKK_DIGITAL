import React from 'react';
import { Box, Container, Typography, Grid, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  borderTop: '1px solid #e0e0e0',
  marginTop: '60px',
  paddingTop: '40px',
  paddingBottom: '20px',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#666',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '8px',
  '&:hover': {
    color: '#1976d2',
  },
}));

const Footer = () => {
  return (
    <FooterBox>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              DKK Digital
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Your trusted partner for digital marketing solutions.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Services
            </Typography>
            <FooterLink href="#services">SEO</FooterLink>
            <FooterLink href="#services">Social Media</FooterLink>
            <FooterLink href="#services">PPC</FooterLink>
            <FooterLink href="#services">Content Marketing</FooterLink>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Company
            </Typography>
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Legal
            </Typography>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
            <FooterLink href="#">Cookie Policy</FooterLink>
          </Grid>
        </Grid>
        <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 2 }}>
          <Typography variant="body2" sx={{ color: '#999', textAlign: 'center' }}>
            &copy; 2024 DKK Digital. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </FooterBox>
  );
};

export default Footer;
