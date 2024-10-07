import React, { useState, useEffect, useCallback, useRef } from 'react';
import Notification from './Notification';

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const addNotificationRef = useRef();

  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration);
    }
  }, []);

  addNotificationRef.current = addNotification;

  useEffect(() => {
    window.addNotification = (...args) => addNotificationRef.current(...args);
    return () => {
      delete window.addNotification;
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className="notification-container">
      {notifications.map(({ id, message, type }) => (
        <Notification
          key={id}
          message={message}
          type={type}
          onClose={() => removeNotification(id)}
        />
      ))}
    </div>
  );
};

export default NotificationManager;