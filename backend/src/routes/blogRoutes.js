import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createBlog, getAllBlogs, getBlogBySlug, updateBlog, deleteBlog } from '../controllers/blogController.js';

const router = express.Router();

router.post('/', protect, adminOnly, upload.single('image'), createBlog);
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);
router.put('/:id', protect, adminOnly, upload.single('image'), updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

export default router;
