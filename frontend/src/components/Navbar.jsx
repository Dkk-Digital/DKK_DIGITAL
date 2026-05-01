import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Stack,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  minHeight: '72px',
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { label: 'Home', to: '/' },
      { label: 'Services', to: '/services' },
      { label: 'About', to: '/about' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact', to: '/contact' },
    ],
    []
  );

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    setMobileOpen(false);
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const renderDrawerContent = () => (
    <Box sx={{ width: 300, p: 2 }} role="presentation">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LogoImage src="/logo.png" alt="DKK Digital logo" />
          <BrandText className="brand-gradient" sx={{ fontSize: '20px' }}>
            DKK Digital
          </BrandText>
        </Box>
        <IconButton onClick={closeMobileMenu} aria-label="Close menu">
          <CloseIcon />
        </IconButton>
      </Stack>

      <List sx={{ px: 0 }}>
        {navItems.map((item) => (
          <ListItemButton key={item.to} component={RouterLink} to={item.to} onClick={closeMobileMenu} sx={{ borderRadius: 2 }}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {isAuthenticated ? (
        <List sx={{ px: 0 }}>
          {user?.role === 'admin' && (
            <ListItemButton component={RouterLink} to="/admin/dashboard" onClick={closeMobileMenu} sx={{ borderRadius: 2 }}>
              <ListItemText primary="Admin Dashboard" />
            </ListItemButton>
          )}
          {user?.role === 'client' && (
            <ListItemButton component={RouterLink} to="/client/dashboard" onClick={closeMobileMenu} sx={{ borderRadius: 2 }}>
              <ListItemText primary="My Dashboard" />
            </ListItemButton>
          )}
          <ListItemButton component={RouterLink} to="/profile" onClick={closeMobileMenu} sx={{ borderRadius: 2 }}>
            <ListItemText primary="Profile" />
          </ListItemButton>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      ) : (
        <Stack spacing={1.5}>
          <Button component={RouterLink} to="/login" onClick={closeMobileMenu} variant="outlined" fullWidth>
            Login
          </Button>
          <Button component={RouterLink} to="/register" onClick={closeMobileMenu} variant="contained" className="btn-gradient" fullWidth>
            Register
          </Button>
        </Stack>
      )}
    </Box>
  );

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
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {navItems.map((item) => (
              <NavButton key={item.to} component={RouterLink} to={item.to}>
                {item.label}
              </NavButton>
            ))}

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

          <IconButton
            edge="end"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, color: '#333' }}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>
        </StyledToolbar>
      </Container>

      <Drawer anchor="right" open={mobileOpen} onClose={closeMobileMenu}>
        {renderDrawerContent()}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
