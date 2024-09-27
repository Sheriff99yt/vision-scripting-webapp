// Notification.js
import React, { useEffect } from "react";
import "./Notification.css"; // You can style your notification component here

const Notification = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000); // Automatically dismiss after 3 seconds

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return <div className="notification">{message}</div>;
};

export default Notification;
