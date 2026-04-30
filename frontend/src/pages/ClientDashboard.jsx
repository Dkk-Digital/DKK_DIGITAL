import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Typography, Box, CircularProgress, Button, Dialog, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';
import { projectService, serviceService } from '../services';
import toast from 'react-hot-toast';

const ProjectCard = styled(Card)(({ theme }) => ({
  padding: '25px',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  border: '1px solid rgba(25,118,210,0.08)',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,252,255,0.8) 100%)',
  '&:hover': {
    boxShadow: '0 20px 40px rgba(25,118,210,0.15)',
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
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    service: '',
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
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.service || !newProject.budget) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await projectService.create(newProject);
      toast.success('Project created successfully');
      setShowNewProjectDialog(false);
      setNewProject({ title: '', description: '', service: '', budget: '' });
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }} className="fade-in-down">
          <Typography variant="h3" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            My Dashboard
          </Typography>
          <Button
            variant="contained"
            sx={{ background: 'linear-gradient(90deg, #1976d2, #7c4dff)', px: 3 }}
            onClick={() => setShowNewProjectDialog(true)}
          >
            + New Project
          </Button>
        </Box>

        {/* Project Stats */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#f0f4ff' }}>
              <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700 }}>
                {projects.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Total Projects
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#fff3e0' }}>
              <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 700 }}>
                {projects.filter((p) => p.status === 'in-progress').length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                In Progress
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f5e9' }}>
              <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 700 }}>
                {projects.filter((p) => p.status === 'completed').length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Completed
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#f3e5f5' }}>
              <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 700 }}>
                ₹{projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
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
            <Typography sx={{ color: '#666', mb: 2 }}>
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
                <ProjectCard>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {project.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        {project.service?.title}
                      </Typography>
                    </Box>
                    <StatusBadge status={project.status}>{project.status}</StatusBadge>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        Progress
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        {project.progress}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        height: '8px',
                        backgroundColor: '#f0f0f0',
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

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#999' }}>
                    <span>Budget: ₹{project.budget?.toLocaleString()}</span>
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </Box>
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
                  {service.title} (₹{service.price})
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

            <Box sx={{ display: 'flex', gap: 2 }}>
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
      </Container>
    </Layout>
  );
};

export default ClientDashboard;
