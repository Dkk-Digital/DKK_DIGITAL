import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Container, Menu, MenuItem, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

const LogoText = styled(RouterLink)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  gap: '10px',
});

const LogoImage = styled('img')({
  height: '44px',
  width: 'auto',
  display: 'block',
});

const BrandText = styled('span')({
  fontSize: '22px',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  background: 'linear-gradient(90deg, #1976d2, #0ea5e9)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
});

const NavButton = styled(Button)({
  color: '#333',
  textTransform: 'capitalize',
  fontSize: '16px',
  marginLeft: '10px',
  marginRight: '10px',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#1976d2',
  },
});

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'transparent',
        color: '#333',
        boxShadow: 'none',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid rgba(16,24,40,0.04)'
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar>
          <LogoText to="/" aria-label="DKK Digital home">
            <LogoImage src="/logo.png" alt="DKK Digital logo" />
            <BrandText className="brand-gradient">DKK Digital</BrandText>
          </LogoText>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NavButton component={RouterLink} to="/">
              Home
            </NavButton>
            <NavButton component={RouterLink} to="/services">
              Services
            </NavButton>
            <NavButton component={RouterLink} to="/about">
              About
            </NavButton>
            <NavButton component={RouterLink} to="/blog">
              Blog
            </NavButton>
            <NavButton component={RouterLink} to="/contact">
              Contact
            </NavButton>

            {isAuthenticated ? (
              <>
                <Button onClick={handleMenuOpen} sx={{ textTransform: 'capitalize', color: '#333', ml: 2 }}>
                  {user?.name}
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  {user?.role === 'admin' && (
                    <MenuItem component={RouterLink} to="/admin/dashboard" onClick={handleMenuClose}>
                      Admin Dashboard
                    </MenuItem>
                  )}
                  {user?.role === 'client' && (
                    <MenuItem component={RouterLink} to="/client/dashboard" onClick={handleMenuClose}>
                      My Dashboard
                    </MenuItem>
                  )}
                  <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <NavButton component={RouterLink} to="/login" sx={{ color: 'var(--primary)' }}>
                  Login
                </NavButton>
                <NavButton
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  className="btn-gradient"
                  sx={{ ml: 1 }}
                >
                  Register
                </NavButton>
              </>
            )}
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
