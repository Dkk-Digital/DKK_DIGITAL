import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Typography, Box, Button, TextField, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';
import { inquiryService, serviceService } from '../services';
import toast from 'react-hot-toast';

const StatsCard = styled(Card)(({ theme }) => ({
  padding: '30px',
  textAlign: 'center',
  background: 'linear-gradient(135deg, rgba(25,118,210,0.08), rgba(124,77,255,0.06))',
  border: '1px solid rgba(25,118,210,0.1)',
  borderRadius: '16px',
  transition: 'all 0.4s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 30px rgba(25,118,210,0.15)',
  },
}));

const AdminDashboard = () => {
  const [inquiryStats, setInquiryStats] = useState(null);
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
    fetchDashboardData();
    fetchServices();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, inquiriesRes] = await Promise.all([
        inquiryService.getStats(),
        inquiryService.getAll({ status: 'new' }),
      ]);
      setInquiryStats(statsRes.data.stats);
      setInquiries(inquiriesRes.data.inquiries);
    } catch (error) {
      toast.error('Failed to load dashboard data');
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
        toast.success('Service updated successfully');
      } else {
        await serviceService.create(formData);
        toast.success('Service added successfully');
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
    } catch (error) {
      toast.error('Failed to add service');
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
    if (!confirm('Delete this service?')) return;
    try {
      await serviceService.delete(id);
      toast.success('Service deleted');
      fetchServices();
    } catch (err) {
      toast.error('Failed to delete service');
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
        <Box className="fade-in-down" sx={{ mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Admin Dashboard
          </Typography>
        </Box>

        {/* Stats */}
        {inquiryStats && (
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard className="fade-in-up stagger-1">
                <Typography variant="h6" sx={{ background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontWeight: 700 }}>
                  {inquiryStats.total}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Total Inquiries
                </Typography>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 700 }}>
                  {inquiryStats.new}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  New Inquiries
                </Typography>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <Typography variant="h6" sx={{ color: '#2196f3', fontWeight: 700 }}>
                  {inquiryStats.contacted}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Contacted
                </Typography>
              </StatsCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard>
                <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 700 }}>
                  {inquiryStats.converted}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Converted
                </Typography>
              </StatsCard>
            </Grid>
          </Grid>
        )}

        {/* Add Service Section */}
        <Card sx={{ p: 3, mb: 6 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            {showServiceForm ? 'Add New Service' : 'Services Management'}
          </Typography>

          {!showServiceForm ? (
            <Button variant="contained" sx={{ backgroundColor: '#1976d2' }} onClick={() => setShowServiceForm(true)}>
              + Add Service
            </Button>
          ) : (
            <Box component="form" onSubmit={handleAddService}>
              <TextField
                fullWidth
                label="Service Title"
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Short Description"
                value={newService.shortDescription}
                onChange={(e) => setNewService({ ...newService, shortDescription: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
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
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Category"
                select
                value={newService.category}
                onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                sx={{ mb: 2 }}
                SelectProps={{
                  native: true,
                }}
              >
                {['SEO', 'Social Media Marketing', 'PPC', 'Content Marketing', 'Email Marketing', 'Web Design'].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Features (comma-separated)"
                value={newService.features}
                onChange={(e) => setNewService({ ...newService, features: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Button component="label" variant="outlined" sx={{ mb: 2 }}>
                Upload Service Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setServiceImage(e.target.files?.[0] || null)}
                />
              </Button>
              {serviceImage && (
                <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                  Selected image: {serviceImage.name}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" sx={{ backgroundColor: '#1976d2' }} type="submit">
                  Add Service
                </Button>
                <Button variant="outlined" onClick={() => setShowServiceForm(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </Card>

        {/* Recent Inquiries */}
        {/* Services List */}
        <Card sx={{ p: 3, mb: 6 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Services
          </Typography>
          {servicesList.length === 0 ? (
            <Typography sx={{ color: '#666' }}>No services created yet</Typography>
          ) : (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {servicesList.map((s) => (
                <Box key={s._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {s.image?.url && <img src={s.image.url} alt={s.title} style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 8 }} />}
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{s.title}</Typography>
                      <Typography sx={{ color: '#666', fontSize: 13 }}>{s.shortDescription}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Button variant="outlined" sx={{ mr: 1 }} onClick={() => handleEdit(s)}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(s._id)}>
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Card>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Recent Inquiries
          </Typography>
          {inquiries.length === 0 ? (
            <Typography sx={{ color: '#666' }}>No new inquiries</Typography>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Subject</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry._id}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>{inquiry.name}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>{inquiry.email}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>{inquiry.subject}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', color: '#999', fontSize: '14px' }}>
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </Card>
      </Container>
    </Layout>
  );
};

export default AdminDashboard;
