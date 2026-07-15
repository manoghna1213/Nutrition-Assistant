import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContext } from '../context/ToastContext';

const ForgotPassword = () => {
  const { showToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/forgot-password', { email: data.email });
      setLoading(false);
      
      if (res.data.success) {
        // Show success and output the simulation code for easier testing
        showToast(`Simulated reset code generated: ${res.data.resetCode}`, 'info', 8000);
        showToast('Password reset requested successfully', 'success');
        
        // Pass email as state to the reset-password page for convenience
        navigate('/reset-password', { state: { email: data.email } });
      }
    } catch (err) {
      setLoading(false);
      showToast(err.response?.data?.message || 'Error occurred requesting code', 'danger');
    }
  };

  return (
    <div className="fade-in-element min-vh-100 d-flex align-items-center justify-content-center px-3" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-100" style={{ maxValue: '420px', maxWidth: '420px' }}>
        
        {/* Branding header */}
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none">
            <div className="bg-success text-white p-2 rounded d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-heart-pulse-fill fs-5"></i>
            </div>
            <span className="fw-extrabold fs-4 text-primary">Nutrition Assistant</span>
          </Link>
        </div>

        {/* Forgot Panel */}
        <div className="glass-panel p-4" style={{ border: '2px solid var(--border-color)' }}>
          <h4 className="fw-bold text-primary text-center">Reset Password</h4>
          <p className="text-secondary text-center small mb-4">Enter your registered email address and we will supply a simulated recovery pin code.</p>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="email" className="form-label text-secondary small fw-bold">Email Address</label>
              <input
                id="email"
                type="email"
                className={`form-control custom-input ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Enter email address"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    message: 'Please specify a valid email address'
                  }
                })}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary-custom w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Sending code...
                </>
              ) : (
                <>
                  Request Code <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-secondary small mt-4">
          <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: '600', textDecoration: 'none' }}>
            <i className="bi bi-arrow-left me-1"></i> Return to Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;
