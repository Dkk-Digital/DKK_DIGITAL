import React, { useState } from 'react';
import { Box, Button, Card, CircularProgress, Container, Drawer, Grid, IconButton, Stack, TextField, Typography, Chip, Divider, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { confirmAlert, errorAlert, successAlert } from '../../utils/alerts';
import { Close as CloseIcon, CloudUpload as CloudUploadIcon, AttachMoney as AttachMoneyIcon, Category as CategoryIcon, Style as StyleIcon, ShortText as ShortTextIcon, Description as DescriptionIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { serviceService } from '../../services';
import useAdminPanelData from './useAdminPanelData';

const MotionCard = motion(Card);

const PanelCard = styled(Card)({
  borderRadius: 22,
  border: '1px solid rgba(255,255,255,0.5)',
  background: 'rgba(255,255,255,0.65)',
  backdropFilter: 'blur(24px)',
  boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
});

const ServiceRow = styled(motion.div)({
  padding: '20px',
  borderBottom: '1px solid rgba(148,163,184,0.14)',
  transition: 'background 0.2s',
  borderRadius: 12,
  '&:hover': {
    background: 'rgba(241,245,249,0.8)',
  },
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const confirmed = await confirmAlert('Delete this service?', 'This will permanently remove the service from the public catalog.');
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
    <Container maxWidth="xl" disableGutters component={motion.div} initial="hidden" animate="visible" variants={containerVariants}>
      <Box sx={{ mb: 4 }} component={motion.div} variants={itemVariants}>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.04em', mb: 1, background: 'linear-gradient(90deg, #0f172a, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Services
        </Typography>
        <Typography sx={{ color: '#64748b', maxWidth: 760, fontSize: '1.1rem' }}>
          Add new services, update existing offers, and keep the public catalog in sync.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={5} component={motion.div} variants={itemVariants}>
          <PanelCard sx={{ p: { xs: 2.5, md: 4 } }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: '#0f172a' }}>
              {editingServiceId ? 'Edit Service' : 'Create New Service'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
              Fill in the details below to publish a new service to the landing page.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField 
                  label="Service Title" 
                  value={form.title} 
                  onChange={(event) => setForm({ ...form, title: event.target.value })} 
                  required 
                  fullWidth 
                  variant="outlined"
                  InputProps={{ startAdornment: <InputAdornment position="start"><StyleIcon color="action" /></InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' } }}
                />
                <TextField 
                  label="Short Description" 
                  value={form.shortDescription} 
                  onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} 
                  required 
                  fullWidth 
                  helperText="Appears on the service card overview"
                  InputProps={{ startAdornment: <InputAdornment position="start"><ShortTextIcon color="action" /></InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' } }}
                />
                <TextField 
                  label="Full Description" 
                  value={form.description} 
                  onChange={(event) => setForm({ ...form, description: event.target.value })} 
                  required 
                  fullWidth 
                  multiline 
                  rows={4} 
                  helperText="Detailed explanation of the service"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' } }}
                />
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField 
                    label="Price" 
                    type="number" 
                    value={form.price} 
                    onChange={(event) => setForm({ ...form, price: event.target.value })} 
                    required 
                    fullWidth 
                    InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoneyIcon color="action" /></InputAdornment> }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' } }}
                  />
                  <TextField 
                    label="Category" 
                    select 
                    value={form.category} 
                    onChange={(event) => setForm({ ...form, category: event.target.value })} 
                    SelectProps={{ native: true }} 
                    fullWidth
                    InputProps={{ startAdornment: <InputAdornment position="start"><CategoryIcon color="action" /></InputAdornment> }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' } }}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </TextField>
                </Stack>
                
                <TextField 
                  label="Features" 
                  value={form.features} 
                  onChange={(event) => setForm({ ...form, features: event.target.value })} 
                  fullWidth 
                  helperText="Comma-separated list (e.g. Keyword Research, Backlinks, Content)"
                  InputProps={{ startAdornment: <InputAdornment position="start"><DescriptionIcon color="action" /></InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' } }}
                />

                <Box sx={{ border: '2px dashed rgba(148,163,184,0.3)', borderRadius: 3, p: 3, textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.5)', transition: 'border 0.3s', '&:hover': { borderColor: '#3b82f6' } }}>
                  <input type="file" id="service-image-upload" accept="image/*" hidden onChange={(event) => setServiceImage(event.target.files?.[0] || null)} />
                  <label htmlFor="service-image-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CloudUploadIcon sx={{ fontSize: 40, color: '#94a3b8', mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#334155' }}>
                      {serviceImage ? serviceImage.name : 'Click to upload service image'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      PNG, JPG, WebP up to 5MB
                    </Typography>
                  </label>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                  <Button type="submit" variant="contained" disabled={saving} sx={{ background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', textTransform: 'none', py: 1.5, fontSize: '1.05rem', fontWeight: 700, borderRadius: 2, flex: 2, boxShadow: '0 8px 20px rgba(37,99,235,0.2)' }}>
                    {saving ? 'Saving...' : editingServiceId ? 'Update Service' : 'Publish Service'}
                  </Button>
                  <Button type="button" variant="outlined" onClick={resetForm} sx={{ textTransform: 'none', py: 1.5, fontWeight: 600, borderRadius: 2, flex: 1 }}>
                    Reset
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </PanelCard>
        </Grid>

        <Grid item xs={12} lg={7} component={motion.div} variants={itemVariants}>
          <PanelCard sx={{ p: { xs: 2.5, md: 3 }, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Active Catalog
            </Typography>

            {services.length === 0 ? (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography sx={{ color: '#64748b', fontSize: '1.1rem' }}>No services published yet.</Typography>
              </Box>
            ) : (
              <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
                <AnimatePresence>
                  {services.map((service) => (
                    <ServiceRow key={service._id} variants={itemVariants} layout exit={{ opacity: 0, scale: 0.95 }} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 1 }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        {service.image?.url ? (
                          <Box component="img" src={service.image.url} alt={service.title} sx={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        ) : (
                          <Box sx={{ width: 90, height: 70, borderRadius: 2, background: 'rgba(148,163,184,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CategoryIcon sx={{ color: '#94a3b8' }} />
                          </Box>
                        )}
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>{service.title}</Typography>
                          <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                            {service.shortDescription}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip size="small" label={service.category} sx={{ backgroundColor: 'rgba(37,99,235,0.1)', color: '#1d4ed8', fontWeight: 700 }} />
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#1e293b' }}>
                              ₹{Number(service.price).toLocaleString('en-IN')}
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton size="small" onClick={() => setSelectedService(service)} sx={{ color: '#64748b', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEdit(service)} sx={{ color: '#0ea5e9', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(service._id)} sx={{ color: '#ef4444', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </ServiceRow>
                  ))}
                </AnimatePresence>
              </Box>
            )}
          </PanelCard>
        </Grid>
      </Grid>

      <Drawer anchor="right" open={Boolean(selectedService)} onClose={closeDetailDrawer}>
        <Box sx={{ width: { xs: 320, sm: 420 }, p: 4, position: 'relative', background: '#f8fafc', height: '100%' }}>
          <IconButton onClick={closeDetailDrawer} sx={{ position: 'absolute', top: 16, right: 16 }} aria-label="Close service details">
            <CloseIcon />
          </IconButton>

          {selectedService && (
            <Stack spacing={3} sx={{ pr: 2 }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#64748b', letterSpacing: '0.12em', fontWeight: 700 }}>
                  Service details
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1, mt: 0.5, color: '#0f172a' }}>
                  {selectedService.title}
                </Typography>
              </Box>

              {selectedService.image?.url && (
                <Box component="img" src={selectedService.image.url} alt={selectedService.title} sx={{ width: '100%', borderRadius: 3, objectFit: 'cover', maxHeight: 240, boxShadow: '0 10px 25px rgba(15,23,42,0.1)' }} />
              )}

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={selectedService.category} sx={{ backgroundColor: 'rgba(37,99,235,0.1)', color: '#1d4ed8', fontWeight: 700 }} />
                <Chip label={`₹${Number(selectedService.price).toLocaleString('en-IN')}`} sx={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#047857', fontWeight: 800 }} />
              </Stack>

              <Divider sx={{ borderColor: 'rgba(148,163,184,0.2)' }} />

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Short description
                </Typography>
                <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{selectedService.shortDescription}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Description
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#334155' }}>{selectedService.description}</Typography>
              </Box>

              {selectedService.features?.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Included Features
                  </Typography>
                  <Stack spacing={1}>
                    {selectedService.features.map((feature, index) => (
                      <Chip key={`${feature}-${index}`} label={feature} variant="outlined" sx={{ justifyContent: 'flex-start', fontWeight: 600, borderColor: 'rgba(148,163,184,0.4)', backgroundColor: '#fff' }} />
                    ))}
                  </Stack>
                </Box>
              )}

              <Button
                variant="contained"
                size="large"
                sx={{ background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', textTransform: 'none', borderRadius: 2, boxShadow: '0 8px 20px rgba(37,99,235,0.2)', mt: 2 }}
                onClick={() => {
                  handleEdit(selectedService);
                  closeDetailDrawer();
                }}
                startIcon={<EditIcon />}
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
