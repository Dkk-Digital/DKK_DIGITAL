import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Typography, CircularProgress, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Layout from '../components/Layout';
import { blogService } from '../services';
import toast from 'react-hot-toast';

const HeroSection = styled(Box)(() => ({
  background: 'linear-gradient(135deg, rgba(25,118,210,0.08) 0%, rgba(124,77,255,0.06) 100%)',
  padding: '80px 0',
  borderRadius: '16px',
  marginBottom: '60px',
  textAlign: 'center',
}));

const BlogCard = styled(Card)(({ theme }) => ({
  padding: '25px',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  height: '100%',
  border: '1px solid rgba(25,118,210,0.08)',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,252,255,0.8) 100%)',
  '&:hover': {
    boxShadow: '0 20px 40px rgba(25,118,210,0.15)',
    transform: 'translateY(-8px)',
    borderColor: 'rgba(25,118,210,0.2)',
  },
}));

const BlogImage = styled('img')({
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '12px',
  marginBottom: '16px',
});

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
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <HeroSection className="fade-in-down">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, background: 'linear-gradient(90deg, #1976d2, #0ea5e9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Our Blog
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Stay informed with insights, tips, and strategies from our digital marketing experts.
          </Typography>
        </HeroSection>

        {blogs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" sx={{ color: '#666' }}>
              No blog posts available.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {blogs.map((blog, index) => (
              <Grid item xs={12} sm={6} md={4} key={blog._id}>
                <BlogCard className={`fade-in-up stagger-${(index % 5) + 1} float`}>
                  {blog.image?.url && <BlogImage src={blog.image.url} alt={blog.title} />}
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
