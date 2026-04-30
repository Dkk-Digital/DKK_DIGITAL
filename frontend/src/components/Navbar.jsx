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
  fontSize: '24px',
  fontWeight: 700,
  color: '#1976d2',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
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
    <AppBar position="sticky" sx={{ backgroundColor: '#ffffff', color: '#333' }}>
      <Container maxWidth="lg">
        <StyledToolbar>
          <LogoText to="/">DKK Digital</LogoText>
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
                <Button
                  onClick={handleMenuOpen}
                  sx={{ textTransform: 'capitalize', color: '#333', ml: 2 }}
                >
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
                <NavButton component={RouterLink} to="/login" sx={{ color: '#1976d2' }}>
                  Login
                </NavButton>
                <NavButton
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  sx={{ backgroundColor: '#1976d2', color: '#fff', ml: 1 }}
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
