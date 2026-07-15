import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

const UserProgress = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calcBmi, setCalcBmi] = useState({ height: user.height || '', weight: user.weight || '', result: user.bmi || 0 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      weight: user.weight || '',
      caloriesConsumed: '',
      proteinConsumed: '',
      carbsConsumed: '',
      fatsConsumed: '',
      waterConsumed: '',
      exercise: ''
    }
  });

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/progress');
      if (res.data.success) {
        setLogs(res.data.data.reverse()); // Newest logs first
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        weight: data.weight ? parseFloat(data.weight) : undefined,
        caloriesConsumed: data.caloriesConsumed ? parseFloat(data.caloriesConsumed) : 0,
        proteinConsumed: data.proteinConsumed ? parseFloat(data.proteinConsumed) : 0,
        carbsConsumed: data.carbsConsumed ? parseFloat(data.carbsConsumed) : 0,
        fatsConsumed: data.fatsConsumed ? parseFloat(data.fatsConsumed) : 0,
        waterConsumed: data.waterConsumed ? parseFloat(data.waterConsumed) : 0,
        exercise: data.exercise ? parseFloat(data.exercise) : 0
      };

      const res = await axios.post('/progress', payload);
      if (res.data.success) {
        showToast('Daily stats registered successfully', 'success');
        fetchLogs();
        reset({
          date: new Date().toISOString().split('T')[0],
          weight: data.weight || user.weight || '',
          caloriesConsumed: '',
          proteinConsumed: '',
          carbsConsumed: '',
          fatsConsumed: '',
          waterConsumed: '',
          exercise: ''
        });
      }
    } catch (err) {
      showToast('Error registering tracking log', 'danger');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return;
    try {
      const res = await axios.delete(`/progress/${id}`);
      if (res.data.success) {
        showToast('Record deleted successfully', 'success');
        fetchLogs();
      }
    } catch (err) {
      showToast('Error removing log', 'danger');
    }
  };

  const handleBmiCalculate = (e) => {
    e.preventDefault();
    const h = parseFloat(calcBmi.height) / 100;
    const w = parseFloat(calcBmi.weight);
    if (!h || !w) return;
    const calculated = (w / (h * h)).toFixed(1);
    setCalcBmi(prev => ({ ...prev, result: calculated }));
  };

  return (
    <div className="fade-in-element">
      <div className="mb-4">
        <h2 className="fw-extrabold mb-1 text-primary">Log Daily Meals & Progress</h2>
        <p className="text-secondary">Keep an active record of your diet, water, weight changes, and gym efforts.</p>
      </div>

      <div className="row g-4 mb-5">
        {/* Left Form: Log Inputs */}
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-4 animate-fade-in">
            <h5 className="fw-bold mb-4 text-primary"><i className="bi bi-calendar-check-fill text-success me-2"></i>Log Nutrients & Fitness</h5>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                {/* Date */}
                <div className="col-md-6">
                  <label htmlFor="date" className="form-label text-secondary small fw-bold">Date</label>
                  <input
                    id="date"
                    type="date"
                    className={`form-control custom-input ${errors.date ? 'is-invalid' : ''}`}
                    {...register('date', { required: 'Date is required' })}
                  />
                  {errors.date && <div className="invalid-feedback">{errors.date.message}</div>}
                </div>

                {/* Weight */}
                <div className="col-md-6">
                  <label htmlFor="weight" className="form-label text-secondary small fw-bold">Weight today (kg)</label>
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    className="form-control custom-input"
                    placeholder="e.g. 68.5"
                    {...register('weight')}
                  />
                </div>

                {/* Calories */}
                <div className="col-md-4">
                  <label htmlFor="caloriesConsumed" className="form-label text-secondary small fw-bold">Calories (kcal)</label>
                  <input
                    id="caloriesConsumed"
                    type="number"
                    className="form-control custom-input"
                    placeholder="e.g. 450"
                    {...register('caloriesConsumed')}
                  />
                </div>

                {/* Protein */}
                <div className="col-md-4">
                  <label htmlFor="proteinConsumed" className="form-label text-secondary small fw-bold">Protein (g)</label>
                  <input
                    id="proteinConsumed"
                    type="number"
                    className="form-control custom-input"
                    placeholder="e.g. 25"
                    {...register('proteinConsumed')}
                  />
                </div>

                {/* Carbs */}
                <div className="col-md-4">
                  <label htmlFor="carbsConsumed" className="form-label text-secondary small fw-bold">Carbs (g)</label>
                  <input
                    id="carbsConsumed"
                    type="number"
                    className="form-control custom-input"
                    placeholder="e.g. 50"
                    {...register('carbsConsumed')}
                  />
                </div>

                {/* Fats */}
                <div className="col-md-4">
                  <label htmlFor="fatsConsumed" className="form-label text-secondary small fw-bold">Fats (g)</label>
                  <input
                    id="fatsConsumed"
                    type="number"
                    className="form-control custom-input"
                    placeholder="e.g. 15"
                    {...register('fatsConsumed')}
                  />
                </div>

                {/* Water */}
                <div className="col-md-4">
                  <label htmlFor="waterConsumed" className="form-label text-secondary small fw-bold">Water (ml)</label>
                  <input
                    id="waterConsumed"
                    type="number"
                    className="form-control custom-input"
                    placeholder="e.g. 250"
                    {...register('waterConsumed')}
                  />
                </div>

                {/* Exercise */}
                <div className="col-md-4">
                  <label htmlFor="exercise" className="form-label text-secondary small fw-bold">Exercise (mins)</label>
                  <input
                    id="exercise"
                    type="number"
                    className="form-control custom-input"
                    placeholder="e.g. 30"
                    {...register('exercise')}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-top d-flex justify-content-end" style={{ borderColor: 'var(--border-color)' }}>
                <button type="submit" className="btn btn-primary-custom px-4" disabled={loading}>
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right side: calculators */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4 mb-4">
            <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-calculator-fill text-info me-2"></i>BMI Calculator</h5>
            <form onSubmit={handleBmiCalculate}>
              <div className="mb-2">
                <label className="form-label small text-secondary">Height (cm)</label>
                <input 
                  type="number" 
                  className="form-control custom-input form-control-sm" 
                  value={calcBmi.height} 
                  onChange={(e) => setCalcBmi(prev => ({ ...prev, height: e.target.value }))}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small text-secondary">Weight (kg)</label>
                <input 
                  type="number" 
                  className="form-control custom-input form-control-sm" 
                  value={calcBmi.weight} 
                  onChange={(e) => setCalcBmi(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>
              <button type="submit" className="btn btn-outline-info btn-sm w-100 mb-3">Calculate BMI</button>
              {calcBmi.result > 0 && (
                <div className="text-center bg-secondary p-2 rounded">
                  <small className="text-secondary d-block">Resulting BMI:</small>
                  <span className="fw-bold text-primary fs-5">{calcBmi.result}</span>
                  <small className="text-secondary d-block mt-1">
                    ({calcBmi.result < 18.5 ? 'Underweight' :
                      calcBmi.result < 25 ? 'Normal weight' :
                      calcBmi.result < 30 ? 'Overweight' : 'Obese'})
                  </small>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="glass-panel p-4">
        <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-clock-history text-secondary me-2"></i>Logs History</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle" style={{ color: 'var(--text-primary)' }}>
            <thead>
              <tr style={{ borderColor: 'var(--border-color)' }}>
                <th>Date</th>
                <th>Weight</th>
                <th>Calories</th>
                <th>Carbs/Pro/Fat</th>
                <th>Water</th>
                <th>Exercise</th>
                <th>Adherence</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map(log => (
                  <tr key={log._id} style={{ borderColor: 'var(--border-color)' }}>
                    <td className="fw-bold">{log.date}</td>
                    <td>{log.weight ? `${log.weight} kg` : '-'}</td>
                    <td>{log.caloriesConsumed} kcal</td>
                    <td>
                      <small className="text-secondary">
                        C: {log.carbsConsumed}g | P: {log.proteinConsumed}g | F: {log.fatsConsumed}g
                      </small>
                    </td>
                    <td>{log.waterConsumed} ml</td>
                    <td>{log.exercise} mins</td>
                    <td>
                      <span className={`badge ${
                        log.adherencePercentage > 80 ? 'bg-success' :
                        log.adherencePercentage > 50 ? 'bg-warning text-dark' : 'bg-danger'
                      }`}>
                        {log.adherencePercentage}%
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(log._id)} className="btn btn-outline-danger btn-sm border-0">
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-secondary py-4">No daily logs registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserProgress;
