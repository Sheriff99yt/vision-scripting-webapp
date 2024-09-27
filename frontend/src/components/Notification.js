// src/Notification.js
import React, { useEffect } from "react";
import "./Notification.css"; // Ensure this path is correct

const Notification = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000); // Automatically dismiss after 3 seconds

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="notification">
      {message}
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  );
};

export default Notification;
