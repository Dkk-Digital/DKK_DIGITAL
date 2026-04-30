import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Typography, CircularProgress, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';
import { blogService } from '../services';
import toast from 'react-hot-toast';

const BlogCard = styled(Card)(({ theme }) => ({
  padding: '20px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    transform: 'translateY(-5px)',
  },
}));

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAll({ published: 'true' });
      setBlogs(response.data.blogs);
    } catch (error) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 6, fontWeight: 700 }}>
          Our Blog
        </Typography>

        {blogs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ color: '#666' }}>
              No blog posts available.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {blogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog._id}>
                <BlogCard>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ backgroundColor: '#f0f4ff', color: '#1976d2', p: '4px 8px', borderRadius: '4px' }}>
                      {blog.category}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333', minHeight: '60px' }}>
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 2, minHeight: '60px' }}>
                    {blog.excerpt}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#999', mb: 2 }}>
                    <span>By {blog.author?.name}</span>
                    <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                  </Box>
                  <Button
                    component={RouterLink}
                    to={`/blog/${blog.slug}`}
                    variant="text"
                    sx={{ color: '#1976d2', textTransform: 'capitalize' }}
                  >
                    Read More →
                  </Button>
                </BlogCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default Blog;
