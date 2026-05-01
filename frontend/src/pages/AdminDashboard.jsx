import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import EmailIcon from '@mui/icons-material/Email';
import Layout from '../components/Layout';
import {
  inquiryService,
  serviceService,
  projectService,
  authService,
  messageService,
} from '../services';
import {
  InquiryStatusChart,
  ServiceCategoryChart,
  QuickStatCard,
} from '../components/admin/DashboardCharts';
import { confirmAlert, errorAlert, successAlert } from '../utils/alerts';

const AdminDashboard = () => {
  const [allStats, setAllStats] = useState({
    inquiries: null,
    services: null,
    projects: null,
    users: null,
    messages: null,
  });
  const [inquiries, setInquiries] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    shortDescription: '',
    price: '',
    category: 'SEO',
    features: '',
  });
  const [serviceImage, setServiceImage] = useState(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);

  useEffect(() => {
    fetchAllDashboardData();
    fetchServices();
  }, []);

  const fetchAllDashboardData = async () => {
    try {
      setLoading(true);
      const [inquiryStatsRes, inquiriesRes, serviceStatsRes, projectStatsRes, userStatsRes, messageStatsRes] =
        await Promise.all([
          inquiryService.getStats(),
          inquiryService.getAll({ status: 'new' }),
          serviceService.getStats(),
          projectService.getStats(),
          authService.getStats(),
          messageService.getStats(),
        ]);

      setAllStats({
        inquiries: inquiryStatsRes.data.stats,
        services: serviceStatsRes.data.stats,
        projects: projectStatsRes.data.stats,
        users: userStatsRes.data.stats,
        messages: messageStatsRes.data.stats,
      });
      setInquiries(inquiriesRes.data.inquiries);
    } catch (error) {
      errorAlert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await serviceService.getAll();
      setServicesList(res.data.services || []);
    } catch (err) {
      // ignore
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newService.title);
      formData.append('description', newService.description);
      formData.append('shortDescription', newService.shortDescription);
      formData.append('price', newService.price);
      formData.append('category', newService.category);
      formData.append('features', newService.features);

      if (serviceImage) formData.append('image', serviceImage);

      if (editingServiceId) {
        await serviceService.update(editingServiceId, formData);
        successAlert('Success', 'Service updated successfully');
      } else {
        await serviceService.create(formData);
        successAlert('Success', 'Service added successfully');
      }
      setNewService({
        title: '',
        description: '',
        shortDescription: '',
        price: '',
        category: 'SEO',
        features: '',
      });
      setServiceImage(null);
      setShowServiceForm(false);
      setEditingServiceId(null);
      fetchServices();
      fetchAllDashboardData();
    } catch (error) {
      errorAlert('Error', 'Failed to save service');
    }
  };

  const handleEdit = (service) => {
    setEditingServiceId(service._id);
    setNewService({
      title: service.title || '',
      description: service.description || '',
      shortDescription: service.shortDescription || '',
      price: service.price || '',
      category: service.category || 'SEO',
      features: (service.features || []).join(', '),
    });
    setServiceImage(null);
    setShowServiceForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAlert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      () => {}
    );
    if (!confirmed) return;
    try {
      await serviceService.delete(id);
      successAlert('Success', 'Service deleted successfully');
      fetchServices();
      fetchAllDashboardData();
    } catch (err) {
      errorAlert('Error', 'Failed to delete service');
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
      <Container maxWidth="xl" sx={{ py: { xs: 7, md: 12 } }}>
        {/* Header */}
        <Box className="fade-in-down" sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' },
              background: 'linear-gradient(90deg, #1976d2, #0ea5e9)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mt: 1 }}>
            Manage your business metrics and operations
          </Typography>
        </Box>

        {/* Quick Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <QuickStatCard
              icon={AssignmentIcon}
              title="Total Inquiries"
              value={allStats.inquiries?.total || 0}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickStatCard
              icon={AddBusinessIcon}
              title="Services"
              value={allStats.services?.total || 0}
              color="#ff9800"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickStatCard
              icon={AssignmentIcon}
              title="Active Projects"
              value={allStats.projects?.total || 0}
              color="#2196f3"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickStatCard
              icon={PeopleIcon}
              title="Total Users"
              value={allStats.users?.total || 0}
              color="#4caf50"
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <InquiryStatusChart data={allStats.inquiries} />
          <ServiceCategoryChart data={allStats.services?.categories || []} />
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, rgba(25,118,210,0.04), rgba(124,77,255,0.04))',
                border: '1px solid rgba(25,118,210,0.1)',
                borderRadius: '16px',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Team Overview
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  <strong>Admins:</strong> {allStats.users?.admins || 0}
                </Typography>
                <Typography variant="body2">
                  <strong>Clients:</strong> {allStats.users?.clients || 0}
                </Typography>
                <Typography variant="body2">
                  <strong>Messages:</strong> {allStats.messages?.total || 0}
                </Typography>
                <Typography variant="body2">
                  <strong>Unread:</strong>{' '}
                  <span style={{ color: '#ff5722' }}>
                    {allStats.messages?.unread || 0}
                  </span>
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Inquiries */}
        {inquiries.length > 0 && (
          <Card sx={{ p: { xs: 2, md: 3 }, mb: 6 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Recent New Inquiries
            </Typography>
            <Box
              sx={{
                maxHeight: 300,
                overflowY: 'auto',
              }}
            >
              {inquiries.slice(0, 5).map((inquiry, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    borderBottom:
                      idx !== inquiries.length - 1
                        ? '1px solid rgba(0,0,0,0.1)'
                        : 'none',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {inquiry.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {inquiry.email}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          color: '#333',
                          fontSize: '0.85rem',
                        }}
                      >
                        {inquiry.subject}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        )}

        {/* Services Management */}
        <Card sx={{ p: { xs: 2, md: 3 }, mb: 6 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            {showServiceForm ? 'Add/Edit Service' : 'Services Management'}
          </Typography>

          {!showServiceForm ? (
            <Button
              variant="contained"
              sx={{ backgroundColor: '#1976d2' }}
              onClick={() => setShowServiceForm(true)}
            >
              + Add New Service
            </Button>
          ) : (
            <Box component="form" onSubmit={handleAddService}>
              <TextField
                fullWidth
                label="Service Title"
                value={newService.title}
                onChange={(e) =>
                  setNewService({ ...newService, title: e.target.value })
                }
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Short Description"
                value={newService.shortDescription}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    shortDescription: e.target.value,
                  })
                }
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                value={newService.description}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    description: e.target.value,
                  })
                }
                multiline
                rows={3}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={newService.price}
                onChange={(e) =>
                  setNewService({ ...newService, price: e.target.value })
                }
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Category"
                select
                value={newService.category}
                onChange={(e) =>
                  setNewService({ ...newService, category: e.target.value })
                }
                sx={{ mb: 2 }}
              >
                <MenuItem value="SEO">SEO</MenuItem>
                <MenuItem value="Social Media Marketing">Social Media Marketing</MenuItem>
                <MenuItem value="PPC">PPC</MenuItem>
                <MenuItem value="Content Marketing">Content Marketing</MenuItem>
                <MenuItem value="Email Marketing">Email Marketing</MenuItem>
                <MenuItem value="Web Design">Web Design</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Features (comma-separated)"
                value={newService.features}
                onChange={(e) =>
                  setNewService({ ...newService, features: e.target.value })
                }
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                <Button variant="outlined" component="label">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      setServiceImage(e.target.files?.[0] || null)
                    }
                  />
                </Button>
                {serviceImage && (
                  <Typography variant="body2">
                    {serviceImage.name}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button type="submit" variant="contained" sx={{ backgroundColor: '#1976d2' }}>
                  {editingServiceId ? 'Update Service' : 'Add Service'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowServiceForm(false);
                    setEditingServiceId(null);
                    setNewService({
                      title: '',
                      description: '',
                      shortDescription: '',
                      price: '',
                      category: 'SEO',
                      features: '',
                    });
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}

          {/* Services List */}
          {!showServiceForm && servicesList.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Your Services ({servicesList.length})
              </Typography>
              <Grid container spacing={2}>
                {servicesList.map((service) => (
                  <Grid item xs={12} sm={6} md={4} key={service._id}>
                    <Card
                      sx={{
                        p: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                    >
                      {service.image && (
                        <Box
                          component="img"
                          src={service.image.url}
                          alt={service.title}
                          sx={{
                            width: '100%',
                            height: 150,
                            objectFit: 'cover',
                            borderRadius: '8px',
                            mb: 2,
                          }}
                        />
                      )}
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#666', mb: 2, flex: 1 }}
                      >
                        {service.shortDescription}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: '#1976d2',
                          mb: 2,
                        }}
                      >
                        ${service.price}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleEdit(service)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(service._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Card>
      </Container>
    </Layout>
  );
};

export default AdminDashboard;
