import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

const Register = () => {
  const { register: signup } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      role: 'User'
    }
  });

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await signup(data.name, data.email, data.password, data.role, data.phone);
    setLoading(false);

    if (result && result.success) {
      showToast('Registration successful! Welcome.', 'success');
      navigate('/');
    } else {
      showToast(result?.message || 'Registration failed, please check inputs', 'danger');
    }
  };

  return (
    <div className="fade-in-element min-vh-100 d-flex align-items-center justify-content-center px-3 py-5" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-100" style={{ maxValue: '460px', maxWidth: '460px' }}>
        
        {/* Branding header */}
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none">
            <div className="bg-success text-white p-2 rounded d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-heart-pulse-fill fs-5"></i>
            </div>
            <span className="fw-extrabold fs-4 text-primary">Nutrition Assistant</span>
          </Link>
          <p className="text-secondary small mt-2">Create an account to personalize your diet charts</p>
        </div>

        {/* Register Panel */}
        <div className="glass-panel p-4" style={{ border: '2px solid var(--border-color)' }}>
          <h4 className="fw-bold mb-4 text-primary text-center">Get Started</h4>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label text-secondary small fw-bold">Full Name</label>
              <input
                id="name"
                type="text"
                className={`form-control custom-input ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Enter full name"
                {...register('name', { required: 'Full name is required' })}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </div>

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

            {/* Phone Number */}
            <div className="mb-3">
              <label htmlFor="phone" className="form-label text-secondary small fw-bold">Phone Number</label>
              <input
                id="phone"
                type="text"
                className={`form-control custom-input ${errors.phone ? 'is-invalid' : ''}`}
                placeholder="Enter phone number"
                {...register('phone', {
                  required: 'Phone number is required',
                  minLength: {
                    value: 10,
                    message: 'Phone number must be at least 10 digits'
                  }
                })}
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone.message}</div>
              )}
            </div>

            {/* Role Selection */}
            <div className="mb-3">
              <label className="form-label text-secondary small fw-bold">I want to register as a:</label>
              <div className="d-flex gap-3">
                <div className="form-check flex-fill bg-secondary p-2 px-3 rounded border" style={{ borderColor: 'var(--border-color)' }}>
                  <input
                    className="form-check-input ms-0 me-2"
                    type="radio"
                    id="roleUser"
                    value="User"
                    {...register('role')}
                  />
                  <label className="form-check-label fw-semibold text-primary" htmlFor="roleUser">
                    User (Client)
                  </label>
                </div>
                <div className="form-check flex-fill bg-secondary p-2 px-3 rounded border" style={{ borderColor: 'var(--border-color)' }}>
                  <input
                    className="form-check-input ms-0 me-2"
                    type="radio"
                    id="roleDietitian"
                    value="Dietitian"
                    {...register('role')}
                  />
                  <label className="form-check-label fw-semibold text-primary" htmlFor="roleDietitian">
                    Dietitian
                  </label>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label text-secondary small fw-bold">Password</label>
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

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary-custom w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Register <i className="bi bi-person-plus-fill"></i>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Redirect prompt */}
        <p className="text-center text-secondary small mt-4">
          Already registered?{' '}
          <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: '600', textDecoration: 'none' }}>
            Log In here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
