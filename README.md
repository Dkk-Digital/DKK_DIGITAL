# DKK Digital - Full Stack MERN Application

Welcome to **DKK Digital Marketing Company** - A comprehensive full-stack web application built with **MongoDB**, **Express**, **React**, and **Node.js**.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Seeding](#database-seeding)
- [Deployment Guide](#deployment-guide)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin & Client)
- ✅ Secure password hashing with bcryptjs

### Admin Dashboard
- ✅ View and manage all services
- ✅ Add/Edit/Delete marketing services
- ✅ View client inquiries and projects
- ✅ Analytics dashboard with stats
- ✅ Manage user accounts

### Client Dashboard
- ✅ View assigned projects
- ✅ Track project progress
- ✅ View available services
- ✅ Submit new projects
- ✅ Update profile information

### Website Pages
- ✅ Home page with service overview
- ✅ Services page with detailed listings
- ✅ About page with company information
- ✅ Blog section with full CRUD
- ✅ Contact form with inquiry submission
- ✅ Responsive design for all devices

### Additional Features
- ✅ RESTful API for all operations
- ✅ Error handling and validation
- ✅ Real-time notifications with Toast
- ✅ Messaging system (basic)
- ✅ Project management
- ✅ Inquiry tracking system

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment**: dotenv
- **Email**: Nodemailer (optional)

### Frontend
- **Framework**: React 18
- **Bundler**: Vite
- **Routing**: React Router v6
- **UI Library**: Material-UI (MUI)
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Editor**: React Quill (for blog)

---

## 📁 Project Structure

```
DKK_DIGITAL/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth logic
│   │   │   ├── serviceController.js # Service management
│   │   │   ├── projectController.js # Project management
│   │   │   ├── inquiryController.js # Inquiry handling
│   │   │   ├── blogController.js    # Blog management
│   │   │   └── messageController.js # Messaging system
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification
│   │   │   └── errorHandler.js      # Error handling
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   ├── Service.js           # Service schema
│   │   │   ├── Project.js           # Project schema
│   │   │   ├── Inquiry.js           # Inquiry schema
│   │   │   ├── Blog.js              # Blog schema
│   │   │   └── Message.js           # Message schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── serviceRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── inquiryRoutes.js
│   │   │   ├── blogRoutes.js
│   │   │   └── messageRoutes.js
│   │   ├── utils/
│   │   │   └── jwt.js               # JWT utilities
│   │   └── server.js                # Express server entry point
│   ├── .env.example                 # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── seed.js                      # Database seeding script
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx           # Main layout wrapper
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── Footer.jsx           # Footer component
│   │   │   ├── ProtectedRoute.jsx   # Protected route wrapper
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state management
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── BlogDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ClientDashboard.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance
│   │   │   └── index.js             # API service functions
│   │   ├── styles/
│   │   │   └── globals.css          # Global styles
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # React entry point
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
└── README.md                        # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd DKK_DIGITAL
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials (see next section)
# nano .env  (or use your preferred editor)

# Seed the database (optional)
npm run seed
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed
# nano .env
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dkk_digital

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Cloudinary Configuration (Optional for image upload)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Details for Seeding
ADMIN_EMAIL=admin@dkkdigital.com
ADMIN_PASSWORD=Admin@123
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=DKK Digital Marketing
```

---

## 📦 Running the Application

### Development Mode

#### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

Backend runs on: `http://localhost:5000`

#### Terminal 2 - Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Production Build

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```
POST /auth/register
Body: {
  name: string,
  email: string,
  password: string,
  role: "admin" | "client" (optional, default: "client")
}
Response: { success, token, user }
```

#### Login
```
POST /auth/login
Body: { email, password }
Response: { success, token, user }
```

#### Get Profile
```
GET /auth/profile
Header: Authorization: Bearer <token>
Response: { success, user }
```

### Services Endpoints

#### Get All Services
```
GET /services?category=SEO
Response: { success, count, services[] }
```

#### Get Service by ID
```
GET /services/:id
Response: { success, service }
```

#### Create Service (Admin only)
```
POST /services
Header: Authorization: Bearer <token>
Body: {
  title, description, shortDescription,
  price, category, features[]
}
Response: { success, service }
```

#### Update Service (Admin)
```
PUT /services/:id
Header: Authorization: Bearer <token>
Body: { fields to update }
Response: { success, service }
```

#### Delete Service (Admin)
```
DELETE /services/:id
Header: Authorization: Bearer <token>
Response: { success }
```

### Projects Endpoints

#### Get My Projects (Client)
```
GET /projects/client/my-projects
Header: Authorization: Bearer <token>
Response: { success, projects[] }
```

#### Create Project
```
POST /projects
Header: Authorization: Bearer <token>
Body: {
  title, description, service,
  budget, startDate, endDate
}
Response: { success, project }
```

#### Get All Projects (Admin)
```
GET /projects?status=in-progress
Header: Authorization: Bearer <token>
Response: { success, projects[] }
```

### Inquiries Endpoints

#### Submit Inquiry (Public)
```
POST /inquiries
Body: {
  name, email, phone,
  subject, message, serviceInterest
}
Response: { success, inquiry }
```

#### Get Inquiry Stats (Admin)
```
GET /inquiries/stats/overview
Header: Authorization: Bearer <token>
Response: { success, stats }
```

#### Get All Inquiries (Admin)
```
GET /inquiries?status=new
Header: Authorization: Bearer <token>
Response: { success, inquiries[] }
```

### Blog Endpoints

#### Get All Blogs
```
GET /blogs?published=true&category=SEO
Response: { success, blogs[] }
```

#### Get Blog by Slug
```
GET /blogs/:slug
Response: { success, blog }
```

#### Create Blog (Admin)
```
POST /blogs
Header: Authorization: Bearer <token>
Body: {
  title, content, excerpt,
  category, tags[], published
}
Response: { success, blog }
```

---

## 🌱 Database Seeding

### Automatic Seeding

```bash
cd backend
npm run seed
```

This creates:
- 1 Admin user: `admin@dkkdigital.com` / `Admin@123`
- 2 Client users: `john@example.com` / `Admin@123`
- 6 Sample services
- 3 Sample blog posts

### Manual Entry

You can also use MongoDB Compass or the admin dashboard to add data.

---

## 🌐 Deployment Guide

### Backend Deployment (Heroku)

1. **Create Heroku Account** and install Heroku CLI

2. **Prepare Backend**
   ```bash
   cd backend
   # Ensure all dependencies are in package.json
   # Create Procfile
   echo "web: node src/server.js" > Procfile
   ```

3. **Deploy**
   ```bash
   heroku create your-app-name
   heroku config:set MONGODB_URI=<your_mongodb_uri>
   heroku config:set JWT_SECRET=<your_secret>
   git push heroku main
   ```

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel --env VITE_API_URL=<backend_url>
   ```

### Alternative: Railway.app

```bash
# Backend
railway up

# Frontend
vercel
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure MongoDB is running locally

### CORS Error
- Check `CLIENT_URL` in backend `.env`
- Verify `VITE_API_URL` in frontend `.env`
- Ensure they match the running ports

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

### Module Not Found Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Token Issues
- Check JWT_SECRET is set
- Verify token is sent in Authorization header
- Clear localStorage and login again

---

## 📝 Sample Test Data

### Demo Admin Account
```
Email: admin@dkkdigital.com
Password: Admin@123
```

### Demo Client Account
```
Email: john@example.com
Password: Admin@123
```

---

## 🤝 Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation
- Check browser console for errors
- Contact support at support@dkkdigital.com

---

**Built with ❤️ by DKK Digital Team**
