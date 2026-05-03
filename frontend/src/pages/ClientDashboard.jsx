import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Typography, Box, CircularProgress, Button, Dialog, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';
import { projectService, serviceService } from '../services';
import { errorAlert, successAlert } from '../utils/alerts';

const ProjectCard = styled(Card)(({ theme }) => ({
  padding: '25px',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  border: '1px solid rgba(25,118,210,0.08)',
  borderRadius: '16px',
  background: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,252,255,0.8) 100%)',
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
  },
  '&:hover': {
    boxShadow: theme.palette.mode === 'dark' ? '0 20px 40px rgba(0,0,0,0.45)' : '0 20px 40px rgba(25,118,210,0.15)',
    transform: 'translateY(-8px)',
  },
}));

const StatusBadge = styled(Box)(({ status }) => {
  let bgColor = '#f0f4ff';
  let textColor = '#1976d2';

  if (status === 'completed') {
    bgColor = '#e8f5e9';
    textColor = '#4caf50';
  } else if (status === 'in-progress') {
    bgColor = '#fff3e0';
    textColor = '#ff9800';
  } else if (status === 'on-hold') {
    bgColor = '#f3e5f5';
    textColor = '#9c27b0';
  }

  return {
    backgroundColor: bgColor,
    color: textColor,
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: 600,
  };
});

const ClientDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showUpdateProjectDialog, setShowUpdateProjectDialog] = useState(false);
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
      setProjects(projectsRes.data.projects);
      setServices(servicesRes.data.services);
    } catch (error) {
      errorAlert('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.service || !newProject.budget) {
      errorAlert('Please fill all required fields');
      return;
    }

    try {
      const response = await projectService.create(newProject);
      await successAlert('Project created successfully! Loading page for update.');
      setShowNewProjectDialog(false);
      setNewProject({ title: '', description: '', service: '', budget: '' });

      // Load update dialog directly for new project
      if (response.data && response.data.project) {
        setProjectToUpdate(response.data.project);
        setShowUpdateProjectDialog(true);
      }
      fetchDashboardData();
    } catch (error) {
      errorAlert('Failed to create project');
    }
  };

  const handleOpenUpdateDialog = (project) => {
    setProjectToUpdate({
      _id: project._id,
      title: project.title,
      description: project.description || '',
      budget: project.budget || '',
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
      await successAlert('Project updated successfully');
      setShowUpdateProjectDialog(false);
      fetchDashboardData();
    } catch (error) {
      errorAlert('Failed to update project');
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container sx={{ display: 'flex', justifyContent: 'center', py: { xs: 6, md: 8 } }}>
          <CircularProgress />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 12 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 6, flexDirection: { xs: 'column', md: 'row' }, gap: 2 }} className="fade-in-down">
          <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' }, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            My Dashboard
          </Typography>
          <Button
            variant="contained"
            sx={{ background: 'linear-gradient(90deg, #1976d2, #7c4dff)', px: 3, width: { xs: '100%', md: 'auto' } }}
            onClick={() => setShowNewProjectDialog(true)}
          >
            + New Project
          </Button>
        </Box>

        {/* Project Stats */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', backgroundColor: 'background.paper' }}>
              <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700 }}>
                {projects.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Projects
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', backgroundColor: 'background.paper' }}>
              <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 700 }}>
                {projects.filter((p) => p.status === 'in-progress').length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                In Progress
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', backgroundColor: 'background.paper' }}>
              <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 700 }}>
                {projects.filter((p) => p.status === 'completed').length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Completed
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', backgroundColor: 'background.paper' }}>
              <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 700 }}>
                ₹{projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString('en-IN')}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Budget
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Projects List */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Your Projects
        </Typography>
        {projects.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary', mb: 2 }}>
              No projects yet. Create your first project to get started!
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#1976d2' }}
              onClick={() => setShowNewProjectDialog(true)}
            >
              Create Project
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} md={6} key={project._id}>
                <ProjectCard onClick={() => handleOpenUpdateDialog(project)}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {project.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {project.service?.title}
                      </Typography>
                    </Box>
                    <StatusBadge status={project.status}>{project.status}</StatusBadge>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Progress
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {project.progress}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: '8px',
                        backgroundColor: 'background.default',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          backgroundColor: '#1976d2',
                          width: `${project.progress}%`,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'text.secondary', mt: 1 }}>
                    <span>Budget: ₹{project.budget?.toLocaleString('en-IN')}</span>
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </Box>

                  <Button variant="text" size="small" onClick={(e) => { e.stopPropagation(); handleOpenUpdateDialog(project); }} sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}>
                    Edit & Update &rarr;
                  </Button>
                </ProjectCard>
              </Grid>
            ))}
          </Grid>
        )}

        {/* New Project Dialog */}
        <Dialog open={showNewProjectDialog} onClose={() => setShowNewProjectDialog(false)} maxWidth="sm" fullWidth>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Create New Project
            </Typography>

            <TextField
              fullWidth
              label="Project Title"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Service"
              select
              value={newProject.service}
              onChange={(e) => setNewProject({ ...newProject, service: e.target.value })}
              sx={{ mb: 2 }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.title} (₹{Number(service.price).toLocaleString('en-IN')})
                </option>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Budget"
              type="number"
              value={newProject.budget}
              onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#1976d2' }}
                onClick={handleCreateProject}
                fullWidth
              >
                Create
              </Button>
              <Button variant="outlined" onClick={() => setShowNewProjectDialog(false)} fullWidth>
                Cancel
              </Button>
            </Box>
          </Box>
        </Dialog>

        {/* Update Project Dialog */}
        <Dialog open={showUpdateProjectDialog} onClose={() => setShowUpdateProjectDialog(false)} maxWidth="sm" fullWidth>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Edit & Update Project Details
            </Typography>

            <TextField
              fullWidth
              label="Project Title"
              value={projectToUpdate.title}
              onChange={(e) => setProjectToUpdate({ ...projectToUpdate, title: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Description"
              value={projectToUpdate.description}
              onChange={(e) => setProjectToUpdate({ ...projectToUpdate, description: e.target.value })}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Budget"
              type="number"
              value={projectToUpdate.budget}
              onChange={(e) => setProjectToUpdate({ ...projectToUpdate, budget: e.target.value })}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#1976d2' }}
                onClick={handleUpdateProject}
                fullWidth
              >
                Update
              </Button>
              <Button variant="outlined" onClick={() => setShowUpdateProjectDialog(false)} fullWidth>
                Cancel
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default ClientDashboard;
