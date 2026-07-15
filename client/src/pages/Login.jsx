import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

const Login = () => {
  const { login } = useContext(AuthContext);
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
    const result = await login(data.email, data.password);
    setLoading(false);

    if (result && result.success) {
      showToast('Logged in successfully', 'success');
      navigate('/');
    } else {
      showToast(result?.message || 'Invalid email or password', 'danger');
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
          <p className="text-secondary small mt-2">Log in to track your meals and nutrition goals</p>
        </div>

        {/* Login Panel */}
        <div className="glass-panel p-4" style={{ border: '2px solid var(--border-color)' }}>
          <h4 className="fw-bold mb-4 text-primary text-center">Welcome Back</h4>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-secondary small fw-bold">Email Address</label>
              <input
                id="email"
                type="email"
                className={`form-control custom-input ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Enter email (e.g. user1@nutrition.com)"
                {...register('email', {
                  required: 'Email address is required',
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

            {/* Password Field */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label htmlFor="password" className="form-label text-secondary small fw-bold mb-0">Password</label>
                <Link to="/forgot-password" style={{ color: 'var(--accent-color)', fontSize: '0.8rem', textDecoration: 'none' }}>
                  Forgot Password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                className={`form-control custom-input ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter password (e.g. user123)"
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

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary-custom w-100 mt-2 py-2 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <i className="bi bi-box-arrow-in-right"></i>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Create Account prompt */}
        <p className="text-center text-secondary small mt-4">
          New to Wellness Hub?{' '}
          <Link to="/register" style={{ color: 'var(--accent-color)', fontWeight: '600', textDecoration: 'none' }}>
            Create an Account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
