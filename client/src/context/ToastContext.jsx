import React, { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Trigger a new toast alert
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Render Portal Container */}
      <div 
        className="toast-container position-fixed bottom-0 end-0 p-3" 
        style={{ zIndex: 1080 }}
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast show align-items-center text-white border-0 mb-2 fade-in-element ${
              toast.type === 'success' ? 'bg-success' :
              toast.type === 'danger' ? 'bg-danger' :
              toast.type === 'warning' ? 'bg-warning text-dark' : 'bg-primary'
            }`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{ borderRadius: '10px' }}
          >
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-2">
                <i className={`bi ${
                  toast.type === 'success' ? 'bi-check-circle-fill' :
                  toast.type === 'danger' ? 'bi-exclamation-triangle-fill' :
                  toast.type === 'warning' ? 'bi-exclamation-circle-fill' : 'bi-info-circle-fill'
                }`}></i>
                {toast.message}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => removeToast(toast.id)}
                aria-label="Close"
              ></button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
