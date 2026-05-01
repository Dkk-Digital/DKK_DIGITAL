import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivity = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}/activity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setActivityLogs(data.logs);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewActivity = (user) => {
    setSelectedUser(user);
    fetchUserActivity(user._id);
    setShowActivityModal(true);
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setUsers(users.filter((u) => u._id !== userId));
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h1>User Management</h1>
        <div className="management-controls">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="client">Client</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                    className={`role-select role-${user.role}`}
                  >
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="actions">
                  <button
                    onClick={() => handleViewActivity(user)}
                    className="btn-view"
                    title="View Activity"
                  >
                    Activity
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="btn-delete"
                    title="Delete User"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showActivityModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowActivityModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Activity Log - {selectedUser.name}</h2>
              <button className="modal-close" onClick={() => setShowActivityModal(false)}>
                ✕
              </button>
            </div>
            <div className="activity-list">
              {activityLogs.length > 0 ? (
                activityLogs.map((log, idx) => (
                  <div key={idx} className={`activity-item activity-${log.status}`}>
                    <div className="activity-action">{log.action}</div>
                    <div className="activity-time">
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                    {log.details && (
                      <div className="activity-details">{JSON.stringify(log.details)}</div>
                    )}
                  </div>
                ))
              ) : (
                <p>No activity logs available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
