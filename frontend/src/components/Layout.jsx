import React from 'react';
import { Box, Container } from '@mui/material';
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
    </Box>
  );
};

export default Layout;
