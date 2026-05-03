import React, { useState } from 'react';
import { Box, Button, Card, CircularProgress, Container, Drawer, Grid, IconButton, Stack, TextField, Typography, Chip, Divider, InputAdornment, FormControlLabel, Checkbox } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { confirmAlert, errorAlert, successAlert } from '../../utils/alerts';
import { Close as CloseIcon, CloudUpload as CloudUploadIcon, Description as DescriptionIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, Title as TitleIcon, ShortText as ShortTextIcon, Category as CategoryIcon, Style as StyleIcon } from '@mui/icons-material';
import { blogService } from '../../services';
import useAdminPanelData from './useAdminPanelData';

const PanelCard = styled(Card)({
  borderRadius: 22,
  border: '1px solid rgba(255,255,255,0.5)',
  background: 'rgba(255,255,255,0.65)',
  backdropFilter: 'blur(24px)',
  boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
});

const BlogRow = styled(motion.div)({
  padding: '20px',
  borderBottom: '1px solid rgba(148,163,184,0.14)',
  transition: 'background 0.2s',
  borderRadius: 12,
  '&:hover': {
    background: 'rgba(241,245,249,0.8)',
  },
});

const categories = ['Digital Marketing', 'SEO', 'Social Media', 'Content', 'Trends', 'Case Study', 'Other'];

