import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/NotificationCenter.css';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // This would typically fetch from an API or WebSocket
    // For now, we'll use localStorage to simulate notifications
    const stored = localStorage.getItem('notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    return true;
  });

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h1>Notification Center</h1>
        <div className="notification-controls">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread</option>
          </select>
          <button onClick={handleClearAll} className="btn-clear">
            Clear All
          </button>
        </div>
      </div>

      <div className="notification-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item notification-${notif.type} ${notif.read ? 'read' : 'unread'}`}
            >
              <div className="notification-icon">{notif.icon}</div>
              <div className="notification-body">
                <h3>{notif.title}</h3>
                <p>{notif.message}</p>
                <span className="notification-time">
                  {new Date(notif.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="notification-actions">
                {!notif.read && (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="btn-read"
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
                <button
                  onClick={() => handleDeleteNotification(notif.id)}
                  className="btn-delete"
                  title="Delete notification"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state">No notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
