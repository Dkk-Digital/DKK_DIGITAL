import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import Layout from '../components/Layout';
import { blogService } from '../services';
import toast from 'react-hot-toast';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBySlug(slug);
      setBlog(response.data.blog);
    } catch (error) {
      toast.error('Failed to load blog');
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

  if (!blog) {
    return (
      <Layout>
        <Container sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#666' }}>
            Blog not found
          </Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
          {blog.title}
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', gap: 2, color: '#999', fontSize: '14px' }}>
          <span>By {blog.author?.name}</span>
          <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
          <span>Category: {blog.category}</span>
        </Box>

        <Box sx={{ mb: 3, py: 2, borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="body1" sx={{ color: '#666', fontStyle: 'italic' }}>
            {blog.excerpt}
          </Typography>
        </Box>

        <Box
          sx={{
            color: '#333',
            lineHeight: 1.8,
            '& p': { mb: 2 },
            '& h2': { mt: 4, mb: 2, fontWeight: 600 },
            '& h3': { mt: 3, mb: 2, fontWeight: 600 },
            '& ul, & ol': { pl: 3, mb: 2 },
            '& li': { mb: 1 },
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {blog.tags && blog.tags.length > 0 && (
          <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Tags:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {blog.tags.map((tag, i) => (
                <Box
                  key={i}
                  sx={{
                    backgroundColor: '#f0f4ff',
                    color: '#1976d2',
                    px: 2,
                    py: 1,
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  #{tag}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default BlogDetail;
