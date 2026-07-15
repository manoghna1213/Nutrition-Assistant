import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContext } from '../context/ToastContext';

const CreateMealPlan = () => {
  const { showToast } = useContext(ToastContext);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve client ID from query string if available
  const queryParams = new URLSearchParams(location.search);
  const queryClientId = queryParams.get('clientId') || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      clientId: queryClientId,
      breakfast: '',
      lunch: '',
      dinner: '',
      snacks: '',
      calories: '',
      protein: '',
      carbohydrates: '',
      fats: '',
      fiber: '',
      waterGoal: 2000,
      notes: ''
    }
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get('/dietitian/clients');
        if (res.data.success) {
          setClients(res.data.data);
          // If query string matches a client, set value explicitly
          if (queryClientId) {
            setValue('clientId', queryClientId);
          }
        }
      } catch (err) {
        showToast('Error loading active client roster', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [queryClientId, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        calories: parseFloat(data.calories),
        protein: data.protein ? parseFloat(data.protein) : 0,
        carbohydrates: data.carbohydrates ? parseFloat(data.carbohydrates) : 0,
        fats: data.fats ? parseFloat(data.fats) : 0,
        fiber: data.fiber ? parseFloat(data.fiber) : 0,
        waterGoal: parseFloat(data.waterGoal)
      };

      const res = await axios.post('/mealplans', payload);
      setLoading(false);

      if (res.data.success) {
        showToast('Meal plan created and assigned successfully!', 'success');
        navigate('/');
      }
    } catch (err) {
      setLoading(false);
      showToast(err.response?.data?.message || 'Error constructing meal plan', 'danger');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading Plan Editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in-element">
      <div className="mb-4">
        <h2 className="fw-extrabold mb-1 text-primary">Create Meal Plan</h2>
        <p className="text-secondary">Draft daily meals and target metrics for your assigned client.</p>
      </div>

      <div className="glass-panel p-4 max-width-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            {/* Select Client */}
            <div className="col-md-6 mb-3">
              <label htmlFor="clientId" className="form-label text-secondary small fw-bold">Select Client</label>
              <select
                id="clientId"
                className={`form-select custom-input ${errors.clientId ? 'is-invalid' : ''}`}
                {...register('clientId', { required: 'Please select a client' })}
              >
                <option value="">-- Choose Client --</option>
                {clients.map(client => (
                  <option key={client._id} value={client.userId?._id}>
                    {client.userId?.name} ({client.userId?.dietaryPreference || 'None'} Pref)
                  </option>
                ))}
              </select>
              {errors.clientId && <div className="invalid-feedback">{errors.clientId.message}</div>}
            </div>

            {/* Calories Goal */}
            <div className="col-md-6 mb-3">
              <label htmlFor="calories" className="form-label text-secondary small fw-bold">Target Calories (kcal)</label>
              <input
                id="calories"
                type="number"
                className={`form-control custom-input ${errors.calories ? 'is-invalid' : ''}`}
                placeholder="e.g. 1800"
                {...register('calories', { required: 'Calories goal is required' })}
              />
              {errors.calories && <div className="invalid-feedback">{errors.calories.message}</div>}
            </div>

            {/* Breakfast Textarea */}
            <div className="col-12 mb-3">
              <label htmlFor="breakfast" className="form-label text-secondary small fw-bold">Breakfast Menu</label>
              <textarea
                id="breakfast"
                rows="3"
                className={`form-control custom-input ${errors.breakfast ? 'is-invalid' : ''}`}
                placeholder="Prescribe breakfast meal details..."
                {...register('breakfast', { required: 'Breakfast guide is required' })}
              ></textarea>
              {errors.breakfast && <div className="invalid-feedback">{errors.breakfast.message}</div>}
            </div>

            {/* Lunch Textarea */}
            <div className="col-12 mb-3">
              <label htmlFor="lunch" className="form-label text-secondary small fw-bold">Lunch Menu</label>
              <textarea
                id="lunch"
                rows="3"
                className={`form-control custom-input ${errors.lunch ? 'is-invalid' : ''}`}
                placeholder="Prescribe lunch meal details..."
                {...register('lunch', { required: 'Lunch guide is required' })}
              ></textarea>
              {errors.lunch && <div className="invalid-feedback">{errors.lunch.message}</div>}
            </div>

            {/* Dinner Textarea */}
            <div className="col-12 mb-3">
              <label htmlFor="dinner" className="form-label text-secondary small fw-bold">Dinner Menu</label>
              <textarea
                id="dinner"
                rows="3"
                className={`form-control custom-input ${errors.dinner ? 'is-invalid' : ''}`}
                placeholder="Prescribe dinner meal details..."
                {...register('dinner', { required: 'Dinner guide is required' })}
              ></textarea>
              {errors.dinner && <div className="invalid-feedback">{errors.dinner.message}</div>}
            </div>

            {/* Snacks Textarea */}
            <div className="col-12 mb-3">
              <label htmlFor="snacks" className="form-label text-secondary small fw-bold">Snacks & Extras</label>
              <textarea
                id="snacks"
                rows="2"
                className="form-control custom-input"
                placeholder="Snack options (e.g. Greek yogurt with nuts)..."
                {...register('snacks')}
              ></textarea>
            </div>

            {/* Protein, Carbs, Fats, Fiber, Water Goals */}
            <div className="col-6 col-md-4">
              <label htmlFor="protein" className="form-label text-secondary small fw-bold">Target Protein (g)</label>
              <input
                id="protein"
                type="number"
                className="form-control custom-input"
                placeholder="e.g. 70"
                {...register('protein')}
              />
            </div>
            <div className="col-6 col-md-4">
              <label htmlFor="carbohydrates" className="form-label text-secondary small fw-bold">Target Carbs (g)</label>
              <input
                id="carbohydrates"
                type="number"
                className="form-control custom-input"
                placeholder="e.g. 210"
                {...register('carbohydrates')}
              />
            </div>
            <div className="col-6 col-md-4">
              <label htmlFor="fats" className="form-label text-secondary small fw-bold">Target Fats (g)</label>
              <input
                id="fats"
                type="number"
                className="form-control custom-input"
                placeholder="e.g. 50"
                {...register('fats')}
              />
            </div>
            <div className="col-6 col-md-6">
              <label htmlFor="fiber" className="form-label text-secondary small fw-bold">Target Fiber (g)</label>
              <input
                id="fiber"
                type="number"
                className="form-control custom-input"
                placeholder="e.g. 35"
                {...register('fiber')}
              />
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="waterGoal" className="form-label text-secondary small fw-bold">Daily Water Target (ml)</label>
              <input
                id="waterGoal"
                type="number"
                className="form-control custom-input"
                placeholder="e.g. 2500"
                {...register('waterGoal')}
              />
            </div>

            {/* Notes */}
            <div className="col-12 mb-3">
              <label htmlFor="notes" className="form-label text-secondary small fw-bold">Additional Recommendations</label>
              <textarea
                id="notes"
                rows="2"
                className="form-control custom-input"
                placeholder="E.g. Avoid sugar, take iron supplements..."
                {...register('notes')}
              ></textarea>
            </div>
          </div>

          <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2" style={{ borderColor: 'var(--border-color)' }}>
            <button type="button" onClick={() => navigate('/')} className="btn btn-outline-secondary px-4">Cancel</button>
            <button type="submit" className="btn btn-primary-custom px-4">Assign Diet Plan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMealPlan;
