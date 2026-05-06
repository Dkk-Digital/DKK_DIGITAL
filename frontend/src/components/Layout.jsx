import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedBackground3D from './AnimatedBackground3D';
import AnimatedWrapper from './AnimatedWrapper';

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  // Assign a route-specific animation so pages feel visually distinct.
  let anim = 'fade';
  if (pathname === '/') anim = 'slide-up';
  else if (pathname === '/services') anim = 'slide-left';
  else if (pathname.startsWith('/services/')) anim = 'zoom-in';
  else if (pathname === '/about') anim = 'fade';
  else if (pathname === '/contact') anim = 'bounce-in';
  else if (pathname === '/blog') anim = 'slide-right';
  else if (pathname.startsWith('/blog/')) anim = 'rotate-in';
  else if (pathname === '/privacy') anim = 'skew-in';
  else if (pathname === '/terms') anim = 'flip-in';
  else if (pathname === '/support') anim = 'fade';
  else if (pathname === '/dkk-digital') anim = 'zoom-in';
  else if (pathname === '/login') anim = 'rotate-in';
  else if (pathname === '/register') anim = 'slide-up';
  else if (pathname === '/profile') anim = 'flip-in';
  else if (pathname === '/client/dashboard') anim = 'bounce-in';
  else if (pathname.startsWith('/admin/dashboard')) anim = 'slide-up';
  else if (pathname.startsWith('/admin/services')) anim = 'slide-left';
  else if (pathname.startsWith('/admin/users')) anim = 'slide-right';
  else if (pathname.startsWith('/admin/inquiries')) anim = 'zoom-in';
  else if (pathname.startsWith('/admin/blogs')) anim = 'rotate-in';
  else if (pathname.startsWith('/admin/messages')) anim = 'flip-in';
  else if (pathname.startsWith('/admin/projects')) anim = 'skew-in';
  else anim = 'fade';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', overflowX: 'hidden', position: 'relative' }}>
      <AnimatedBackground3D />
      <Navbar />
      <Box component="main" sx={{ flex: 1, width: '100%', minWidth: 0 }}>
        <AnimatedWrapper type={anim} duration="0.9s">
          {children}
        </AnimatedWrapper>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
