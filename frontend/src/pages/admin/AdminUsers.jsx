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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { confirmAlert, errorAlert, successAlert } from '../../utils/alerts';
import { authService } from '../../services';
import useAdminPanelData from './useAdminPanelData';

const PanelCard = styled(Card)({
  borderRadius: 22,
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
});

const statusTone = {
  admin: { bg: 'rgba(37,99,235,0.12)', color: '#1d4ed8' },
  client: { bg: 'rgba(22,163,74,0.12)', color: '#15803d' },
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
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 1 }}>
          Users
        </Typography>
        <Typography sx={{ color: '#64748b', maxWidth: 760 }}>
          Manage admins and clients from one place with direct role and account actions.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total users', value: summary.total, tone: '#2563eb' },
          { label: 'Admins', value: summary.admins, tone: '#0ea5e9' },
          { label: 'Clients', value: summary.clients, tone: '#16a34a' },
        ].map((metric) => (
          <PanelCard key={metric.label} sx={{ p: 2.5, minWidth: { xs: '100%', sm: 160 }, flex: 1 }}>
            <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {metric.label}
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 900, color: metric.tone }}>
              {metric.value}
            </Typography>
          </PanelCard>
        ))}
      </Stack>

      <PanelCard sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
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
          />

          <FormControl sx={{ minWidth: { xs: '100%', md: 180 } }}>
            <InputLabel id="role-filter-label">Role</InputLabel>
            <Select
              labelId="role-filter-label"
              value={roleFilter}
              label="Role"
              onChange={handleRoleFilterChange}
            >
              <MenuItem value="all">All roles</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="client">Client</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </PanelCard>

      <PanelCard sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          User list
        </Typography>

        {filteredUsers.length === 0 ? (
          <Typography sx={{ color: '#64748b' }}>No users found.</Typography>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#64748b' }}>
                  <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Name</th>
                  <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Email</th>
                  <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Role</th>
                  <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Joined</th>
                  <th style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.2)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => {
                  const tone = statusTone[user.role] || statusTone.client;

                  return (
                    <tr key={user._id}>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.12)', verticalAlign: 'top', fontWeight: 600 }}>{user.name}</td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.12)', verticalAlign: 'top' }}>{user.email}</td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.12)', verticalAlign: 'top' }}>
                        <Chip label={user.role} sx={{ backgroundColor: tone.bg, color: tone.color, fontWeight: 700 }} />
                      </td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.12)', verticalAlign: 'top', color: '#64748b' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 8px', borderBottom: '1px solid rgba(148,163,184,0.12)', verticalAlign: 'top' }}>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                          <Button variant="text" onClick={() => setSelectedUser(user)} sx={{ textTransform: 'none' }}>
                            Details
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => handleRoleChange(user._id, user.role === 'admin' ? 'client' : 'admin')}
                            disabled={savingRoleId === user._id}
                            sx={{ textTransform: 'none' }}
                          >
                            {user.role === 'admin' ? 'Make Client' : 'Make Admin'}
                          </Button>
                          <Button variant="outlined" color="error" onClick={() => handleDelete(user._id)} sx={{ textTransform: 'none' }}>
                            Delete
                          </Button>
                        </Stack>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
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
            sx={{ mt: 1 }}
          />
        )}
      </PanelCard>

      <Drawer anchor="right" open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)}>
        <Box sx={{ width: { xs: 320, sm: 420 }, p: 3, position: 'relative' }}>
          <IconButton onClick={() => setSelectedUser(null)} sx={{ position: 'absolute', top: 12, right: 12 }} aria-label="Close user details">
            <CloseIcon />
          </IconButton>

          {selectedUser && (
            <Stack spacing={2.5} sx={{ pr: 3 }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#64748b', letterSpacing: '0.12em' }}>
                  User details
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1, mt: 0.5 }}>
                  {selectedUser.name}
                </Typography>
              </Box>

              <Chip label={selectedUser.role} sx={{ width: 'fit-content', backgroundColor: (statusTone[selectedUser.role] || statusTone.client).bg, color: (statusTone[selectedUser.role] || statusTone.client).color, fontWeight: 700 }} />

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5 }}>
                  Contact
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{selectedUser.email}</Typography>
                {selectedUser.phone && <Typography>{selectedUser.phone}</Typography>}
                {selectedUser.company && <Typography>{selectedUser.company}</Typography>}
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5 }}>
                  Joined
                </Typography>
                <Typography>{new Date(selectedUser.createdAt).toLocaleString()}</Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  sx={{ background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', textTransform: 'none' }}
                  onClick={() => handleRoleChange(selectedUser._id, selectedUser.role === 'admin' ? 'client' : 'admin')}
                  disabled={savingRoleId === selectedUser._id}
                >
                  {selectedUser.role === 'admin' ? 'Make Client' : 'Make Admin'}
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleDelete(selectedUser._id)} sx={{ textTransform: 'none' }}>
                  Delete
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