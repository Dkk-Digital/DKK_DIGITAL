import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  Chip,
  Divider,
  InputAdornment,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { confirmAlert, errorAlert, successAlert } from '../../utils/alerts';
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AssignmentOutlined as AssignmentIcon,
  PersonOutline as PersonIcon,
  Category as CategoryIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { projectService } from '../../services';
import useAdminPanelData from './useAdminPanelData';

const MotionCard = motion(Card);

const PanelCard = styled(Card)({
  borderRadius: 22,
  border: '1px solid rgba(255,255,255,0.5)',
  background: 'rgba(255,255,255,0.65)',
  backdropFilter: 'blur(24px)',
  boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
});

const ProjectRow = styled(motion.div)({
  padding: '20px',
  borderBottom: '1px solid rgba(148,163,184,0.14)',
  transition: 'background 0.2s',
  borderRadius: 12,
  '&:hover': {
    background: 'rgba(241,245,249,0.8)',
  },
});

const statusOptions = ['pending', 'in-progress', 'completed', 'on-hold'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const AdminProjects = () => {
  const { projects, users, loading, refresh } = useAdminPanelData();
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    progress: 0,
    notes: '',
  });

  const handleEdit = (project) => {
    setEditingProject(project);
    setForm({
      title: project.title || '',
      description: project.description || '',
      status: project.status || 'pending',
      progress: project.progress || 0,
      notes: project.notes || '',
    });
    setSelectedProject(null);
  };

  const handleView = (project) => {
    setSelectedProject(project);
    setEditingProject(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editingProject) return;

    try {
      setSaving(true);
      await projectService.update(editingProject._id, form);
      successAlert('Project updated successfully');
      setEditingProject(null);
      await refresh();
    } catch (error) {
      errorAlert(error.response?.data?.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAlert(
      'Delete this project?',
      'This will permanently remove the project and its history.'
    );
    if (!confirmed) return;

    try {
      await projectService.delete(id);
      successAlert('Project deleted');
      await refresh();
    } catch (error) {
      errorAlert('Failed to delete project');
    }
  };

  const filteredProjects = (projects || []).filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: { xs: 8, md: 12 } }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      disableGutters
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box sx={{ mb: 4 }} component={motion.div} variants={itemVariants}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            letterSpacing: '-0.04em',
            mb: 1,
            background: 'linear-gradient(90deg, #0f172a, #334155)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Projects Control
        </Typography>
        <Typography sx={{ color: '#64748b', fontSize: '1.1rem' }}>
          Manage client projects, track status, adjust progress, and update specifics.
        </Typography>
      </Box>

      {/* Filter and Search Bar */}
      <Box sx={{ mb: 4 }} component={motion.div} variants={itemVariants}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search projects by title, client name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.7)' } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.7)' } }}
            >
              <option value="all">All Statuses</option>
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.toUpperCase()}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={editingProject ? 6 : 12} component={motion.div} variants={itemVariants}>
          <PanelCard sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Client Projects ({filteredProjects.length})
            </Typography>

            {filteredProjects.length === 0 ? (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography sx={{ color: '#64748b', fontSize: '1.1rem' }}>No projects found.</Typography>
              </Box>
            ) : (
              <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
                <AnimatePresence>
                  {filteredProjects.map((project) => (
                    <ProjectRow
                      key={project._id}
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, scale: 0.95 }}
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'stretch', md: 'center' },
                        gap: 2,
                        mb: 1.5,
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 3,
                            background: 'rgba(37,99,235,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <AssignmentIcon sx={{ color: '#2563eb' }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>
                            {project.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                            Client: {project.client?.name || 'Unknown Client'} ({project.client?.email || 'N/A'})
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              size="small"
                              label={project.status || 'pending'}
                              sx={{
                                backgroundColor:
                                  project.status === 'completed'
                                    ? 'rgba(16,185,129,0.1)'
                                    : project.status === 'in-progress'
                                    ? 'rgba(245,158,11,0.1)'
                                    : project.status === 'on-hold'
                                    ? 'rgba(139,92,246,0.1)'
                                    : 'rgba(100,116,139,0.1)',
                                color:
                                  project.status === 'completed'
                                    ? '#059669'
                                    : project.status === 'in-progress'
                                    ? '#d97706'
                                    : project.status === 'on-hold'
                                    ? '#7c3aed'
                                    : '#475569',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                fontSize: '0.725rem',
                              }}
                            />
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                              Progress: {project.progress || 0}%
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ alignSelf: { xs: 'flex-end', md: 'center' } }}>
                        <IconButton
                          size="small"
                          onClick={() => handleView(project)}
                          sx={{ color: '#64748b', backgroundColor: 'rgba(255,255,255,0.5)' }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(project)}
                          sx={{ color: '#0ea5e9', backgroundColor: 'rgba(255,255,255,0.5)' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(project._id)}
                          sx={{ color: '#ef4444', backgroundColor: 'rgba(255,255,255,0.5)' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </ProjectRow>
                  ))}
                </AnimatePresence>
              </Box>
            )}
          </PanelCard>
        </Grid>

        {editingProject && (
          <Grid item xs={12} lg={6} component={motion.div} variants={itemVariants}>
            <PanelCard sx={{ p: { xs: 2.5, md: 4 } }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: '#0f172a' }}>
                Edit & Update Project
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
                Adjust title, description, progress, status, and admin notes below.
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Project Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    fullWidth
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' } }}
                  />

                  <TextField
                    label="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' } }}
                  />

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label="Status"
                      select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      SelectProps={{ native: true }}
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' } }}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt.toUpperCase()}
                        </option>
                      ))}
                    </TextField>

                    <TextField
                      label="Progress (%)"
                      type="number"
                      value={form.progress}
                      onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                      fullWidth
                      inputProps={{ min: 0, max: 100 }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' } }}
                    />
                  </Stack>

                  <TextField
                    label="Internal/Admin Notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' } }}
                  />

                  <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={saving}
                      sx={{
                        background: 'linear-gradient(90deg, #2563eb, #0ea5e9)',
                        textTransform: 'none',
                        py: 1.5,
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        borderRadius: 2,
                        flex: 2,
                        boxShadow: '0 8px 20px rgba(37,99,235,0.2)',
                      }}
                    >
                      {saving ? 'Updating...' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => setEditingProject(null)}
                      sx={{ textTransform: 'none', py: 1.5, fontWeight: 600, borderRadius: 2, flex: 1 }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </PanelCard>
          </Grid>
        )}
      </Grid>

      <Drawer anchor="right" open={Boolean(selectedProject)} onClose={() => setSelectedProject(null)}>
        <Box sx={{ width: { xs: 320, sm: 420 }, p: 4, position: 'relative', background: '#f8fafc', height: '100%' }}>
          <IconButton onClick={() => setSelectedProject(null)} sx={{ position: 'absolute', top: 16, right: 16 }}>
            <CloseIcon />
          </IconButton>

          {selectedProject && (
            <Stack spacing={3} sx={{ pr: 2 }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#64748b', letterSpacing: '0.12em', fontWeight: 700 }}>
                  Project details
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1, mt: 0.5, color: '#0f172a' }}>
                  {selectedProject.title}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip
                  label={selectedProject.status || 'pending'}
                  sx={{
                    backgroundColor:
                      selectedProject.status === 'completed'
                        ? 'rgba(16,185,129,0.1)'
                        : 'rgba(245,158,11,0.1)',
                    color: selectedProject.status === 'completed' ? '#059669' : '#d97706',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                />
                <Chip
                  label={`Progress: ${selectedProject.progress || 0}%`}
                  sx={{ backgroundColor: 'rgba(37,99,235,0.1)', color: '#1d4ed8', fontWeight: 800 }}
                />
              </Stack>

              <Box sx={{ width: '100%', mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={selectedProject.progress || 0}
                  sx={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.05)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #2563eb, #0ea5e9)' } }}
                />
              </Box>

              <Divider sx={{ borderColor: 'rgba(148,163,184,0.2)' }} />

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Client Details
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {selectedProject.client?.name || 'Unknown Client'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Email: {selectedProject.client?.email || 'N/A'}
                </Typography>
              </Box>

              {selectedProject.service && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Service
                  </Typography>
                  <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {selectedProject.service?.title || 'Custom Service'}
                  </Typography>
                  {selectedProject.service?.category && (
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Category: {selectedProject.service.category}
                    </Typography>
                  )}
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Budget
                </Typography>
                <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>
                  ₹{Number(selectedProject.budget || 0).toLocaleString('en-IN')}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Description
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#334155' }}>
                  {selectedProject.description || 'No description provided.'}
                </Typography>
              </Box>

              {selectedProject.notes && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Internal Admin Notes
                  </Typography>
                  <Typography sx={{ whiteSpace: 'pre-wrap', color: '#475569', p: 1.5, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 2, border: '1px solid rgba(0,0,0,0.05)' }}>
                    {selectedProject.notes}
                  </Typography>
                </Box>
              )}

              <Button
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(90deg, #2563eb, #0ea5e9)',
                  textTransform: 'none',
                  borderRadius: 2,
                  boxShadow: '0 8px 20px rgba(37,99,235,0.2)',
                  mt: 2,
                }}
                onClick={() => handleEdit(selectedProject)}
                startIcon={<EditIcon />}
              >
                Edit this project
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
    </Container>
  );
};

export default AdminProjects;
