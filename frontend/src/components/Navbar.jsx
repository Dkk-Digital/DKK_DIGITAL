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
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.4)',
  borderRadius: '16px',
  marginTop: '12px',
  marginBottom: '4px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
  minHeight: '76px',
  padding: '0 24px',
});

const LogoText = styled('div')({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  gap: '12px',
});

const LogoImage = styled('img')({
  height: '42px',
  width: 'auto',
  display: 'block',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.06)',
  },
});

const BrandText = styled('span')({
  fontSize: '22px',
  fontWeight: 800,
  whiteSpace: 'nowrap',
  background: 'linear-gradient(135deg, #4f46e5 0%, #d946ef 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  letterSpacing: '-0.5px',
});

const NavButton = styled(Button)({
  color: '#4b5563',
  textTransform: 'none',
  fontSize: '15px',
  fontWeight: 600,
  marginLeft: '4px',
  marginRight: '4px',
  padding: '8px 16px',
  borderRadius: '10px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(79, 70, 229, 0.05)',
    color: '#4f46e5',
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
    <Box sx={{ width: 300, p: 3, height: '100%', background: '#ffffff' }} role="presentation">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
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
          <ListItemButton key={item.to} component={RouterLink} to={item.to} onClick={closeMobileMenu} sx={{ borderRadius: '12px', mb: 0.5, '&:hover': { color: '#4f46e5', backgroundColor: 'rgba(79, 70, 229, 0.04)' } }}>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '15px' }} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.05)' }} />

      {isAuthenticated ? (
        <List sx={{ px: 0 }}>
          {user?.role === 'admin' && (
            <ListItemButton component={RouterLink} to="/admin/dashboard" onClick={closeMobileMenu} sx={{ borderRadius: '12px', mb: 0.5 }}>
              <ListItemText primary="Admin Panel" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          )}
          {user?.role === 'client' && (
            <ListItemButton component={RouterLink} to="/client/dashboard" onClick={closeMobileMenu} sx={{ borderRadius: '12px', mb: 0.5 }}>
              <ListItemText primary="My Dashboard" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          )}
          <ListItemButton component={RouterLink} to="/profile" onClick={closeMobileMenu} sx={{ borderRadius: '12px', mb: 0.5 }}>
            <ListItemText primary="Profile" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: '12px', mt: 1, backgroundColor: 'rgba(239, 68, 68, 0.04)', color: '#ef4444' }}>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        </List>
      ) : (
        <Stack spacing={1.5} sx={{ mt: 2 }}>
          <Button component={RouterLink} to="/login" onClick={closeMobileMenu} variant="outlined" sx={{ borderRadius: '12px', py: 1.2, fontWeight: 600 }} fullWidth>
            Login
          </Button>
          <Button component={RouterLink} to="/register" onClick={closeMobileMenu} variant="contained" className="btn-gradient" sx={{ borderRadius: '12px', py: 1.2, fontWeight: 600 }} fullWidth>
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
        color: '#1e293b',
        boxShadow: 'none',
        borderBottom: 'none',
        zIndex: 1100,
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar>
          <LogoText component={RouterLink} to="/" aria-label="DKK Digital home">
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
                <Button onClick={handleMenuOpen} sx={{ textTransform: 'none', fontWeight: 600, color: '#1e293b', ml: 2, borderRadius: '12px', px: 2, py: 1, '&:hover': { backgroundColor: 'rgba(0,0,0,0.03)' } }}>
                  {user?.name}
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { borderRadius: '12px', mt: 1, boxShadow: '0 10px 40px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)' } }}>
                  {user?.role === 'admin' && (
                    <MenuItem component={RouterLink} to="/admin/dashboard" onClick={handleMenuClose} sx={{ fontWeight: 600, fontSize: '14px', py: 1, px: 2.5 }}>
                      Admin Panel
                    </MenuItem>
                  )}
                  {user?.role === 'client' && (
                    <MenuItem component={RouterLink} to="/client/dashboard" onClick={handleMenuClose} sx={{ fontWeight: 600, fontSize: '14px', py: 1, px: 2.5 }}>
                      My Dashboard
                    </MenuItem>
                  )}
                  <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose} sx={{ fontWeight: 600, fontSize: '14px', py: 1, px: 2.5 }}>
                    Profile
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem onClick={handleLogout} sx={{ fontWeight: 600, fontSize: '14px', color: '#ef4444', py: 1, px: 2.5 }}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <NavButton component={RouterLink} to="/login" sx={{ color: '#4f46e5', '&:hover': { backgroundColor: 'rgba(79,70,229,0.04)' } }}>
                  Login
                </NavButton>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  className="btn-gradient"
                  sx={{
                    ml: 1,
                    borderRadius: '12px',
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>

          <IconButton
            edge="end"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, color: '#1e293b' }}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>
        </StyledToolbar>
      </Container>

      <Drawer anchor="right" open={mobileOpen} onClose={closeMobileMenu} PaperProps={{ sx: { borderTopLeftRadius: '16px', borderBottomLeftRadius: '16px' } }}>
        {renderDrawerContent()}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
