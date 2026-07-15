import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

const UserProfile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: user.name,
      phone: user.phone || '',
      gender: user.gender || '',
      age: user.age || '',
      height: user.height || '',
      weight: user.weight || '',
      calorieGoal: user.calorieGoal || '',
      dietaryPreference: user.dietaryPreference || 'None',
      profileImage: user.profileImage || ''
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    // Parse numeric fields
    const parsedData = {
      ...data,
      age: data.age ? parseInt(data.age) : undefined,
      height: data.height ? parseFloat(data.height) : undefined,
      weight: data.weight ? parseFloat(data.weight) : undefined,
      calorieGoal: data.calorieGoal ? parseInt(data.calorieGoal) : undefined
    };

    const result = await updateProfile(parsedData);
    setLoading(false);

    if (result && result.success) {
      showToast('Profile and health metrics updated successfully', 'success');
    } else {
      showToast(result?.message || 'Error updating profile', 'danger');
    }
  };

  return (
    <div className="fade-in-element">
      <div className="mb-4">
        <h2 className="fw-extrabold mb-1 text-primary">My Profile</h2>
        <p className="text-secondary">Update your contact information and health metrics to align your targets.</p>
      </div>

      <div className="row g-4">
        {/* Left column: Summary */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4 text-center">
            <div 
              className="rounded-circle bg-success text-white d-flex justify-content-center align-items-center text-uppercase fw-bold mx-auto mb-3"
              style={{ width: '90px', height: '90px', fontSize: '2.5rem' }}
            >
              {user.name.charAt(0)}
            </div>
            <h4 className="fw-bold text-primary mb-1">{user.name}</h4>
            <span className="badge bg-success text-white mb-3 px-3 py-2" style={{ fontSize: '0.85rem' }}>{user.role}</span>
            
            <div className="border-top pt-3 text-start small d-flex flex-column gap-2" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <strong className="text-primary d-block">Email Address:</strong>
                <span className="text-secondary">{user.email}</span>
              </div>
              <div>
                <strong className="text-primary d-block">Phone Number:</strong>
                <span className="text-secondary">{user.phone || 'Not provided'}</span>
              </div>
              {user.role === 'User' && (
                <>
                  <div>
                    <strong className="text-primary d-block">Calculated BMI:</strong>
                    <span className="text-secondary">{user.bmi || 'Not computed'}</span>
                  </div>
                  <div>
                    <strong className="text-primary d-block">Target Daily Calories:</strong>
                    <span className="text-secondary">{user.calorieGoal || 2000} kcal</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Edit Profile Form */}
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-4">
            <h5 className="fw-bold mb-4 text-primary"><i className="bi bi-gear-fill me-2 text-success"></i>Account & Metric Settings</h5>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                {/* Name */}
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label text-secondary small fw-bold">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    className={`form-control custom-input ${errors.name ? 'is-invalid' : ''}`}
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name.message}</div>
                  )}
                </div>

                {/* Phone */}
                <div className="col-md-6">
                  <label htmlFor="phone" className="form-label text-secondary small fw-bold">Phone Number</label>
                  <input
                    id="phone"
                    type="text"
                    className="form-control custom-input"
                    {...register('phone')}
                  />
                </div>

                {user.role === 'User' && (
                  <>
                    <h5 className="fw-bold border-top pt-3 mt-4 mb-2 text-primary" style={{ borderColor: 'var(--border-color)' }}>
                      <i className="bi bi-heart-pulse-fill text-danger me-2"></i>Physical Health Metrics
                    </h5>

                    {/* Gender */}
                    <div className="col-md-4">
                      <label htmlFor="gender" className="form-label text-secondary small fw-bold">Gender</label>
                      <select id="gender" className="form-select custom-input" {...register('gender')}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Age */}
                    <div className="col-md-4">
                      <label htmlFor="age" className="form-label text-secondary small fw-bold">Age (Years)</label>
                      <input
                        id="age"
                        type="number"
                        className="form-control custom-input"
                        placeholder="e.g. 28"
                        {...register('age', { min: { value: 0, message: 'Age cannot be negative' } })}
                      />
                    </div>

                    {/* Dietary Preference */}
                    <div className="col-md-4">
                      <label htmlFor="dietaryPreference" className="form-label text-secondary small fw-bold">Diet Preference</label>
                      <select id="dietaryPreference" className="form-select custom-input" {...register('dietaryPreference')}>
                        <option value="None">None</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Keto">Keto</option>
                        <option value="Paleo">Paleo</option>
                        <option value="Gluten-Free">Gluten-Free</option>
                        <option value="Dairy-Free">Dairy-Free</option>
                      </select>
                    </div>

                    {/* Height */}
                    <div className="col-md-4">
                      <label htmlFor="height" className="form-label text-secondary small fw-bold">Height (cm)</label>
                      <input
                        id="height"
                        type="number"
                        step="0.1"
                        className="form-control custom-input"
                        placeholder="e.g. 175"
                        {...register('height', { min: { value: 0, message: 'Height cannot be negative' } })}
                      />
                    </div>

                    {/* Weight */}
                    <div className="col-md-4">
                      <label htmlFor="weight" className="form-label text-secondary small fw-bold">Weight (kg)</label>
                      <input
                        id="weight"
                        type="number"
                        step="0.1"
                        className="form-control custom-input"
                        placeholder="e.g. 68.5"
                        {...register('weight', { min: { value: 0, message: 'Weight cannot be negative' } })}
                      />
                    </div>

                    {/* Calorie Goal */}
                    <div className="col-md-4">
                      <label htmlFor="calorieGoal" className="form-label text-secondary small fw-bold">Daily Calorie Goal (kcal)</label>
                      <input
                        id="calorieGoal"
                        type="number"
                        className="form-control custom-input"
                        placeholder="e.g. 2000"
                        {...register('calorieGoal', { min: { value: 0, message: 'Calories cannot be negative' } })}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Submit panel */}
              <div className="mt-4 pt-3 border-top d-flex justify-content-end" style={{ borderColor: 'var(--border-color)' }}>
                <button
                  type="submit"
                  className="btn btn-primary-custom px-4 d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      Saving Metrics...
                    </>
                  ) : (
                    <>
                      Save Profile <i className="bi bi-save"></i>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
