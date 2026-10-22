import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const icons = {
    success: '✅',
    error: '⚠️',
    info: 'ℹ️',
    warning: '🔔',
  };

  return (
    <div className={`alert alert-${type}`}>
      <span className="alert-icon">{icons[type] || 'ℹ️'}</span>
      <span className="alert-message">{message}</span>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close alert">
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
