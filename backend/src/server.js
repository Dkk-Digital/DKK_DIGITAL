import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Environment variables are loaded via import 'dotenv/config'

// Initialize express app
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Connect to database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

export default app;

// Start server only for local/dev runtime.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
