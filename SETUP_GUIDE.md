# DKK Digital - Setup Instructions

This file contains detailed setup instructions for the DKK Digital MERN application.

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **MongoDB Atlas Account** - [Free Tier](https://www.mongodb.com/cloud/atlas)
- **Git** (optional) - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

### Verify Installation

```bash
node --version    # Should be v14+
npm --version     # Should be v6+
```

---

## 🗄️ MongoDB Atlas Setup

### 1. Create MongoDB Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Sign Up" and create an account
3. Verify your email

### 2. Create a Cluster

1. After login, click "Create a Deployment"
2. Select **M0 FREE** tier
3. Choose your preferred region (closest to your location)
4. Click "Create Deployment"
5. Wait for cluster to initialize (2-5 minutes)

### 3. Get Connection String

1. Click "Connect" on your cluster
2. Select "Drivers" tab
3. Choose "Node.js" and version 4.0 or later
4. Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database`

### 4. Create Database User

1. In MongoDB Atlas, go to "Database Access"
2. Click "Add New Database User"
3. Enter username: `admin`
4. Select "Password" authentication
5. Enter password (e.g., `DkkDigital@2024`)
6. Click "Add User"

### 5. Allow Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Connection String Example
```
mongodb+srv://admin:DkkDigital@2024@cluster0.abc123.mongodb.net/dkk_digital?retryWrites=true&w=majority
```

---

## 🚀 Installation Steps

### Step 1: Download/Clone Project

```bash
# Option A: If cloning from git
git clone https://github.com/your-repo/dkk-digital.git
cd DKK_DIGITAL

# Option B: If files are already present
cd DKK_DIGITAL
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install all dependencies (takes 1-2 minutes)
npm install

# Create .env file
cp .env.example .env

# Edit .env with your details
```

#### Backend .env Configuration

Open `backend/.env` and update:

```env
# Copy your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://admin:DkkDigital@2024@cluster0.abc123.mongodb.net/dkk_digital?retryWrites=true&w=majority

# Keep these as is or generate your own
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Server settings
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Email (optional - leave as is for now)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Cloudinary (optional - leave as is for now)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 3: Seed Database (Optional but Recommended)

```bash
# Still in backend directory
npm run seed

# You should see:
# ✓ Database seeded successfully!
# ✓ Admin User: admin@dkkdigital.com / Admin@123
# ✓ Client User: john@example.com / Admin@123
# ✓ Services Created: 6
# ✓ Blog Posts Created: 3
```

### Step 4: Start Backend Server

```bash
# Still in backend directory
npm run dev

# You should see:
# Server running on port 5000
# MongoDB Connected: cluster0.abc123.mongodb.net
```

**Leave this terminal running!**

### Step 5: Frontend Setup (New Terminal)

```bash
# Open new terminal/command prompt
# Navigate to project root
cd DKK_DIGITAL/frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# The default values should work, but verify:
# VITE_API_URL=http://localhost:5000/api
# VITE_APP_NAME=DKK Digital Marketing
```

### Step 6: Start Frontend Server

```bash
# In frontend directory
npm run dev

# You should see:
# ➜ Local: http://localhost:3000/
# ➜ Press q to quit
```

**Open your browser and go to: `http://localhost:3000`**

---

## 🧪 Testing the Application

### Test Login with Demo Credentials

1. Go to http://localhost:3000/login
2. Use Admin credentials:
   - Email: `admin@dkkdigital.com`
   - Password: `Admin@123`
3. You should see Admin Dashboard

### Test Client Login

1. Go to http://localhost:3000/login
2. Use Client credentials:
   - Email: `john@example.com`
   - Password: `Admin@123`
3. You should see Client Dashboard

### Test Public Pages

- Homepage: http://localhost:3000/
- Services: http://localhost:3000/services
- About: http://localhost:3000/about
- Contact: http://localhost:3000/contact
- Blog: http://localhost:3000/blog

### Test Admin Features

1. Login as admin
2. Go to Admin Dashboard
3. Try:
   - Viewing inquiry stats
   - Adding a new service
   - Viewing inquiries

### Test Client Features

1. Login as client (john@example.com)
2. Go to Client Dashboard
3. Try:
   - Creating a new project
   - Viewing project status

---

## 🛠️ API Testing (Optional)

### Using Postman or Thunder Client

1. **Register New User**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body (JSON):
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "Password123",
     "role": "client"
   }
   ```

2. **Login**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Body (JSON):
   ```json
   {
     "email": "admin@dkkdigital.com",
     "password": "Admin@123"
   }
   ```

3. **Get Services**
   - Method: GET
   - URL: `http://localhost:5000/api/services`

