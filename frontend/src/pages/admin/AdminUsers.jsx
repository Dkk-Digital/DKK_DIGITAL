import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close as CloseIcon, Search as SearchIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { confirmAlert, errorAlert, successAlert } from '../../utils/alerts';
import { authService } from '../../services';
import useAdminPanelData from './useAdminPanelData';

const MotionCard = motion(Card);

const PanelCard = styled(Card)({
  borderRadius: 22,
  border: '1px solid rgba(255,255,255,0.5)',
  background: 'rgba(255,255,255,0.65)',
  backdropFilter: 'blur(24px)',
  boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(241,245,249,0.8)',
    transform: 'scale(1.002)',
    boxShadow: '0 4px 12px rgba(15,23,42,0.05)',
    zIndex: 1,
    position: 'relative',
  },
  '& td': {
    borderBottom: '1px solid rgba(148,163,184,0.1)',
  },
}));

const statusTone = {
  admin: { bg: 'rgba(37,99,235,0.12)', color: '#1d4ed8' },
  client: { bg: 'rgba(22,163,74,0.12)', color: '#15803d' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const AdminUsers = () => {
  const { users, loading, refresh } = useAdminPanelData();
  const [selectedUser, setSelectedUser] = useState(null);
  const [savingRoleId, setSavingRoleId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const summary = useMemo(() => ({
    total: users.length,
    admins: users.filter((user) => user.role === 'admin').length,
    clients: users.filter((user) => user.role === 'client').length,
  }), [users]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const matchesQuery = !normalizedQuery
        || user.name?.toLowerCase().includes(normalizedQuery)
        || user.email?.toLowerCase().includes(normalizedQuery);
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [users, roleFilter, searchQuery]);

  const paginatedUsers = useMemo(
    () => filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredUsers, page, rowsPerPage]
  );

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredUsers.length / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredUsers.length, page, rowsPerPage]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
    setPage(0);
  };

  const handleRoleChange = async (id, role) => {
    try {
      setSavingRoleId(id);
      await authService.updateUserRole(id, { role });
      successAlert('User role updated');
      await refresh();
    } catch (error) {
      errorAlert(error.response?.data?.message || 'Failed to update role');
    } finally {
      setSavingRoleId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAlert('Delete this user?', 'This will permanently remove the user.');
    if (!confirmed) return;

    try {
      await authService.deleteUser(id);
      successAlert('User deleted');
      await refresh();
      if (selectedUser?._id === id) {
        setSelectedUser(null);
      }
    } catch (error) {
      errorAlert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: { xs: 8, md: 12 } }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" disableGutters component={motion.div} initial="hidden" animate="visible" variants={containerVariants}>
      <Box sx={{ mb: 4 }} component={motion.div} variants={itemVariants}>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 1, background: 'linear-gradient(90deg, #0f172a, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Users
        </Typography>
        <Typography sx={{ color: '#64748b', maxWidth: 760, fontSize: '1.1rem' }}>
          Manage admins and clients from one place with direct role and account actions.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }} component={motion.div} variants={containerVariants}>
        {[
          { label: 'Total users', value: summary.total, tone: '#2563eb' },
          { label: 'Admins', value: summary.admins, tone: '#0ea5e9' },
          { label: 'Clients', value: summary.clients, tone: '#16a34a' },
        ].map((metric) => (
          <PanelCard key={metric.label} component={motion.div} variants={itemVariants} sx={{ p: 2.5, minWidth: { xs: '100%', sm: 160 }, flex: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
              {metric.label}
            </Typography>
            <Typography variant="h3" sx={{ mt: 1, fontWeight: 900, color: metric.tone }}>
              {metric.value}
            </Typography>
          </PanelCard>
        ))}
      </Stack>

      <MotionCard variants={itemVariants} sx={{ borderRadius: 22, border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(24px)', p: { xs: 2, md: 3 }, mb: 3, boxShadow: '0 10px 30px rgba(15,23,42,0.05)' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
          <TextField
            fullWidth
            label="Search users"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by name or email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.8)' } }}
          />

          <FormControl sx={{ minWidth: { xs: '100%', md: 180 } }}>
            <InputLabel id="role-filter-label">Role</InputLabel>
            <Select
              labelId="role-filter-label"
              value={roleFilter}
              label="Role"
              onChange={handleRoleFilterChange}
              sx={{ borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.8)' }}
            >
              <MenuItem value="all">All roles</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="client">Client</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </MotionCard>

      <MotionCard variants={itemVariants} sx={{ borderRadius: 22, border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(24px)', p: { xs: 3, md: 4 }, mt: 3, overflow: 'visible', boxShadow: '0 10px 30px rgba(15,23,42,0.05)' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
          User Directory
        </Typography>


        {filteredUsers.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography sx={{ color: '#64748b', fontSize: '1.1rem' }}>No users found matching your filters.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#64748b', fontWeight: 700, borderBottom: '2px solid rgba(148,163,184,0.1)' }}>Name</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: 700, borderBottom: '2px solid rgba(148,163,184,0.1)' }}>Email</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: 700, borderBottom: '2px solid rgba(148,163,184,0.1)' }}>Role</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: 700, borderBottom: '2px solid rgba(148,163,184,0.1)' }}>Joined</TableCell>
                  <TableCell align="right" sx={{ color: '#64748b', fontWeight: 700, borderBottom: '2px solid rgba(148,163,184,0.1)' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody component={motion.tbody} variants={containerVariants} initial="hidden" animate="visible">
                <AnimatePresence>
                  {paginatedUsers.map((user) => {
                    const tone = statusTone[user.role] || statusTone.client;

                    return (
                      <StyledTableRow key={user._id} component={motion.tr} variants={itemVariants} layout exit={{ opacity: 0, x: -50 }}>
                        <TableCell sx={{ fontWeight: 600 }}>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box sx={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)', display: 'grid', placeItems: 'center', color: '#0284c7', fontWeight: 800 }}>
                              {user.name.charAt(0).toUpperCase()}
                            </Box>
                            {user.name}
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ color: '#475569' }}>{user.email}</TableCell>
                        <TableCell>
                          <Chip label={user.role} sx={{ backgroundColor: tone.bg, color: tone.color, fontWeight: 700, textTransform: 'capitalize' }} />
                        </TableCell>
                        <TableCell sx={{ color: '#64748b' }}>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button variant="text" size="small" onClick={() => setSelectedUser(user)} sx={{ textTransform: 'none', fontWeight: 600 }}>
                              Details
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleRoleChange(user._id, user.role === 'admin' ? 'client' : 'admin')}
                              disabled={savingRoleId === user._id}
                              sx={{ textTransform: 'none', borderRadius: 2 }}
                            >
                              {user.role === 'admin' ? 'Make Client' : 'Make Admin'}
                            </Button>
                            <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(user._id)} sx={{ textTransform: 'none', borderRadius: 2 }}>
                              Delete
                            </Button>
                          </Stack>
                        </TableCell>
                      </StyledTableRow>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {filteredUsers.length > 0 && (
          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 20]}
            sx={{ mt: 2, borderTop: '1px solid rgba(148,163,184,0.1)' }}
          />
        )}
      </MotionCard>

      <Drawer anchor="right" open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)}>
        <Box sx={{ width: { xs: 320, sm: 420 }, p: 4, position: 'relative', background: '#f8fafc', height: '100%' }}>
          <IconButton onClick={() => setSelectedUser(null)} sx={{ position: 'absolute', top: 16, right: 16 }} aria-label="Close user details">
            <CloseIcon />
          </IconButton>

          {selectedUser && (
            <Stack spacing={3} sx={{ pr: 2 }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#64748b', letterSpacing: '0.12em', fontWeight: 700 }}>
                  User details
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1, mt: 0.5, color: '#0f172a' }}>
                  {selectedUser.name}
                </Typography>
              </Box>

              <Chip label={selectedUser.role} sx={{ width: 'fit-content', backgroundColor: (statusTone[selectedUser.role] || statusTone.client).bg, color: (statusTone[selectedUser.role] || statusTone.client).color, fontWeight: 700, textTransform: 'capitalize' }} />

              <Divider sx={{ borderColor: 'rgba(148,163,184,0.2)' }} />

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Contact Information
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '1.05rem', color: '#1e293b' }}>{selectedUser.email}</Typography>
                {selectedUser.phone && <Typography sx={{ mt: 0.5, color: '#475569' }}>{selectedUser.phone}</Typography>}
                {selectedUser.company && <Typography sx={{ mt: 0.5, color: '#475569' }}>{selectedUser.company}</Typography>}
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  System Info
                </Typography>
                <Typography sx={{ color: '#475569' }}>Joined: {new Date(selectedUser.createdAt).toLocaleString()}</Typography>
              </Box>

              <Stack direction="row" spacing={1.5} sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  sx={{ background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', textTransform: 'none', flex: 1, borderRadius: 2, boxShadow: '0 8px 20px rgba(37,99,235,0.2)' }}
                  onClick={() => handleRoleChange(selectedUser._id, selectedUser.role === 'admin' ? 'client' : 'admin')}
                  disabled={savingRoleId === selectedUser._id}
                >
                  {selectedUser.role === 'admin' ? 'Make Client' : 'Make Admin'}
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleDelete(selectedUser._id)} sx={{ textTransform: 'none', borderRadius: 2 }}>
                  Delete Account
                </Button>
              </Stack>
            </Stack>
          )}
        </Box>
      </Drawer>
    </Container>
  );
};

export default AdminUsers;