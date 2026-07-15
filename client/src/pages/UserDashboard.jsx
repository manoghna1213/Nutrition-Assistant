import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
  LineChart, Line
} from 'recharts';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  
  const [logs, setLogs] = useState([]);
  const [mealPlan, setMealPlan] = useState(null);
  const [todayLog, setTodayLog] = useState({
    caloriesConsumed: 0,
    waterConsumed: 0,
    proteinConsumed: 0,
    carbsConsumed: 0,
    fatsConsumed: 0,
    exercise: 0
  });
  const [loading, setLoading] = useState(true);

  // Quick inputs
  const [quickCal, setQuickCal] = useState('');
  const [quickWater, setQuickWater] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch progress logs
        const logsRes = await axios.get('/progress');
        if (logsRes.data.success) {
          setLogs(logsRes.data.data);
          
          // Find if there is a log for today
          const todayEntry = logsRes.data.data.find(l => l.date === todayStr);
          if (todayEntry) {
            setTodayLog(todayEntry);
          }
        }

        // Fetch latest meal plan to see calorie goal
        const planRes = await axios.get('/mealplans');
        if (planRes.data.success && planRes.data.data.length > 0) {
          setMealPlan(planRes.data.data[0]);
        }
      } catch (err) {
        console.error('Error fetching dashboard datasets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, todayStr]);

  const handleQuickLog = async (e, type) => {
    e.preventDefault();
    const value = type === 'calories' ? parseFloat(quickCal) : parseFloat(quickWater);
    if (!value || value <= 0) return;

    try {
      const updateData = {
        date: todayStr,
        caloriesConsumed: type === 'calories' ? (todayLog.caloriesConsumed + value) : todayLog.caloriesConsumed,
        waterConsumed: type === 'water' ? (todayLog.waterConsumed + value) : todayLog.waterConsumed,
        // Carry forward other values
        proteinConsumed: todayLog.proteinConsumed,
        carbsConsumed: todayLog.carbsConsumed,
        fatsConsumed: todayLog.fatsConsumed,
        weight: user.weight,
        exercise: todayLog.exercise
      };

      const res = await axios.post('/progress', updateData);
      if (res.data.success) {
        setTodayLog(res.data.data);
        
        // Refresh logs list for charts
        const logsRes = await axios.get('/progress');
        if (logsRes.data.success) setLogs(logsRes.data.data);

        showToast(`${type === 'calories' ? 'Calories' : 'Water'} logged successfully!`, 'success');
        if (type === 'calories') setQuickCal('');
        else setQuickWater('');
      }
    } catch (err) {
      showToast('Error logging daily metrics', 'danger');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  // Calculate target guidelines
  const targetCalories = mealPlan?.calories || user.calorieGoal || 2000;
  const targetWater = mealPlan?.waterGoal || 2500;
  const bmiVal = user.bmi || 0;

  // Macro distribution chart dataset
  const macroData = [
    { name: 'Protein', value: todayLog.proteinConsumed || mealPlan?.protein || 30 },
    { name: 'Carbs', value: todayLog.carbsConsumed || mealPlan?.carbohydrates || 40 },
    { name: 'Fats', value: todayLog.fatsConsumed || mealPlan?.fats || 30 }
  ];
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  // Prepare chart log arrays
  const chartData = logs.slice(-7).map(log => ({
    name: log.date.substring(5), // MM-DD
    Calories: log.caloriesConsumed,
    Target: targetCalories,
    Water: log.waterConsumed / 1000, // in Liters
    Weight: log.weight,
    Adherence: log.adherencePercentage
  }));

  return (
    <div className="fade-in-element">
      {/* Welcome banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-extrabold mb-1 text-primary">Hello, {user.name.split(' ')[0]}!</h2>
          <p className="text-secondary mb-0">Here's your wellness summary. Track your nutrients and stay active.</p>
        </div>
        <Link to="/progress" className="btn btn-primary-custom">
          <i className="bi bi-plus-lg me-2"></i> Log Full Meals
        </Link>
      </div>

      {/* 4 Core Metrics Grid */}
      <div className="row g-3 mb-4">
        {/* Calorie Intake Ring/ProgressBar */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="glass-panel p-3 h-100 d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between mb-3">
              <div>
                <span className="text-secondary small fw-bold d-block">Calories Consumed</span>
                <h3 className="fw-bold text-primary mb-0">{todayLog.caloriesConsumed} / {targetCalories} kcal</h3>
              </div>
              <div className="metric-icon bg-success text-white" style={{ background: 'var(--accent-gradient)' }}>
                <i className="bi bi-egg-fried"></i>
              </div>
            </div>
            <div>
              <div className="progress mb-2" style={{ height: '8px', background: 'var(--border-color)' }}>
                <div 
                  className="progress-bar bg-success" 
                  role="progressbar" 
                  style={{ width: `${Math.min(100, (todayLog.caloriesConsumed / targetCalories) * 100)}%` }}
                ></div>
              </div>
              <small className="text-secondary">
                {Math.round((todayLog.caloriesConsumed / targetCalories) * 100)}% of daily recommendation
              </small>
            </div>
          </div>
        </div>

        {/* Water Intake Tracker */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="glass-panel p-3 h-100 d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between mb-3">
              <div>
                <span className="text-secondary small fw-bold d-block">Water Consumed</span>
                <h3 className="fw-bold text-primary mb-0">{todayLog.waterConsumed} / {targetWater} ml</h3>
              </div>
              <div className="metric-icon bg-info text-white">
                <i className="bi bi-droplet-fill"></i>
              </div>
            </div>
            <div>
              <div className="progress mb-2" style={{ height: '8px', background: 'var(--border-color)' }}>
                <div 
                  className="progress-bar bg-info" 
                  role="progressbar" 
                  style={{ width: `${Math.min(100, (todayLog.waterConsumed / targetWater) * 100)}%` }}
                ></div>
              </div>
              <small className="text-secondary">
                {Math.round((todayLog.waterConsumed / targetWater) * 100)}% of target fluid limit
              </small>
            </div>
          </div>
        </div>

        {/* Current Weight */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="glass-panel p-3 h-100 d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between mb-3">
              <div>
                <span className="text-secondary small fw-bold d-block">Current Weight</span>
                <h3 className="fw-bold text-primary mb-0">{user.weight || 'N/A'} kg</h3>
              </div>
              <div className="metric-icon bg-warning text-dark">
                <i className="bi bi-speedometer2"></i>
              </div>
            </div>
            <div>
              <small className="text-secondary d-block">Diet Preference:</small>
              <span className="badge bg-secondary border text-primary">{user.dietaryPreference || 'None'}</span>
            </div>
          </div>
        </div>

        {/* BMI Calculator panel */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="glass-panel p-3 h-100 d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between mb-3">
              <div>
                <span className="text-secondary small fw-bold d-block">BMI Status</span>
                <h3 className="fw-bold text-primary mb-0">{bmiVal}</h3>
              </div>
              <div className="metric-icon bg-primary text-white">
                <i className="bi bi-calculator"></i>
              </div>
            </div>
            <div>
              <span className={`badge ${
                bmiVal < 18.5 ? 'bg-info' :
                bmiVal < 25 ? 'bg-success' :
                bmiVal < 30 ? 'bg-warning text-dark' : 'bg-danger'
              }`}>
                {bmiVal === 0 ? 'Not Set' :
                 bmiVal < 18.5 ? 'Underweight' :
                 bmiVal < 25 ? 'Normal weight' :
                 bmiVal < 30 ? 'Overweight' : 'Obese'}
              </span>
              <small className="text-secondary d-block mt-1">Height: {user.height || 0} cm</small>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Logging Forms */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6">
          <div className="glass-panel p-4">
            <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-lightning-fill text-warning me-2"></i>Quick Log Calories</h5>
            <form onSubmit={(e) => handleQuickLog(e, 'calories')} className="d-flex gap-2">
              <input
                type="number"
                className="form-control custom-input"
                placeholder="Calories in kcal (e.g. 350)"
                value={quickCal}
                onChange={(e) => setQuickCal(e.target.value)}
              />
              <button type="submit" className="btn btn-primary-custom px-4">Log</button>
            </form>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="glass-panel p-4">
            <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-droplet-fill text-info me-2"></i>Quick Log Fluids</h5>
            <form onSubmit={(e) => handleQuickLog(e, 'water')} className="d-flex gap-2">
              <input
                type="number"
                className="form-control custom-input"
                placeholder="Water in ml (e.g. 250)"
                value={quickWater}
                onChange={(e) => setQuickWater(e.target.value)}
              />
              <button type="submit" className="btn btn-primary-custom px-4" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}>Log</button>
            </form>
          </div>
        </div>
      </div>

      {/* Graphical Chart Dashboards */}
      <div className="row g-4 mb-4">
        {/* Calorie Trend Area Chart */}
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-4">
            <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-graph-up-arrow me-2 text-success"></i>Calorie Intake Trend (Last 7 Logs)</h5>
            <div style={{ width: '100%', height: '300px' }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)' }} />
                    <Legend />
                    <Area type="monotone" dataKey="Calories" stroke="#10b981" fillOpacity={1} fill="url(#colorCalories)" />
                    <Line type="monotone" dataKey="Target" stroke="#ef4444" strokeDasharray="5 5" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100 text-secondary">
                  No chart metrics found. Add logs under the "Log Daily Meals" page.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Macro Distribution Pie Chart */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4 d-flex flex-column justify-content-between">
            <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-pie-chart-fill me-2 text-warning"></i>Macronutrients Ratio</h5>
            <div style={{ width: '100%', height: '240px' }} className="d-flex justify-content-center align-items-center">
              {todayLog.proteinConsumed || mealPlan?.protein ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '10px' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-secondary small text-center">
                  Log your food under the Log page to view active macro breakdowns.
                </div>
              )}
            </div>
            <div className="border-top pt-2 mt-2 text-center" style={{ borderColor: 'var(--border-color) !important' }}>
              <small className="text-secondary">Distribution shows weights in grams (g)</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Weight timeline */}
        <div className="col-12 col-md-6">
          <div className="glass-panel p-4">
            <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-speedometer2 text-danger me-2"></i>Weight Tracker (kg)</h5>
            <div style={{ width: '100%', height: '240px' }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }} />
                    <Line type="monotone" dataKey="Weight" stroke="#ef4444" strokeWidth={2.5} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100 text-secondary">
                  No weight history found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Water log charts */}
        <div className="col-12 col-md-6">
          <div className="glass-panel p-4">
            <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-droplet-half text-info me-2"></i>Water Intake history (Liters)</h5>
            <div style={{ width: '100%', height: '240px' }}>
              {chartData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }} />
                    <Bar dataKey="Water" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100 text-secondary">
                  No fluid records found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
