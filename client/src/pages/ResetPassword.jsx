import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContext } from '../context/ToastContext';

const ResetPassword = () => {
  const { showToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const preFilledEmail = location.state?.email || '';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: preFilledEmail
    }
  });

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/reset-password', {
        email: data.email,
        password: data.password
      });
      setLoading(false);

      if (res.data.success) {
        showToast('Password reset successful! Please log in.', 'success');
        navigate('/login');
      }
    } catch (err) {
      setLoading(false);
      showToast(err.response?.data?.message || 'Error resetting password', 'danger');
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

        {/* Reset Panel */}
        <div className="glass-panel p-4" style={{ border: '2px solid var(--border-color)' }}>
          <h4 className="fw-bold mb-4 text-primary text-center">Set New Password</h4>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Address */}
            <div className="mb-3">
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

            {/* Simulated verification code input */}
            <div className="mb-3">
              <label htmlFor="code" className="form-label text-secondary small fw-bold">Simulated Pin Code</label>
              <input
                id="code"
                type="text"
                className="form-control custom-input"
                placeholder="Enter code shown in toast"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label text-secondary small fw-bold">New Password</label>
              <input
                id="password"
                type="password"
                className={`form-control custom-input ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Choose strong password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must consist of 6 or more characters'
                  }
                })}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password.message}</div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label htmlFor="passwordConfirm" className="form-label text-secondary small fw-bold">Confirm Password</label>
              <input
                id="passwordConfirm"
                type="password"
                className={`form-control custom-input ${errors.passwordConfirm ? 'is-invalid' : ''}`}
                placeholder="Repeat password"
                {...register('passwordConfirm', {
                  required: 'Password confirmation is required',
                  validate: (value) => value === passwordVal || 'Passwords do not match'
                })}
              />
              {errors.passwordConfirm && (
                <div className="invalid-feedback">{errors.passwordConfirm.message}</div>
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
                  Saving Password...
                </>
              ) : (
                <>
                  Save & Log In <i className="bi bi-shield-check"></i>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
