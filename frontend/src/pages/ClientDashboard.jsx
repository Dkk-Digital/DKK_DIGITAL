import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  Typography,
  Box,
  CircularProgress,
  Button,
  Dialog,
  TextField,
  Chip,
  LinearProgress,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { projectService, serviceService } from '../services';
import { errorAlert, successAlert } from '../utils/alerts';
import {
  Add as AddIcon,
  Search as SearchIcon,
  AssignmentOutlined as AssignmentIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const GlassCard = styled(motion.div)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  boxShadow: '0 8px 32px rgba(15, 23, 42, 0.05)',
  borderRadius: '24px',
  padding: '24px',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 12px 40px rgba(15, 23, 42, 0.1)',
    border: '1px solid rgba(14, 165, 233, 0.3)',
  }
}));

const MetricCard = styled(motion.div)(({ theme, bordercolor }) => ({
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(16px)',
  border: bordercolor ? `1px solid ${bordercolor}` : '1px solid rgba(255, 255, 255, 0.4)',
  borderRadius: '20px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  gap: '4px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
  }
}));

const statusColors = {
  'pending': { bg: 'rgba(100, 116, 139, 0.12)', text: '#475569' },
  'in-progress': { bg: 'rgba(245, 158, 11, 0.12)', text: '#d97706' },
  'completed': { bg: 'rgba(16, 185, 129, 0.12)', text: '#059669' },
  'on-hold': { bg: 'rgba(139, 92, 246, 0.12)', text: '#7c3aed' },
};

const ClientDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showUpdateProjectDialog, setShowUpdateProjectDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    service: '',
    budget: '',
  });

  const [projectToUpdate, setProjectToUpdate] = useState({
    _id: '',
    title: '',
    description: '',
    budget: '',
    notes: '',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [projectsRes, servicesRes] = await Promise.all([
        projectService.getMyProjects(),
        serviceService.getAll(),
      ]);
      setProjects(projectsRes.data.projects || []);
      setServices(servicesRes.data.services || []);
    } catch (error) {
      errorAlert('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.service || !newProject.budget) {
      errorAlert('Please fill out all required fields');
      return;
    }

    try {
      const response = await projectService.create(newProject);
      await successAlert('Project successfully created!');
      setShowNewProjectDialog(false);
      setNewProject({ title: '', description: '', service: '', budget: '' });

      if (response.data && response.data.project) {
        setProjectToUpdate({
          _id: response.data.project._id || '',
          title: response.data.project.title || '',
          description: response.data.project.description || '',
          budget: response.data.project.budget || '',
          notes: response.data.project.notes || '',
        });
        setShowUpdateProjectDialog(true);
      }
      fetchDashboardData();
    } catch (error) {
      errorAlert('Failed to create project');
    }
  };

  const handleOpenUpdateDialog = (e, project) => {
    e.stopPropagation();
    setProjectToUpdate({
      _id: project._id,
      title: project.title || '',
      description: project.description || '',
      budget: project.budget || '',
      notes: project.notes || '',
    });
    setShowUpdateProjectDialog(true);
  };

  const handleUpdateProject = async () => {
    if (!projectToUpdate.title || !projectToUpdate.budget) {
      errorAlert('Title and budget are required');
      return;
    }

    try {
      await projectService.update(projectToUpdate._id, projectToUpdate);
      await successAlert('Project successfully updated');
      setShowUpdateProjectDialog(false);
      fetchDashboardData();
    } catch (error) {
      errorAlert('Failed to update project');
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Layout>
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: { xs: 8, md: 12 }, minHeight: '60vh' }}>
          <CircularProgress thickness={4} size={50} sx={{ color: '#0ea5e9' }} />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(248,250,252,0.6) 0%, rgba(241,245,249,0.8) 100%)',
          minHeight: '85vh',
          py: { xs: 6, md: 10 }
        }}
      >
        <Container maxWidth="lg">
          {/* Top Header */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', md: 'center' },
              gap: 3,
              mb: 6
            }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  background: 'linear-gradient(90deg, #0f172a, #2563eb, #0ea5e9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' },
                  mb: 1
                }}
              >
                Client Workspace
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '1.1rem' }}>
                Track existing projects, create custom projects, or explore your business portfolio.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} sx={{ alignSelf: { xs: 'flex-start', md: 'center' } }}>
              <IconButton onClick={fetchDashboardData} sx={{ backgroundColor: 'white', border: '1px solid #e2e8f0', p: 1.5, borderRadius: '14px', '&:hover': { backgroundColor: '#f1f5f9' } }}>
                <RefreshIcon sx={{ color: '#0f172a' }} />
              </IconButton>
              <Button
                variant="contained"
                onClick={() => setShowNewProjectDialog(true)}
                startIcon={<AddIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                  px: 3.5,
                  py: 1.5,
                  borderRadius: '16px',
                  fontWeight: 700,
                  boxShadow: '0 10px 25px rgba(37,99,235,0.25)',
                  textTransform: 'none',
                  fontSize: '1.05rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8, #0284c7)',
                  }
                }}
              >
                New Project
              </Button>
            </Stack>
          </Box>

          {/* Quick Metrics */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                whileHover={{ scale: 1.02 }}
                bordercolor="rgba(37,99,235,0.15)"
              >
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#2563eb', mb: 0.5 }}>
                  {projects.length}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Active Portfolios
                </Typography>
              </MetricCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                whileHover={{ scale: 1.02 }}
                bordercolor="rgba(245,158,11,0.15)"
              >
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#d97706', mb: 0.5 }}>
                  {projects.filter((p) => p.status === 'in-progress').length}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  In Progress
                </Typography>
              </MetricCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                whileHover={{ scale: 1.02 }}
                bordercolor="rgba(16,185,129,0.15)"
              >
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#059669', mb: 0.5 }}>
                  {projects.filter((p) => p.status === 'completed').length}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Completed
                </Typography>
              </MetricCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                whileHover={{ scale: 1.02 }}
                bordercolor="rgba(139,92,246,0.15)"
              >
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#7c3aed', mb: 0.5 }}>
                  ₹{projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString('en-IN')}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Invested Budget
                </Typography>
              </MetricCard>
            </Grid>
          </Grid>

          {/* Projects Filtering & Search Section */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Find projects by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: '#64748b', mr: 1 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(226,232,240,0.8)',
                    },
                  }}
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

          {/* List of Projects */}
          {filteredProjects.length === 0 ? (
            <GlassCard sx={{ py: 10, textAlign: 'center' }}>
              <Typography sx={{ color: '#64748b', fontSize: '1.2rem', mb: 2 }}>
                No projects matched your filtering criteria.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setShowNewProjectDialog(true)}
                sx={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: '14px',
                  textTransform: 'none',
                }}
              >
                Create Project
              </Button>
            </GlassCard>
          ) : (
            <Grid container spacing={3}>
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <Grid item xs={12} md={6} key={project._id} component={motion.div} layout exit={{ opacity: 0, scale: 0.95 }}>
                    <GlassCard
                      onClick={() => setSelectedProject(project)}
                      whileHover={{ scale: 1.015 }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 52,
                              height: 52,
                              borderRadius: '14px',
                              background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(14,165,233,0.08))',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <AssignmentIcon sx={{ color: '#2563eb' }} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.2rem' }}>
                              {project.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                              {project.service?.title || 'Custom Enterprise Setup'}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          size="small"
                          label={project.status || 'pending'}
                          sx={{
                            backgroundColor: statusColors[project.status]?.bg || 'rgba(100,116,139,0.1)',
                            color: statusColors[project.status]?.text || '#475569',
                            fontWeight: 700,
                            fontSize: '0.725rem',
                            textTransform: 'uppercase',
                          }}
                        />
                      </Box>

                      <Typography sx={{ color: '#334155', mb: 3, minHeight: '44px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {project.description || 'No specialized brief details given.'}
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                            Track Completion
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 800 }}>
                            {project.progress || 0}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={project.progress || 0}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(0,0,0,0.04)',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #2563eb, #0ea5e9)',
                            }
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                          ₹{Number(project.budget || 0).toLocaleString('en-IN')}
                        </Typography>
                        <Button
                          variant="text"
                          onClick={(e) => handleOpenUpdateDialog(e, project)}
                          sx={{ textTransform: 'none', fontWeight: 700, color: '#2563eb' }}
                        >
                          Update Brief &rarr;
                        </Button>
                      </Box>
                    </GlassCard>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}

          {/* Side Drawer for detailed Project View */}
          <Dialog
            open={Boolean(selectedProject)}
            onClose={() => setSelectedProject(null)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '24px',
                p: { xs: 3, md: 5 },
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(25px)',
              }
            }}
          >
            {selectedProject && (
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  onClick={() => setSelectedProject(null)}
                  sx={{ position: 'absolute', top: -16, right: -16 }}
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="overline" sx={{ color: '#2563eb', letterSpacing: '0.12em', fontWeight: 800 }}>
                  Detailed Analysis
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mb: 2 }}>
                  {selectedProject.title}
                </Typography>

                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
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
                    label={`Budget: ₹${Number(selectedProject.budget || 0).toLocaleString('en-IN')}`}
                    sx={{ backgroundColor: 'rgba(37,99,235,0.08)', color: '#1d4ed8', fontWeight: 800 }}
                  />
                  {selectedProject.service && (
                    <Chip
                      label={`Type: ${selectedProject.service.title}`}
                      sx={{ backgroundColor: 'rgba(14,165,233,0.08)', color: '#0369a1', fontWeight: 800 }}
                    />
                  )}
                </Stack>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, mb: 0.5, display: 'block' }}>
                    Deployment Timeline Completion
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={selectedProject.progress || 0}
                    sx={{ height: 10, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.04)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #2563eb, #0ea5e9)' } }}
                  />
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>
                  Project Description & Specifications
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap', color: '#1e293b', lineHeight: 1.8, fontSize: '1.05rem', mb: 4 }}>
                  {selectedProject.description || 'No descriptive context provided.'}
                </Typography>

                {selectedProject.notes && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>
                      Administrative Notes
                    </Typography>
                    <Box
                      sx={{
                        p: 2.5,
                        background: 'rgba(15,23,42,0.03)',
                        borderRadius: '16px',
                        borderLeft: '4px solid #2563eb'
                      }}
                    >
                      <Typography sx={{ whiteSpace: 'pre-wrap', color: '#334155', fontStyle: 'italic' }}>
                        {selectedProject.notes}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={(e) => { setSelectedProject(null); handleOpenUpdateDialog(e, selectedProject); }}
                    sx={{
                      background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                      px: 4,
                      py: 1.5,
                      borderRadius: '16px',
                      fontWeight: 700,
                      textTransform: 'none',
                    }}
                  >
                    Edit Specifics
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedProject(null)}
                    sx={{ textTransform: 'none', px: 4, py: 1.5, borderRadius: '16px', fontWeight: 700 }}
                  >
                    Dismiss
                  </Button>
                </Stack>
              </Box>
            )}
          </Dialog>

          {/* New Project Dialog */}
          <Dialog
            open={showNewProjectDialog}
            onClose={() => setShowNewProjectDialog(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '24px',
                p: { xs: 3, md: 4 },
                backgroundColor: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.4)',
              }
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: '#0f172a' }}>
                Establish New Portfolio
              </Typography>
              <Typography sx={{ color: '#64748b', mb: 4, fontSize: '0.95rem' }}>
                Complete the details below to assign your specialized work to our experts.
              </Typography>

              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Project Title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', backgroundColor: '#fff' } }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  multiline
                  rows={4}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', backgroundColor: '#fff' } }}
                />

                <TextField
                  fullWidth
                  label="Select Specialized Service"
                  select
                  value={newProject.service}
                  onChange={(e) => setNewProject({ ...newProject, service: e.target.value })}
                  SelectProps={{ native: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', backgroundColor: '#fff' } }}
                >
                  <option value="">Choose a portfolio service...</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.title} (₹{Number(service.price || 0).toLocaleString('en-IN')})
                    </option>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Available Budget (₹)"
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', backgroundColor: '#fff' } }}
                />

                <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleCreateProject}
                    sx={{
                      background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                      px: 3.5,
                      py: 1.5,
                      borderRadius: '16px',
                      fontWeight: 700,
                      textTransform: 'none',
                      flex: 2,
                      fontSize: '1rem',
                      boxShadow: '0 8px 25px rgba(37,99,235,0.2)',
                    }}
                  >
                    Confirm Portfolio
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowNewProjectDialog(false)}
                    sx={{ textTransform: 'none', py: 1.5, px: 3, fontWeight: 700, borderRadius: '16px', flex: 1 }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Dialog>

          {/* Update Project Dialog */}
          <Dialog
            open={showUpdateProjectDialog}
            onClose={() => setShowUpdateProjectDialog(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '24px',
                p: { xs: 3, md: 4 },
                backgroundColor: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.4)',
              }
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: '#0f172a' }}>
                Refine Your Project Brief
              </Typography>
              <Typography sx={{ color: '#64748b', mb: 4, fontSize: '0.95rem' }}>
                Adjust title, specifics, budget, and add any collaborative feedback for the team.
              </Typography>

              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Project Title"
                  value={projectToUpdate.title}
                  onChange={(e) => setProjectToUpdate({ ...projectToUpdate, title: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', backgroundColor: '#fff' } }}
                />

                <TextField
                  fullWidth
                  label="Brief Description"
                  value={projectToUpdate.description}
                  onChange={(e) => setProjectToUpdate({ ...projectToUpdate, description: e.target.value })}
                  multiline
                  rows={4}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', backgroundColor: '#fff' } }}
                />

                <TextField
                  fullWidth
                  label="Total Allocated Budget (₹)"
                  type="number"
                  value={projectToUpdate.budget}
                  onChange={(e) => setProjectToUpdate({ ...projectToUpdate, budget: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', backgroundColor: '#fff' } }}
                />

                <TextField
                  fullWidth
                  label="Project Notes / Special Feedback"
                  value={projectToUpdate.notes}
                  placeholder="Share extra updates or feedback directly with the team..."
                  multiline
                  rows={2}
                  onChange={(e) => setProjectToUpdate({ ...projectToUpdate, notes: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '14px', backgroundColor: '#fff' } }}
                />

                <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleUpdateProject}
                    sx={{
                      background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
                      px: 3.5,
                      py: 1.5,
                      borderRadius: '16px',
                      fontWeight: 700,
                      textTransform: 'none',
                      flex: 2,
                      fontSize: '1rem',
                      boxShadow: '0 8px 25px rgba(37,99,235,0.2)',
                    }}
                  >
                    Apply Modifications
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowUpdateProjectDialog(false)}
                    sx={{ textTransform: 'none', py: 1.5, px: 3, fontWeight: 700, borderRadius: '16px', flex: 1 }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Dialog>
        </Container>
      </Box>
    </Layout>
  );
};

export default ClientDashboard;