const emptyBlog = {
  title: '',
  content: '',
  excerpt: '',
  category: 'SEO',
  tags: '',
  published: true,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const AdminBlogs = () => {
  const { blogs, loading, refresh } = useAdminPanelData();
  const [blogImage, setBlogImage] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [form, setForm] = useState(emptyBlog);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setForm(emptyBlog);
    setBlogImage(null);
    setEditingBlogId(null);
  };

  const closeDetailDrawer = () => setSelectedBlog(null);

  const handleEdit = (blog) => {
    setEditingBlogId(blog._id);
    setForm({
      title: blog.title || '',
      content: blog.content || '',
      excerpt: blog.excerpt || '',
      category: blog.category || 'SEO',
      tags: (blog.tags || []).join(', '),
      published: blog.published !== undefined ? blog.published : true,
    });
    setBlogImage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('excerpt', form.excerpt);
      formData.append('category', form.category);
      formData.append('tags', form.tags);
      formData.append('published', form.published);

      if (blogImage) {
        formData.append('image', blogImage);
      }

      if (editingBlogId) {
        await blogService.update(editingBlogId, formData);
        successAlert('Blog updated successfully');
      } else {
        await blogService.create(formData);
        successAlert('Blog created successfully');
      }

      resetForm();
      await refresh();
    } catch (error) {
      errorAlert(error.response?.data?.message || 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAlert('Delete this blog?', 'This will permanently remove the blog post.');
    if (!confirmed) return;

    try {
      await blogService.delete(id);
      successAlert('Blog deleted');
      await refresh();
    } catch (error) {
      errorAlert('Failed to delete blog');
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
          Blog Management
        </Typography>
        <Typography sx={{ color: '#64748b', maxWidth: 760, fontSize: '1.1rem' }}>
          Compose new blogs, update current posts, and control the content displayed to users.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={5} component={motion.div} variants={itemVariants}>
          <PanelCard sx={{ p: { xs: 2.5, md: 4 } }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: '#0f172a' }}>
              {editingBlogId ? 'Edit Blog Post' : 'Create New Post'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
              Fill out the form below to publish your insights on the main blog feed.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField 
                  label="Blog Title" 
                  value={form.title} 
                  onChange={(event) => setForm({ ...form, title: event.target.value })} 
                  required 
                  fullWidth 
                  variant="outlined"
                  InputProps={{ startAdornment: <InputAdornment position="start"><TitleIcon color="action" /></InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' } }}
                />
                <TextField 
                  label="Excerpt" 
                  value={form.excerpt} 
                  onChange={(event) => setForm({ ...form, excerpt: event.target.value })} 
                  required 
                  fullWidth 
                  helperText="Short summary that appears on blog cards"
                  InputProps={{ startAdornment: <InputAdornment position="start"><ShortTextIcon color="action" /></InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' } }}
                />
                <TextField 
                  label="Blog Content" 
                  value={form.content} 
                  onChange={(event) => setForm({ ...form, content: event.target.value })} 
                  required 
                  fullWidth 
                  multiline 
                  rows={6} 
                  helperText="Full blog post content (supports raw text or simple HTML)"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' } }}
                />
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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

                  <TextField 
                    label="Tags" 
                    value={form.tags} 
                    onChange={(event) => setForm({ ...form, tags: event.target.value })} 
                    fullWidth 
                    placeholder="E.g. Digital, Strategy"
                    InputProps={{ startAdornment: <InputAdornment position="start"><StyleIcon color="action" /></InputAdornment> }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' } }}
                  />
                </Stack>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.published}
                      onChange={(event) => setForm({ ...form, published: event.target.checked })}
                      color="primary"
                    />
                  }
                  label="Publish this post publicly"
                />

                <Box sx={{ border: '2px dashed rgba(148,163,184,0.3)', borderRadius: 3, p: 3, textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.5)', transition: 'border 0.3s', '&:hover': { borderColor: '#3b82f6' } }}>
                  <input type="file" id="blog-image-upload" accept="image/*" hidden onChange={(event) => setBlogImage(event.target.files?.[0] || null)} />
                  <label htmlFor="blog-image-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CloudUploadIcon sx={{ fontSize: 40, color: '#94a3b8', mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#334155' }}>
                      {blogImage ? blogImage.name : 'Click to upload header image'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      PNG, JPG, WebP up to 5MB
                    </Typography>
                  </label>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                  <Button type="submit" variant="contained" disabled={saving} sx={{ background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', textTransform: 'none', py: 1.5, fontSize: '1.05rem', fontWeight: 700, borderRadius: 2, flex: 2, boxShadow: '0 8px 20px rgba(37,99,235,0.2)' }}>
                    {saving ? 'Saving...' : editingBlogId ? 'Update Post' : 'Publish Blog'}
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
              Active Blog Posts
            </Typography>

            {blogs.length === 0 ? (
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography sx={{ color: '#64748b', fontSize: '1.1rem' }}>No blog posts published yet.</Typography>
              </Box>
            ) : (
              <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
                <AnimatePresence>
                  {blogs.map((blog) => (
                    <BlogRow key={blog._id} variants={itemVariants} layout exit={{ opacity: 0, scale: 0.95 }} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 1 }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        {blog.image?.url ? (
                          <Box component="img" src={blog.image.url} alt={blog.title} sx={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        ) : (
                          <Box sx={{ width: 90, height: 70, borderRadius: 2, background: 'rgba(148,163,184,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CategoryIcon sx={{ color: '#94a3b8' }} />
                          </Box>
                        )}
                        <Box>
                          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>{blog.title}</Typography>
                          <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                            {blog.excerpt}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip size="small" label={blog.category} sx={{ backgroundColor: 'rgba(37,99,235,0.1)', color: '#1d4ed8', fontWeight: 700 }} />
                            <Chip size="small" label={blog.published ? 'Published' : 'Draft'} color={blog.published ? 'success' : 'default'} sx={{ fontWeight: 700 }} />
                          </Stack>
                        </Box>
                      </Box>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton size="small" onClick={() => setSelectedBlog(blog)} sx={{ color: '#64748b', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEdit(blog)} sx={{ color: '#0ea5e9', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(blog._id)} sx={{ color: '#ef4444', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </BlogRow>
                  ))}
                </AnimatePresence>
              </Box>
            )}
          </PanelCard>
        </Grid>
      </Grid>

      <Drawer anchor="right" open={Boolean(selectedBlog)} onClose={closeDetailDrawer}>
        <Box sx={{ width: { xs: 320, sm: 420 }, p: 4, position: 'relative', background: '#f8fafc', height: '100%' }}>
          <IconButton onClick={closeDetailDrawer} sx={{ position: 'absolute', top: 16, right: 16 }} aria-label="Close blog details">
            <CloseIcon />
          </IconButton>

          {selectedBlog && (
            <Stack spacing={3} sx={{ pr: 2 }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#64748b', letterSpacing: '0.12em', fontWeight: 700 }}>
                  Blog Details
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1, mt: 0.5, color: '#0f172a' }}>
                  {selectedBlog.title}
                </Typography>
              </Box>

              {selectedBlog.image?.url && (
                <Box component="img" src={selectedBlog.image.url} alt={selectedBlog.title} sx={{ width: '100%', borderRadius: 3, objectFit: 'cover', maxHeight: 240, boxShadow: '0 10px 25px rgba(15,23,42,0.1)' }} />
              )}

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={selectedBlog.category} sx={{ backgroundColor: 'rgba(37,99,235,0.1)', color: '#1d4ed8', fontWeight: 700 }} />
                <Chip label={selectedBlog.published ? 'Published' : 'Draft'} color={selectedBlog.published ? 'success' : 'default'} sx={{ fontWeight: 700 }} />
              </Stack>

              <Divider sx={{ borderColor: 'rgba(148,163,184,0.2)' }} />

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Excerpt
                </Typography>
                <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{selectedBlog.excerpt}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Content
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#334155' }}>{selectedBlog.content}</Typography>
              </Box>

              {selectedBlog.tags?.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Tags
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {selectedBlog.tags.map((tag, index) => (
                      <Chip key={`${tag}-${index}`} label={tag} variant="outlined" sx={{ fontWeight: 600, borderColor: 'rgba(148,163,184,0.4)', backgroundColor: '#fff' }} />
                    ))}
                  </Stack>
                </Box>
              )}

              <Button
                variant="contained"
                size="large"
                sx={{ background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', textTransform: 'none', borderRadius: 2, boxShadow: '0 8px 20px rgba(37,99,235,0.2)', mt: 2 }}
                onClick={() => {
                  handleEdit(selectedBlog);
                  closeDetailDrawer();
                }}
                startIcon={<EditIcon />}
              >
                Edit this blog
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
    </Container>
  );
};

export default AdminBlogs;