4. **Health Check**
   - Method: GET
   - URL: `http://localhost:5000/api/health`

---

## ⚠️ Troubleshooting

### Problem: "MongoDB Connection Error"

**Solution:**
- Verify connection string is correct in .env
- Check MongoDB Atlas:
  - Cluster is running
  - Network access allows your IP (0.0.0.0/0)
  - Username and password are correct

### Problem: "Port 5000 already in use"

**Solution:**
```bash
# Kill the process using port 5000
npx kill-port 5000
```

### Problem: "Port 3000 already in use"

**Solution:**
```bash
# Kill the process using port 3000
npx kill-port 3000
```

### Problem: "Cannot find module 'express'"

**Solution:**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Problem: "CORS Error"

**Solution:**
- Verify `CLIENT_URL` in backend `.env` matches frontend URL
- Clear browser cache and localStorage
- Restart both servers

### Problem: "Token Error" after login

**Solution:**
- Clear localStorage: Open DevTools → Application → Local Storage → Clear All
- Logout and login again
- Check JWT_SECRET is set in .env

### Problem: "Seed script fails"

**Solution:**
1. Ensure MongoDB connection is working
2. Check database name in connection string
3. Try running again: `npm run seed`

---

## 📦 Dependencies Overview

### Backend

```json
{
  "express": "REST API framework",
  "mongoose": "MongoDB database ODM",
  "bcryptjs": "Password hashing",
  "jsonwebtoken": "JWT authentication",
  "dotenv": "Environment variables",
  "cors": "Cross-origin requests",
  "nodemailer": "Email sending (optional)"
}
```

### Frontend

```json
{
  "react": "UI library",
  "react-router-dom": "Client-side routing",
  "axios": "HTTP client",
  "@mui/material": "UI components",
  "react-hot-toast": "Notifications",
  "vite": "Build tool"
}
```

---

## 🔒 Security Notes

⚠️ **For Development Only:**

- Keep JWT_SECRET secure in production
- Use strong MongoDB password
- Enable 2FA on MongoDB Atlas
- Use environment variables for all secrets
- Never commit `.env` file to git

---

## 📞 Support

If you encounter issues:

1. **Check Browser Console**: F12 → Console tab
2. **Check Terminal Errors**: Look at backend/frontend terminal output
3. **Verify Configuration**: Check all .env files
4. **Clear Cache**: Ctrl+Shift+Delete in browser
5. **Restart Servers**: Kill and restart both

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Node.js and npm installed
- [ ] MongoDB Atlas cluster created
- [ ] Connection string obtained
- [ ] Backend dependencies installed
- [ ] Backend .env configured
- [ ] Database seeded
- [ ] Backend running on port 5000
- [ ] Frontend dependencies installed
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000/
- [ ] Can login with demo credentials
- [ ] Admin dashboard loads
- [ ] Client dashboard loads
- [ ] Services display on frontend

---

## 🎓 Next Steps

After successful setup:

1. **Explore the Code**: Understand project structure
2. **Customize UI**: Modify colors and styles
3. **Add Features**: Implement additional functionality
4. **Connect to Email**: Setup Nodemailer
5. **Deploy**: Follow deployment guide in README.md

---

**Happy Coding! 🚀**
