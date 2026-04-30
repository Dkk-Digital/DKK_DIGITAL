# DKK Digital - Backend API

Express.js REST API for DKK Digital Marketing Company

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Seed database (optional)
npm run seed

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

## Project Structure

- `src/models/` - Database schemas
- `src/controllers/` - Business logic
- `src/routes/` - API endpoints
- `src/middleware/` - Auth, error handling
- `src/config/` - Database configuration
- `src/utils/` - Helper functions

## Available Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service with optional image upload (admin)
- `PUT /api/services/:id` - Update service and replace image if provided (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Projects
- `GET /api/projects/client/my-projects` - Get my projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects (admin)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Inquiries
- `POST /api/inquiries` - Submit inquiry
- `GET /api/inquiries` - Get inquiries (admin)
- `GET /api/inquiries/stats/overview` - Get stats
- `PUT /api/inquiries/:id` - Update inquiry status

### Blog
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create blog with optional image upload (admin)
- `GET /api/blogs/:slug` - Get blog by slug
- `PUT /api/blogs/:id` - Update blog and replace image if provided
- `DELETE /api/blogs/:id` - Delete blog

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/:userId` - Get conversation
- `DELETE /api/messages/:id` - Delete message

## Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

## Environment Variables

See `.env.example` for all required variables.

Key variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (default: 5000)
- `SMTP_USER` / `SMTP_PASS` - Gmail account and app password used to send contact emails
- `OWNER_EMAIL` - Optional inbox that receives inquiry notifications

## Database Models

### User
- name, email, password, role, phone, company, profileImage

### Service
- title, description, shortDescription, image, price, category, features

### Project
- title, description, client, service, status, progress, budget, startDate, endDate

### Inquiry
- name, email, phone, subject, message, serviceInterest, status

### Blog
- title, slug, content, excerpt, image, author, category, tags, published, views

### Message
- conversationId, sender, recipient, message, attachments, isRead

## Development

```bash
# Run in development with auto-reload
npm run dev

# Production build
npm start
```

## Seeding Database

```bash
npm run seed
```

Creates sample data:
- Admin user
- Demo clients
- Sample services
- Sample blogs

## Error Handling

Errors are returned in format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## API Response Format

All successful responses follow:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

See main README.md for complete documentation.
