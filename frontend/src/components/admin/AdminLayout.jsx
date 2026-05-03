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
import {
  DashboardOutlined as DashboardOutlinedIcon,
  ViewModuleOutlined as ViewModuleOutlinedIcon,
  GroupOutlined as GroupOutlinedIcon,
  MailOutlineOutlined as MailOutlineOutlinedIcon,
  LogoutOutlined as LogoutOutlinedIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  LanguageOutlined as LanguageOutlinedIcon,
  LibraryBooksOutlined as LibraryBooksIcon,
  AssignmentOutlined as AssignmentIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -15 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
};

const drawerWidth = 320;

const accentMap = {
  Overview: '#38bdf8',
  Services: '#a78bfa',
  Users: '#34d399',
  Inquiries: '#f59e0b',
  Blogs: '#ec4899',
  Messages: '#8b5cf6',
  Projects: '#f43f5e',
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
    'linear-gradient(180deg, rgba(9,15,30,0.98) 0%, rgba(15,23,42,0.98) 52%, rgba(17,24,39,0.985) 100%)',
  color: '#e5eefc',
  padding: '26px 20px',
  borderRight: '1px solid rgba(148,163,184,0.12)',
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  overflow: 'hidden',
  boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.03), 18px 0 40px rgba(15,23,42,0.12)',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.22), transparent 18%), radial-gradient(circle at bottom left, rgba(167,139,250,0.16), transparent 16%), radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08), transparent 26%)',
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: '14px auto 14px 14px',
    width: 1,
    borderRadius: 999,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))',
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
    background: 'linear-gradient(135deg, rgba(59,130,246,0.26), rgba(14,165,233,0.16))',
    color: '#fff',
    boxShadow: '0 16px 30px rgba(37,99,235,0.18)',
  },
  '&.active .MuiListItemIcon-root': {
    color: '#fff',
  },
  '&.active .MuiListItemText-primary': {
    fontWeight: 700,
  },
});

const ShellListItem = styled(ListItemButton)({
  borderRadius: 14,
  marginBottom: 10,
  color: 'rgba(226,232,240,0.9)',
  paddingTop: 12,
  paddingBottom: 12,
  border: '1px solid transparent',
  transition: 'background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    background: 'rgba(148,163,184,0.1)',
    transform: 'translateX(4px)',
    borderColor: 'rgba(148,163,184,0.12)',
  },
});

const navItems = [
  { label: 'Overview', to: '/admin/dashboard', icon: <DashboardOutlinedIcon fontSize="small" /> },
  { label: 'Services', to: '/admin/services', icon: <ViewModuleOutlinedIcon fontSize="small" /> },
  { label: 'Projects', to: '/admin/projects', icon: <AssignmentIcon fontSize="small" /> },
  { label: 'Users', to: '/admin/users', icon: <GroupOutlinedIcon fontSize="small" /> },
  { label: 'Inquiries', to: '/admin/inquiries', icon: <MailOutlineOutlinedIcon fontSize="small" /> },
  { label: 'Blogs', to: '/admin/blogs', icon: <LibraryBooksIcon fontSize="small" /> },
  { label: 'Messages', to: '/admin/messages', icon: <MailOutlineOutlinedIcon fontSize="small" /> },
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
      <Stack spacing={3} sx={{ height: '100%', position: 'relative', zIndex: 1 }}>
        <Box sx={{ p: 0.5 }}>
          <Stack direction="row" alignItems="center" spacing={1.6} sx={{ mb: 2.4 }}>
            <Avatar
              src="/logo.png"
              alt="DKK Digital logo"
              sx={{
                width: 44,
                height: 44,
                bgcolor: 'transparent',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.08) inset, 0 18px 30px rgba(15,23,42,0.22)',
              }}
            />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
                DKK Admin
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.68)', display: 'block', mt: 0.2 }}>
                Control center
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              mb: 2.4,
              p: 2.25,
              borderRadius: 3.5,
              background:
                'linear-gradient(180deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.76) 100%)',
              border: '1px solid rgba(148,163,184,0.14)',
              boxShadow: '0 18px 32px rgba(2,6,23,0.18)',
              position: 'relative',
              zIndex: 1,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 'auto -40px -50px auto',
                width: 110,
                height: 110,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(56,189,248,0.16), transparent 66%)',
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: 'rgba(226,232,240,0.64)', textTransform: 'uppercase', letterSpacing: '0.14em' }}
            >
              Signed in as
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.75, fontWeight: 800, color: '#f8fbff' }}>
              {user?.name || 'Admin'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.74)', display: 'block', mt: 0.2 }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <List disablePadding sx={{ flex: 1, position: 'relative' }}>
          <Typography
            variant="caption"
            sx={{
              px: 1.5,
              pb: 1,
              color: 'rgba(226,232,240,0.52)',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              display: 'block',
            }}
          >
            Navigation
          </Typography>
          {navItems.map((item) => (
            <ShellLink key={item.to} to={item.to} onClick={closeMobileMenu}>
              <ShellListItem>
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: 'rgba(226,232,240,0.72)',
                    '& svg': { fontSize: 20 },
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      display: 'grid',
                      placeItems: 'center',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {item.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 650, fontSize: '0.97rem' }}
                />
              </ShellListItem>
            </ShellLink>
          ))}
        </List>

        <Box>
          <Divider sx={{ borderColor: 'rgba(148,163,184,0.14)', mb: 2.2 }} />
          <Stack spacing={1.2}>
            <Button
              component={RouterLink}
              to="/"
              startIcon={<LanguageOutlinedIcon />}
              variant="outlined"
              onClick={closeMobileMenu}
              sx={{
                color: '#e2e8f0',
                borderColor: 'rgba(226,232,240,0.22)',
                borderRadius: 3,
                py: 1.05,
                justifyContent: 'flex-start',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'rgba(226,232,240,0.46)',
                  backgroundColor: 'rgba(255,255,255,0.04)',
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
                borderRadius: 3,
                py: 1.05,
                textTransform: 'none',
                justifyContent: 'flex-start',
                boxShadow: '0 14px 28px rgba(37,99,235,0.24)',
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
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
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
