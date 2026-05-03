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
  LinearProgress,
  Tooltip,
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
  Refresh as RefreshIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { projectService } from '../../services';
import useAdminPanelData from './useAdminPanelData';

const GlassCard = styled(motion.div)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.75)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.45)',
  boxShadow: '0 8px 32px rgba(15, 23, 42, 0.05)',
  borderRadius: '24px',
  padding: '24px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)',
  }
}));

const MetricBox = styled(motion.div)(({ theme, bordercolor }) => ({
  background: 'rgba(255, 255, 255, 0.75)',
  backdropFilter: 'blur(16px)',
  border: bordercolor ? `1px solid ${bordercolor}` : '1px solid rgba(255, 255, 255, 0.45)',
  borderRadius: '20px',
  padding: '18px 22px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  gap: '4px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
  }
}));

const statusColors = {
  'pending': { bg: 'rgba(100, 116, 139, 0.12)', text: '#475569' },
  'in-progress': { bg: 'rgba(245, 158, 11, 0.12)', text: '#d97706' },
  'completed': { bg: 'rgba(16, 185, 129, 0.12)', text: '#059669' },
  'on-hold': { bg: 'rgba(139, 92, 246, 0.12)', text: '#7c3aed' },
};

const AdminProjects = () => {
  const { projects, services, loading, refresh } = useAdminPanelData();
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

  const handleEdit = (e, project) => {
    e?.stopPropagation();
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

  const handleView = (e, project) => {
    e?.stopPropagation();
    setSelectedProject(project);
    setEditingProject(null);
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    if (!editingProject) return;

    try {
      setSaving(true);
      await projectService.update(editingProject._id, form);
      successAlert('Project details updated successfully');
      setEditingProject(null);
      await refresh();
    } catch (error) {
      errorAlert(error.response?.data?.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  const quickChangeProgress = (amount) => {
    let nextVal = Math.min(100, Math.max(0, (form.progress || 0) + amount));
    setForm({ ...form, progress: nextVal });
  };

  const quickChangeStatus = (status) => {
    setForm({ ...form, status });
  };

  const handleDelete = async (e, id) => {
    e?.stopPropagation();
    const confirmed = await confirmAlert(
      'Are you sure you want to delete this project?',
      'This will erase the record and history of the project permanently.'
    );
    if (!confirmed) return;

    try {
      await projectService.delete(id);
      successAlert('Project successfully removed');
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
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: { xs: 8, md: 12 }, minHeight: '60vh' }}>
        <CircularProgress thickness={4} size={50} sx={{ color: '#0ea5e9' }} />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 4, md: 6 },
        background: 'rgba(248,250,252,0.5)',
        minHeight: '85vh',
        borderRadius: '32px'
      }}
    >
      {/* Top Header Controls */}
      <Box sx={{ mb: 5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 3 }}>
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(90deg, #0f172a, #334155)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' },
              mb: 0.5
            }}
          >
            Project Management
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '1.1rem' }}>
            Control projects, track completion stages, and append admin briefs.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}>
          <IconButton onClick={refresh} sx={{ backgroundColor: 'white', border: '1px solid #e2e8f0', p: 1.5, borderRadius: '14px', '&:hover': { backgroundColor: '#f1f5f9' } }}>
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Metric Visuals */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricBox whileHover={{ scale: 1.02 }} bordercolor="rgba(37,99,235,0.12)">
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#2563eb', mb: 0.5 }}>
              {projects.length}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
              Total Portfolios
            </Typography>
          </MetricBox>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricBox whileHover={{ scale: 1.02 }} bordercolor="rgba(245,158,11,0.12)">
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#d97706', mb: 0.5 }}>
              {projects.filter((p) => p.status === 'in-progress').length}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
              Ongoing Work
            </Typography>
          </MetricBox>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricBox whileHover={{ scale: 1.02 }} bordercolor="rgba(16,185,129,0.12)">
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#059669', mb: 0.5 }}>
              {projects.filter((p) => p.status === 'completed').length}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
              Successfully Completed
            </Typography>
          </MetricBox>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricBox whileHover={{ scale: 1.02 }} bordercolor="rgba(139,92,246,0.12)">
            <Typography variant="h3" sx={{ fontWeight: 900, color: '#7c3aed', mb: 0.5 }}>
              ₹{projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString('en-IN')}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
              Total Worth
            </Typography>
          </MetricBox>
        </Grid>
      </Grid>

      {/* Advanced Filter Bar */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Find projects by title, client, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.7)' } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {['all', 'pending', 'in-progress', 'completed', 'on-hold'].map((type) => (
                <Chip
                  key={type}
                  label={type.toUpperCase()}
                  onClick={() => setStatusFilter(type)}
                  sx={{
                    backgroundColor: statusFilter === type ? '#0f172a' : 'rgba(255,255,255,0.8)',
                    color: statusFilter === type ? '#ffffff' : '#475569',
                    fontWeight: 700,
                    px: 1,
                    py: 2,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                    border: '1px solid rgba(226,232,240,0.8)',
                    '&:hover': {
                      backgroundColor: statusFilter === type ? '#1e293b' : '#f8fafc',
                    },
                  }}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Detailed Project Information & Table List */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={editingProject ? 6 : 12}>
          <GlassCard>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 3, color: '#0f172a' }}>
              Project Records ({filteredProjects.length})
            </Typography>

            {filteredProjects.length === 0 ? (
              <Box sx={{ py: 10, textAlign: 'center' }}>
                <Typography sx={{ color: '#64748b', fontSize: '1.2rem' }}>
                  No projects found matching the filters.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                <AnimatePresence>
                  {filteredProjects.map((project) => (
                    <Box
                      key={project._id}
                      component={motion.div}
                      layout
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={(e) => handleView(e, project)}
                      sx={{
                        p: 3,
                        background: 'rgba(255,255,255,0.4)',
                        border: '1px solid rgba(226,232,240,0.6)',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(241,245,249,0.7)',
                          borderColor: 'rgba(37,99,235,0.25)',
                        },
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'stretch', md: 'center' },
                        gap: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(14,165,233,0.08))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <AssignmentIcon sx={{ color: '#2563eb' }} />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem', mb: 0.25 }}>
                            {project.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#475569', mb: 1 }}>
                            Client: <strong>{project.client?.name || 'User Client'}</strong> ({project.client?.email || 'No email'})
                          </Typography>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Chip
                              size="small"
                              label={project.status || 'pending'}
                              sx={{
                                backgroundColor: statusColors[project.status]?.bg || 'rgba(100,116,139,0.1)',
                                color: statusColors[project.status]?.text || '#475569',
                                fontWeight: 800,
                                fontSize: '0.725rem',
                                textTransform: 'uppercase',
                              }}
                            />
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                              Progress: {project.progress || 0}%
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>

                      <Stack direction="row" spacing={1.5} sx={{ alignSelf: { xs: 'flex-end', md: 'center' } }}>
                        <Tooltip title="Detailed Project Summary">
                          <IconButton
                            onClick={(e) => handleView(e, project)}
                            sx={{ color: '#1d4ed8', border: '1px solid #e2e8f0', backgroundColor: '#fff', p: 1.25, borderRadius: '12px' }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Update Status / Notes">
                          <IconButton
                            onClick={(e) => handleEdit(e, project)}
                            sx={{ color: '#0284c7', border: '1px solid #e2e8f0', backgroundColor: '#fff', p: 1.25, borderRadius: '12px' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove Permanent Record">
                          <IconButton
                            onClick={(e) => handleDelete(e, project._id)}
                            sx={{ color: '#dc2626', border: '1px solid #e2e8f0', backgroundColor: '#fff', p: 1.25, borderRadius: '12px' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Box>
                  ))}
                </AnimatePresence>
              </Stack>
            )}
          </GlassCard>
        </Grid>

        {editingProject && (
          <Grid item xs={12} lg={6} component={motion.div} layout>
            <GlassCard>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: '#0f172a' }}>
                Refining Project Matrix
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
                Adjust visual progress, change client-facing notes, or internal updates below.
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Portfolio Subject Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    fullWidth
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', backgroundColor: '#fff' } }}
                  />

                  <TextField
                    label="Description of Project"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', backgroundColor: '#fff' } }}
                  />

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label="Deployment State"
                      select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      SelectProps={{ native: true }}
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', backgroundColor: '#fff' } }}
                    >
                      {['pending', 'in-progress', 'completed', 'on-hold'].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt.toUpperCase()}
                        </option>
                      ))}
                    </TextField>

                    <TextField
                      label="Deployment Percentage (%)"
                      type="number"
                      value={form.progress}
                      onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                      fullWidth
                      inputProps={{ min: 0, max: 100 }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', backgroundColor: '#fff' } }}
                    />
                  </Stack>

                  {/* Interactive Quick Add Actions */}
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, mb: 1, display: 'block' }}>
                      Interactive Matrix Enhancements
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Button variant="outlined" size="small" onClick={() => quickChangeProgress(10)} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>
                        +10%
                      </Button>
                      <Button variant="outlined" size="small" onClick={() => quickChangeProgress(25)} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>
                        +25%
                      </Button>
                      <Button variant="outlined" size="small" onClick={() => quickChangeStatus('in-progress')} sx={{ borderRadius: '10px', textTransform: 'none', color: '#d97706', borderColor: '#f59e0b', fontWeight: 700 }}>
                        In Progress
                      </Button>
                      <Button variant="outlined" size="small" onClick={() => quickChangeStatus('completed')} sx={{ borderRadius: '10px', textTransform: 'none', color: '#059669', borderColor: '#10b981', fontWeight: 700 }}>
                        Complete
                      </Button>
                    </Stack>
                  </Box>

                  <TextField
                    label="Client Facing & Internal Briefings"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Enter context, deadlines or task comments..."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', backgroundColor: '#fff' } }}
                  />

                  <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={saving}
                      sx={{
                        background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                        textTransform: 'none',
                        py: 1.5,
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        borderRadius: '16px',
                        flex: 2,
                        boxShadow: '0 8px 25px rgba(37,99,235,0.2)',
                      }}
                    >
                      {saving ? 'Processing changes...' : 'Save Matrix'}
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => setEditingProject(null)}
                      sx={{ textTransform: 'none', py: 1.5, px: 3, fontWeight: 700, borderRadius: '16px', flex: 1 }}
                    >
                      Dismiss
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </GlassCard>
          </Grid>
        )}
      </Grid>

      {/* Comprehensive Summary Overlay Drawer */}
      <Drawer anchor="right" open={Boolean(selectedProject)} onClose={() => setSelectedProject(null)}>
        <Box sx={{ width: { xs: 330, sm: 460 }, p: { xs: 3, sm: 5 }, position: 'relative', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', height: '100%', borderLeft: '1px solid #e2e8f0' }}>
          <IconButton onClick={() => setSelectedProject(null)} sx={{ position: 'absolute', top: 16, right: 16 }}>
            <CloseIcon />
          </IconButton>

          {selectedProject && (
            <Stack spacing={4} sx={{ pr: 1, mt: 1 }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#2563eb', letterSpacing: '0.12em', fontWeight: 800 }}>
                  Strategic Project Outline
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.15, mt: 0.5, color: '#0f172a' }}>
                  {selectedProject.title}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={selectedProject.status || 'pending'}
                  sx={{
                    backgroundColor: statusColors[selectedProject.status]?.bg || 'rgba(100,116,139,0.1)',
                    color: statusColors[selectedProject.status]?.text || '#475569',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}
                />
                <Chip
                  label={`Deployment: ${selectedProject.progress || 0}%`}
                  sx={{ backgroundColor: 'rgba(37,99,235,0.08)', color: '#1d4ed8', fontWeight: 800 }}
                />
              </Stack>

              <Box sx={{ width: '100%' }}>
                <LinearProgress
                  variant="determinate"
                  value={selectedProject.progress || 0}
                  sx={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.04)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #2563eb, #0ea5e9)' } }}
                />
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>
                  Client Credentials
                </Typography>
                <Typography sx={{ fontWeight: 800, color: '#1e293b' }}>
                  {selectedProject.client?.name || 'Direct Business Client'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  Email ID: {selectedProject.client?.email || 'N/A'}
                </Typography>
              </Box>

              {selectedProject.service && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>
                    Assigned Strategy Service
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {selectedProject.service?.title || 'Bespoke Integration'}
                  </Typography>
                  {selectedProject.service?.category && (
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>
                      Operational Domain: {selectedProject.service.category}
                    </Typography>
                  )}
                </Box>
              )}

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>
                  Budgeting Framework
                </Typography>
                <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: '1.2rem' }}>
                  ₹{Number(selectedProject.budget || 0).toLocaleString('en-IN')}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>
                  Operational Detail
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#334155' }}>
                  {selectedProject.description || 'No specialized operations given.'}
                </Typography>
              </Box>

              {selectedProject.notes && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>
                    Official Internal Analysis
                  </Typography>
                  <Typography sx={{ whiteSpace: 'pre-wrap', color: '#334155', p: 2, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: '16px', borderLeft: '4px solid #2563eb' }}>
                    {selectedProject.notes}
                  </Typography>
                </Box>
              )}

              <Button
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                  textTransform: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 8px 25px rgba(37,99,235,0.2)',
                  fontWeight: 700,
                  mt: 2,
                }}
                onClick={(e) => handleEdit(e, selectedProject)}
                startIcon={<EditIcon />}
              >
                Modify details
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
    </Container>
  );
};

export default AdminProjects;
