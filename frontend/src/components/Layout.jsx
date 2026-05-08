import React from 'react';
import { Box, Container, Fab, Tooltip } from '@mui/material';
import { Instagram } from '@mui/icons-material';
import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedBackground3D from './AnimatedBackground3D';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', overflowX: 'hidden', position: 'relative' }}>
      <AnimatedBackground3D />
      <Navbar />
      <Box component="main" sx={{ flex: 1, width: '100%', minWidth: 0 }}>
        {children}
      </Box>
      <Footer />
      
      {/* Floating Instagram Button */}
      <Tooltip title="Follow us on Instagram" placement="left">
        <Fab 
          component="a" 
          href="https://www.instagram.com/dkk.digital/" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="instagram"
          sx={{
            position: 'fixed',
            bottom: { xs: 24, md: 32 },
            right: { xs: 24, md: 32 },
            zIndex: 1000,
            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            color: 'white',
            boxShadow: '0 8px 24px rgba(220, 39, 67, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.1) translateY(-4px)',
              boxShadow: '0 12px 28px rgba(220, 39, 67, 0.5)',
            }
          }}
        >
          <Instagram fontSize="medium" />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default Layout;
