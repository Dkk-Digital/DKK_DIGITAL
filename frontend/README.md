# DKK Digital - Frontend

React + Vite + Material-UI frontend for DKK Digital Marketing

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

- `src/pages/` - Main page components
- `src/components/` - Reusable components
- `src/services/` - API service layer
- `src/context/` - State management (Auth)
- `src/styles/` - Global styles

## Pages

- **Home** - Landing page with hero section
- **Services** - Browse all services
- **About** - Company information
- **Contact** - Contact form
- **Blog** - Blog listing
- **Blog Detail** - Individual blog post
- **Login** - User login
- **Register** - User registration
- **Admin Dashboard** - Admin panel
- **Client Dashboard** - Client panel
- **Profile** - User profile

## Features

- ✅ Responsive design
- ✅ Light theme UI (white/soft colors)
- ✅ Material-UI components
- ✅ JWT authentication
- ✅ Role-based access (admin/client)
- ✅ Context API for state
- ✅ Toast notifications
- ✅ Form validation
- ✅ Protected routes

## API Integration

API calls are made through services in `src/services/`:

```javascript
import { authService, serviceService, projectService } from './services';

// Login
const response = await authService.login({ email, password });

// Get services
const response = await serviceService.getAll();

// Create project
const response = await projectService.create(projectData);
```

## Authentication

Token is stored in localStorage and sent with each request.
Auth state is managed through AuthContext.

```javascript
import { useAuth } from './context/AuthContext';

const { user, token, login, logout } = useAuth();
```

## Building for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview

# Output in dist/ directory
```

## Environment Variables

See `.env.example`

Key variables:
- `VITE_API_URL` - Backend API URL

## Styling

Using Material-UI theming system with light theme:
- Primary: #1976d2 (Blue)
- Background: White (#ffffff)
- Text: Dark (#333)

## Component Hierarchy

```
App
├── Router
├── AuthProvider
├── Toaster
└── Routes
    ├── Layout
    │   ├── Navbar
    │   ├── Page
    │   └── Footer
    └── ProtectedRoute
        └── Dashboard
```

## Development Tips

1. **Debug API calls**: Check Network tab in DevTools
2. **State debugging**: Install React DevTools
3. **Hot reload**: Changes auto-reload (Vite)
4. **Console errors**: Check browser console

## Component Examples

### Protected Page
```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

### Using API Services
```jsx
const [data, setData] = useState([]);

useEffect(() => {
  const fetch = async () => {
    const res = await serviceService.getAll();
    setData(res.data.services);
  };
  fetch();
}, []);
```

---

See main README.md for complete documentation.
