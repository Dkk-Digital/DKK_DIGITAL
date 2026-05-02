import React, { useState } from 'react';
import { Box, Button, Card, CircularProgress, Container, Drawer, Grid, IconButton, Stack, TextField, Typography, Chip, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { confirmAlert, errorAlert, successAlert } from '../../utils/alerts';
import { Close as CloseIcon } from '@mui/icons-material';
import { serviceService } from '../../services';
import useAdminPanelData from './useAdminPanelData';

const PanelCard = styled(Card)({
  borderRadius: 22,
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
});

const ServiceRow = styled(Box)({
  padding: '16px 0',
  borderBottom: '1px solid rgba(148,163,184,0.14)',
});

const categories = ['SEO', 'Social Media Marketing', 'PPC', 'Content Marketing', 'Email Marketing', 'Web Design'];

const emptyService = {
  title: '',
  description: '',
  shortDescription: '',
  price: '',
  category: 'SEO',
  features: '',
};

const AdminServices = () => {
  const { services, loading, refresh } = useAdminPanelData();
  const [serviceImage, setServiceImage] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [form, setForm] = useState(emptyService);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setForm(emptyService);
    setServiceImage(null);
    setEditingServiceId(null);
  };

  const closeDetailDrawer = () => setSelectedService(null);

  const handleEdit = (service) => {
    setEditingServiceId(service._id);
    setForm({
      title: service.title || '',
      description: service.description || '',
      shortDescription: service.shortDescription || '',
      price: service.price || '',
      category: service.category || 'SEO',
      features: (service.features || []).join(', '),
    });
    setServiceImage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('shortDescription', form.shortDescription);
      formData.append('price', form.price);
      formData.append('category', form.category);
      formData.append('features', form.features);

      if (serviceImage) {
        formData.append('image', serviceImage);
      }

      if (editingServiceId) {
        await serviceService.update(editingServiceId, formData);
        successAlert('Service updated successfully');
      } else {
        await serviceService.create(formData);
        successAlert('Service added successfully');
      }

      resetForm();
      await refresh();
    } catch (error) {
      errorAlert(error.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAlert('Delete this service?', 'This will permanently remove the service.');
    if (!confirmed) return;

    try {
      await serviceService.delete(id);
      successAlert('Service deleted');
      await refresh();
    } catch (error) {
      errorAlert('Failed to delete service');
    }
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
          Services
        </Typography>
        <Typography sx={{ color: '#64748b', maxWidth: 760 }}>
          Add new services, update existing offers, and keep the public catalog in sync.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={5}>
          <PanelCard sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              {editingServiceId ? 'Edit service' : 'Create service'}
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField label="Service title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required fullWidth />
                <TextField label="Short description" value={form.shortDescription} onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} required fullWidth />
                <TextField label="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required fullWidth multiline rows={4} />
                <TextField label="Price" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required fullWidth />
                <TextField label="Category" select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} SelectProps={{ native: true }} fullWidth>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </TextField>
                <TextField label="Features (comma-separated)" value={form.features} onChange={(event) => setForm({ ...form, features: event.target.value })} fullWidth />

                <Button component="label" variant="outlined" sx={{ textTransform: 'none', justifyContent: 'flex-start' }}>
                  Upload service image
                  <input type="file" accept="image/*" hidden onChange={(event) => setServiceImage(event.target.files?.[0] || null)} />
                </Button>
                {serviceImage && (
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Selected image: {serviceImage.name}
                  </Typography>
                )}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button type="submit" variant="contained" disabled={saving} sx={{ background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', textTransform: 'none' }} fullWidth>
                    {saving ? 'Saving...' : editingServiceId ? 'Update service' : 'Add service'}
                  </Button>
                  <Button type="button" variant="outlined" onClick={resetForm} sx={{ textTransform: 'none' }} fullWidth>
                    Reset
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </PanelCard>
        </Grid>

        <Grid item xs={12} lg={7}>
          <PanelCard sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Catalog
            </Typography>

            {services.length === 0 ? (
              <Typography sx={{ color: '#64748b' }}>No services created yet.</Typography>
            ) : (
              <Box>
                {services.map((service) => (
                  <ServiceRow key={service._id} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      {service.image?.url && (
                        <Box component="img" src={service.image.url} alt={service.title} sx={{ width: 84, height: 60, objectFit: 'cover', borderRadius: 2 }} />
                      )}
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{service.title}</Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {service.shortDescription}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#2563eb' }}>
                          {service.category} · ₹{service.price}
                        </Typography>
                      </Box>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Button variant="text" onClick={() => setSelectedService(service)} sx={{ textTransform: 'none' }}>
                        Details
                      </Button>
                      <Button variant="outlined" onClick={() => handleEdit(service)} sx={{ textTransform: 'none' }}>
                        Edit
                      </Button>
                      <Button variant="outlined" color="error" onClick={() => handleDelete(service._id)} sx={{ textTransform: 'none' }}>
                        Delete
                      </Button>
                    </Stack>
                  </ServiceRow>
                ))}
              </Box>
            )}
          </PanelCard>
        </Grid>
      </Grid>

      <Drawer anchor="right" open={Boolean(selectedService)} onClose={closeDetailDrawer}>
        <Box sx={{ width: { xs: 320, sm: 420 }, p: 3, position: 'relative' }}>
          <IconButton onClick={closeDetailDrawer} sx={{ position: 'absolute', top: 12, right: 12 }} aria-label="Close service details">
            <CloseIcon />
          </IconButton>

          {selectedService && (
            <Stack spacing={2.5} sx={{ pr: 3 }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#64748b', letterSpacing: '0.12em' }}>
                  Service details
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1, mt: 0.5 }}>
                  {selectedService.title}
                </Typography>
              </Box>

              {selectedService.image?.url && (
                <Box component="img" src={selectedService.image.url} alt={selectedService.title} sx={{ width: '100%', borderRadius: 3, objectFit: 'cover', maxHeight: 220 }} />
              )}

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={selectedService.category} />
                <Chip label={`₹${selectedService.price}`} color="primary" />
              </Stack>

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5 }}>
                  Short description
                </Typography>
                <Typography>{selectedService.shortDescription}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5 }}>
                  Description
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{selectedService.description}</Typography>
              </Box>

              {selectedService.features?.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                    Features
                  </Typography>
                  <Stack spacing={1}>
                    {selectedService.features.map((feature, index) => (
                      <Chip key={`${feature}-${index}`} label={feature} variant="outlined" />
                    ))}
                  </Stack>
                </Box>
              )}

              <Button
                variant="contained"
                sx={{ background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', textTransform: 'none' }}
                onClick={() => {
                  handleEdit(selectedService);
                  closeDetailDrawer();
                }}
              >
                Edit this service
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
    </Container>
  );
};

export default AdminServices;
