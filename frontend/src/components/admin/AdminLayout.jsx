import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 286;

const accentMap = {
  Overview: '#38bdf8',
  Services: '#a78bfa',
  Users: '#34d399',
  Inquiries: '#f59e0b',
};

const Shell = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background:
    'radial-gradient(circle at top left, rgba(56,189,248,0.16), transparent 24%), radial-gradient(circle at 82% 12%, rgba(167,139,250,0.16), transparent 20%), radial-gradient(circle at 20% 82%, rgba(52,211,153,0.12), transparent 18%), #eef3f9',
  [theme.breakpoints.up('md')]: {
    display: 'grid',
    gridTemplateColumns: `${drawerWidth}px minmax(0, 1fr)`,
  },
}));

const Sidebar = styled(Box)(({ theme }) => ({
  background:
    'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(17,24,39,0.98) 100%)',
  color: '#e5eefc',
  padding: '24px 18px',
  borderRight: '1px solid rgba(148,163,184,0.14)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.18), transparent 18%), radial-gradient(circle at bottom left, rgba(167,139,250,0.14), transparent 16%)',
    pointerEvents: 'none',
  },
  [theme.breakpoints.down('md')]: {
    width: drawerWidth,
    height: '100%',
  },
}));

const ShellHeader = styled(AppBar)({
  background: 'rgba(238,243,249,0.72)',
  backdropFilter: 'blur(22px)',
  color: '#0f172a',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(148,163,184,0.18)',
});

const ShellLink = styled(NavLink)({
  textDecoration: 'none',
  color: 'inherit',
  borderRadius: 14,
  '&.active .MuiListItemButton-root': {
    background: 'linear-gradient(135deg, rgba(59,130,246,0.22), rgba(14,165,233,0.14))',
    color: '#fff',
  },
  '&.active .MuiListItemIcon-root': {
    color: '#fff',
  },
});

const ShellListItem = styled(ListItemButton)({
  borderRadius: 14,
  marginBottom: 8,
  color: 'rgba(226,232,240,0.9)',
  transition: 'background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    background: 'rgba(148,163,184,0.12)',
    transform: 'translateX(2px)',
  },
});

const navItems = [
  { label: 'Overview', to: '/admin/dashboard', icon: <DashboardOutlinedIcon fontSize="small" /> },
  { label: 'Services', to: '/admin/services', icon: <ViewModuleOutlinedIcon fontSize="small" /> },
  { label: 'Users', to: '/admin/users', icon: <GroupOutlinedIcon fontSize="small" /> },
  { label: 'Inquiries', to: '/admin/inquiries', icon: <MailOutlineOutlinedIcon fontSize="small" /> },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentSection = useMemo(() => {
    const item = navItems.find((entry) => location.pathname.startsWith(entry.to));
    return item?.label || 'Overview';
  }, [location.pathname]);

  const currentAccent = accentMap[currentSection] || '#38bdf8';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const sidebarContent = (
    <Sidebar>
      <Stack spacing={3} sx={{ height: '100%' }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: 'rgba(56,189,248,0.18)', color: '#e0f2fe', fontWeight: 800, boxShadow: '0 0 0 1px rgba(255,255,255,0.08) inset' }}>D</Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                DKK Admin
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.66)' }}>
                Control center
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ mb: 3, p: 2.25, borderRadius: 3, background: 'rgba(15,23,42,0.72)', border: '1px solid rgba(148,163,184,0.12)', position: 'relative', zIndex: 1 }}>
            <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.64)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Signed in as
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 700 }}>
              {user?.name || 'Admin'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.7)' }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <List disablePadding sx={{ flex: 1 }}>
          {navItems.map((item) => (
            <ShellLink key={item.to} to={item.to} onClick={closeMobileMenu}>
              <ShellListItem>
                <ListItemIcon sx={{ minWidth: 36, color: 'rgba(226,232,240,0.72)' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
              </ShellListItem>
            </ShellLink>
          ))}
        </List>

        <Box>
          <Divider sx={{ borderColor: 'rgba(148,163,184,0.14)', mb: 2 }} />
          <Stack spacing={1.2}>
            <Button
              component={RouterLink}
              to="/"
              startIcon={<LanguageOutlinedIcon />}
              variant="outlined"
              onClick={closeMobileMenu}
              sx={{
                color: '#e2e8f0',
                borderColor: 'rgba(226,232,240,0.26)',
                justifyContent: 'flex-start',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'rgba(226,232,240,0.5)',
                },
              }}
              fullWidth
            >
              View Website
            </Button>
            <Button
              onClick={handleLogout}
              startIcon={<LogoutOutlinedIcon />}
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #2563eb, #0ea5e9)',
                textTransform: 'none',
                justifyContent: 'flex-start',
              }}
              fullWidth
            >
              Logout
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Sidebar>
  );

  return (
    <Shell>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>{sidebarContent}</Box>

      <Box sx={{ minWidth: 0 }}>
        <ShellHeader position="sticky">
          <Toolbar sx={{ minHeight: 88, px: { xs: 2, md: 4 }, gap: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1 }}>
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: 'inline-flex', md: 'none' }, color: '#0f172a' }}
                aria-label="Open admin menu"
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 12, height: 42, borderRadius: 99, background: `linear-gradient(180deg, ${currentAccent}, rgba(255,255,255,0.85))`, boxShadow: `0 0 0 6px ${currentAccent}18` }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    {currentSection}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                    Admin Panel
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1.25} sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <Chip label="Live workspace" size="small" sx={{ backgroundColor: `${currentAccent}18`, color: '#0f172a', fontWeight: 700 }} />
              <Button component={RouterLink} to="/" variant="outlined" sx={{ textTransform: 'none', borderRadius: 3 }}>
                Website
              </Button>
              <Button onClick={handleLogout} variant="contained" sx={{ textTransform: 'none', background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', borderRadius: 3, boxShadow: '0 10px 24px rgba(37,99,235,0.22)' }}>
                Logout
              </Button>
            </Stack>
          </Toolbar>
        </ShellHeader>

        <Box component="main" sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 4 }, position: 'relative' }}>
          <Outlet />
        </Box>
      </Box>

      <Drawer anchor="left" open={mobileOpen} onClose={closeMobileMenu}>
        <Box sx={{ width: drawerWidth, height: '100%', position: 'relative' }}>{sidebarContent}</Box>
        <IconButton
          onClick={closeMobileMenu}
          sx={{ position: 'absolute', top: 12, right: 12, color: '#e2e8f0' }}
          aria-label="Close admin menu"
        >
          <CloseIcon />
        </IconButton>
      </Drawer>
    </Shell>
  );
};

export default AdminLayout;
