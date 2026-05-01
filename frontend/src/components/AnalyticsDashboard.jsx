import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [users, inquiries, services, blogs, projects] = await Promise.all([
        fetch('http://localhost:5000/api/auth/users/stats/overview', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/inquiries/stats/overview', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/services/stats/overview', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/blogs/stats/overview', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/projects/stats/overview', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const usersData = await users.json();
      const inquiriesData = await inquiries.json();
      const servicesData = await services.json();
      const blogsData = await blogs.json();
      const projectsData = await projects.json();

      setStats({
        users: usersData.stats,
        inquiries: inquiriesData.stats,
        services: servicesData.stats,
        blogs: blogsData.stats,
        projects: projectsData.stats,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <div className="date-range-selector">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {stats && (
        <div className="stats-grid">
          {/* Users Stats */}
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.users?.total || 0}</p>
              <div className="stat-breakdown">
                <span>Admins: {stats.users?.admins || 0}</span>
                <span>Clients: {stats.users?.clients || 0}</span>
              </div>
            </div>
          </div>

          {/* Inquiries Stats */}
          <div className="stat-card">
            <div className="stat-icon">📧</div>
            <div className="stat-content">
              <h3>Total Inquiries</h3>
              <p className="stat-value">{stats.inquiries?.total || 0}</p>
              <div className="stat-breakdown">
                <span>Pending: {stats.inquiries?.pending || 0}</span>
                <span>Resolved: {stats.inquiries?.resolved || 0}</span>
              </div>
            </div>
          </div>

          {/* Services Stats */}
          <div className="stat-card">
            <div className="stat-icon">🛠️</div>
            <div className="stat-content">
              <h3>Total Services</h3>
              <p className="stat-value">{stats.services?.total || 0}</p>
              <div className="stat-breakdown">
                <span>Active: {stats.services?.active || 0}</span>
              </div>
            </div>
          </div>

          {/* Blogs Stats */}
          <div className="stat-card">
            <div className="stat-icon">📰</div>
            <div className="stat-content">
              <h3>Total Blogs</h3>
              <p className="stat-value">{stats.blogs?.total || 0}</p>
              <div className="stat-breakdown">
                <span>Published: {stats.blogs?.published || 0}</span>
              </div>
            </div>
          </div>

          {/* Projects Stats */}
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>Total Projects</h3>
              <p className="stat-value">{stats.projects?.total || 0}</p>
              <div className="stat-breakdown">
                <span>Completed: {stats.projects?.completed || 0}</span>
                <span>In Progress: {stats.projects?.inProgress || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
