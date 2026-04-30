import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './src/models/User.js';
import Service from './src/models/Service.js';
import Blog from './src/models/Blog.js';
import { connectDB } from './src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Blog.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@dkkdigital.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+91-9876543210',
      company: 'DKK Digital',
    });

    // Create client users
    const client1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'client',
      phone: '+91-8765432109',
      company: 'Tech Solutions Inc.',
    });

    const client2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      role: 'client',
      phone: '+91-7654321098',
      company: 'Creative Agency Ltd.',
    });

    // Create services
    const services = await Service.create([
      {
        title: 'SEO Optimization',
        description: 'Comprehensive SEO services to improve your search engine rankings and drive organic traffic to your website.',
        shortDescription: 'Boost your search engine rankings',
        price: 25000,
        category: 'SEO',
        features: [
          'Keyword Research & Analysis',
          'On-page SEO Optimization',
          'Technical SEO Audit',
          'Backlink Building',
          'Monthly Reports',
        ],
        createdBy: admin._id,
      },
      {
        title: 'Social Media Marketing',
        description: 'Grow your brand presence on social media platforms with targeted campaigns and engaging content.',
        shortDescription: 'Grow your brand on social platforms',
        price: 20000,
        category: 'Social Media Marketing',
        features: [
          'Content Strategy',
          'Post Creation',
          'Community Management',
          'Ad Campaigns',
          'Analytics & Reporting',
        ],
        createdBy: admin._id,
      },
      {
        title: 'PPC Advertising',
        description: 'Drive immediate results with highly targeted PPC campaigns on Google and social media platforms.',
        shortDescription: 'Get instant results with paid ads',
        price: 30000,
        category: 'PPC',
        features: [
          'Campaign Setup & Management',
          'Keyword Bidding Strategy',
          'Ad Copy Creation',
          'Landing Page Optimization',
          'ROI Tracking',
        ],
        createdBy: admin._id,
      },
      {
        title: 'Content Marketing',
        description: 'Create compelling, SEO-optimized content that attracts and converts your target audience.',
        shortDescription: 'Create content that converts',
        price: 15000,
        category: 'Content Marketing',
        features: [
          'Blog Post Writing',
          'Content Calendar',
          'Copywriting',
          'Content Distribution',
          'Performance Tracking',
        ],
        createdBy: admin._id,
      },
      {
        title: 'Email Marketing',
        description: 'Build and nurture customer relationships with personalized email campaigns.',
        shortDescription: 'Engage customers via email',
        price: 12000,
        category: 'Email Marketing',
        features: [
          'Email Template Design',
          'List Management',
          'Campaign Automation',
          'A/B Testing',
          'Detailed Analytics',
        ],
        createdBy: admin._id,
      },
      {
        title: 'Web Design',
        description: 'Beautiful, responsive websites that deliver an exceptional user experience and drive conversions.',
        shortDescription: 'Professional website design',
        price: 50000,
        category: 'Web Design',
        features: [
          'Responsive Design',
          'UI/UX Design',
          'WordPress Development',
          'Mobile Optimization',
          'SEO-friendly Structure',
        ],
        createdBy: admin._id,
      },
    ]);

    // Create blog posts
    const blogs = await Blog.create([
      {
        title: '10 Essential SEO Tips for 2024',
        content: '<h2>Introduction</h2><p>Search Engine Optimization continues to evolve in 2024. Here are the most important SEO strategies you should focus on.</p><h2>1. Focus on User Experience</h2><p>Google now considers user experience as a ranking factor. Ensure your website loads quickly, is mobile-friendly, and easy to navigate.</p><h2>2. Create Quality Content</h2><p>Content is still king. Create comprehensive, original content that addresses your audience\'s needs and questions.</p><h2>Conclusion</h2><p>These strategies will help you improve your SEO rankings and drive more organic traffic to your website.</p>',
        excerpt: 'Discover the most important SEO strategies for 2024 and improve your search engine rankings.',
        category: 'SEO',
        tags: ['SEO', '2024', 'Tips', 'Search Engine'],
        author: admin._id,
        published: true,
        publishedAt: new Date(),
      },
      {
        title: 'The Power of Social Media Marketing',
        content: '<h2>Introduction</h2><p>Social media has become an essential marketing channel for businesses of all sizes.</p><h2>Building Community</h2><p>Focus on building genuine relationships with your audience rather than just promoting products.</p><h2>Engagement Tips</h2><p>Post consistently, respond to comments quickly, and create content that encourages interaction.</p>',
        excerpt: 'Learn how to leverage social media marketing to grow your business and engage with customers.',
        category: 'Social Media',
        tags: ['Social Media', 'Marketing', 'Engagement'],
        author: admin._id,
        published: true,
        publishedAt: new Date(),
      },
      {
        title: 'Understanding Web Design Trends 2024',
        content: '<h2>Introduction</h2><p>Web design trends change rapidly. Let\'s explore what\'s trending in 2024.</p><h2>Minimalist Design</h2><p>Less is more. Clean, minimalist designs are becoming increasingly popular.</p><h2>Dark Mode</h2><p>Dark mode options are now expected on modern websites.</p>',
        excerpt: 'Explore the latest web design trends that are shaping the internet in 2024.',
        category: 'Trends',
        tags: ['Web Design', 'Trends', 'UI/UX'],
        author: admin._id,
        published: true,
        publishedAt: new Date(),
      },
    ]);

    console.log('✓ Database seeded successfully!');
    console.log('✓ Admin User: admin@dkkdigital.com / Admin@123');
    console.log('✓ Client User: john@example.com / Admin@123');
    console.log('✓ Services Created: 6');
    console.log('✓ Blog Posts Created: 3');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
