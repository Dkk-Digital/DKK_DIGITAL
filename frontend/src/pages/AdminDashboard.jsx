import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Layout from '../components/Layout';
import UserManagement from '../components/UserManagement';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import NotificationCenter from '../components/NotificationCenter';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
    const confirmed = await confirmAlert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      () => {}
    );
    if (!confirmed) return;
    try {
      <Layout>
            sx={{
            Admin Dashboard
              icon={AssignmentIcon}
              value={allStats.inquiries?.total || 0}
              color="#4caf50"
                border: '1px solid rgba(25,118,210,0.1)',

    return (
      <Layout>
        <Box sx={{ mb: 3, bgcolor: '#f5f5f5', borderBottom: '2px solid #667eea' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: '1px solid #e0e0e0',
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                '&.Mui-selected': {
                  color: '#667eea',
                },
              },
              '& .MuiTabScrollButton-root': {
                color: '#667eea',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#667eea',
              },
            }}
          >
            <Tab label="Analytics Dashboard" />
            <Tab label="User Management" />
            <Tab label="Notifications" />
          </Tabs>
        </Box>
              }}
        {activeTab === 0 && <AnalyticsDashboard />}
        {activeTab === 1 && <UserManagement />}
        {activeTab === 2 && <NotificationCenter />}
      </Layout>
    );
  };

  export default AdminDashboard;

  // Legacy code - keeping for reference but not used with new tab layout
  /*
    const handleDelete = async (id) => {
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
