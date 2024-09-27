// Notification.js
import React from 'react';
import './Notification.css'; // Import the CSS for styling

const Notification = ({ message }) => {
    return (
        <div className="notification">
            {message}
        </div>
    );
};

export default Notification;
