import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

const UserMealPlans = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  
  const [mealPlan, setMealPlan] = useState(null);
  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        // Fetch meal plan
        const planRes = await axios.get('/mealplans');
        if (planRes.data.success && planRes.data.data.length > 0) {
          setMealPlan(planRes.data.data[0]);
        }

        // Fetch dietitian connection info
        const userRes = await axios.get(`/users/${user._id}`);
        if (userRes.data.success) {
          setClientInfo(userRes.data.clientMetrics);
        }
      } catch (err) {
        console.error('Error fetching meal plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [user]);

  // Export to CSV
  const handleExportCSV = () => {
    if (!mealPlan) return;
    
    const headers = ['Metric/Meal', 'Target/Description'];
    const rows = [
      ['Breakfast', mealPlan.breakfast],
      ['Lunch', mealPlan.lunch],
      ['Dinner', mealPlan.dinner],
      ['Snacks', mealPlan.snacks || 'None'],
      ['Target Calories', `${mealPlan.calories} kcal`],
      ['Target Protein', `${mealPlan.protein || 0} g`],
      ['Target Carbohydrates', `${mealPlan.carbohydrates || 0} g`],
      ['Target Fats', `${mealPlan.fats || 0} g`],
      ['Target Fiber', `${mealPlan.fiber || 0} g`],
      ['Daily Water Goal', `${mealPlan.waterGoal || 2000} ml`],
      ['Dietitian Notes', mealPlan.notes || 'None']
    ];

    let csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `meal_plan_${user.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Meal plan exported to CSV successfully', 'success');
  };

  // Export to PDF (Triggers Print Window)
  const handlePrintPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading Meal Plan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in-element">
      {/* Header Panel */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-extrabold mb-1 text-primary">My Meal Plan</h2>
          <p className="text-secondary mb-0">Follow your personalized wellness chart custom designed by your dietitian.</p>
        </div>
        {mealPlan && (
          <div className="d-flex gap-2">
            <button onClick={handleExportCSV} className="btn btn-outline-success">
              <i className="bi bi-file-earmark-spreadsheet me-2"></i> Export CSV
            </button>
            <button onClick={handlePrintPDF} className="btn btn-success" style={{ background: 'var(--accent-gradient)', border: 'none' }}>
              <i className="bi bi-file-earmark-pdf me-2"></i> Print / PDF
            </button>
          </div>
        )}
      </div>

      <div className="row g-4">
        {/* Diet Plan Details */}
        <div className="col-12 col-lg-8">
          {mealPlan ? (
            <div className="glass-panel p-4 print-section">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4" style={{ borderColor: 'var(--border-color)' }}>
                <h4 className="fw-bold text-primary mb-0"><i className="bi bi-journal-medical text-success me-2"></i>Daily Diet Guide</h4>
                <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold">Active Diet</span>
              </div>

              {/* Breakfast */}
              <div className="mb-4">
                <h5 className="fw-bold text-primary"><i className="bi bi-sunrise text-warning me-2"></i>Breakfast</h5>
                <p className="text-secondary ps-4" style={{ whiteSpace: 'pre-line' }}>{mealPlan.breakfast}</p>
              </div>

              {/* Lunch */}
              <div className="mb-4">
                <h5 className="fw-bold text-primary"><i className="bi bi-sun text-danger me-2"></i>Lunch</h5>
                <p className="text-secondary ps-4" style={{ whiteSpace: 'pre-line' }}>{mealPlan.lunch}</p>
              </div>

              {/* Dinner */}
              <div className="mb-4">
                <h5 className="fw-bold text-primary"><i className="bi bi-sunset text-primary me-2"></i>Dinner</h5>
                <p className="text-secondary ps-4" style={{ whiteSpace: 'pre-line' }}>{mealPlan.dinner}</p>
              </div>

              {/* Snacks */}
              <div className="mb-4">
                <h5 className="fw-bold text-primary"><i className="bi bi-apple text-success me-2"></i>Snacks & Extras</h5>
                <p className="text-secondary ps-4" style={{ whiteSpace: 'pre-line' }}>{mealPlan.snacks || 'No specific snacks prescribed'}</p>
              </div>

              {/* Dietitian Notes */}
              {mealPlan.notes && (
                <div className="bg-secondary p-3 rounded border mt-4" style={{ borderColor: 'var(--border-color)' }}>
                  <h6 className="fw-bold text-primary mb-2"><i className="bi bi-chat-right-text text-success me-2"></i>Dietitian Notes</h6>
                  <p className="text-secondary small mb-0">{mealPlan.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-5 text-center text-secondary">
              <i className="bi bi-calendar-x fs-1 d-block mb-3 text-muted"></i>
              <h4 className="fw-bold text-primary">No Meal Plan Found</h4>
              {clientInfo && clientInfo.dietitianId ? (
                <p className="small mb-0">Your dietitian <strong>{clientInfo.dietitianId.name}</strong> has not logged a diet plan for you yet. Check back shortly!</p>
              ) : (
                <p className="small mb-0">You are not connected to a dietitian. Go to the profile or dashboard, or ask an administrator to assign a dietitian to your profile.</p>
              )}
            </div>
          )}
        </div>

        {/* Nutritional Goals sidebar */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4">
            <h5 className="fw-bold mb-4 text-primary"><i className="bi bi-flag-fill text-success me-2"></i>Nutrition Targets</h5>
            
            {mealPlan ? (
              <div className="d-flex flex-column gap-3">
                {/* Calories */}
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-secondary small fw-bold">Calories Goal</span>
                  <span className="fw-bold text-primary">{mealPlan.calories} kcal</span>
                </div>

                {/* Protein */}
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-secondary small fw-bold">Protein Limit</span>
                  <span className="fw-bold text-success">{mealPlan.protein || 0} g</span>
                </div>

                {/* Carbs */}
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-secondary small fw-bold">Carbohydrates</span>
                  <span className="fw-bold text-info">{mealPlan.carbohydrates || 0} g</span>
                </div>

                {/* Fats */}
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-secondary small fw-bold">Fats Limit</span>
                  <span className="fw-bold text-warning">{mealPlan.fats || 0} g</span>
                </div>

                {/* Fiber */}
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-secondary small fw-bold">Dietary Fiber</span>
                  <span className="fw-bold text-primary">{mealPlan.fiber || 0} g</span>
                </div>

                {/* Water Goal */}
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-secondary small fw-bold">Daily Water Intake</span>
                  <span className="fw-bold text-info">{(mealPlan.waterGoal || 2000) / 1000} L</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-secondary small">
                Target calories: {user.calorieGoal || 2000} kcal
              </div>
            )}
          </div>

          {/* Connection status */}
          {clientInfo && (
            <div className="glass-panel p-4 mt-4">
              <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-envelope-heart text-danger me-2"></i>My Dietitian</h5>
              {clientInfo.dietitianId ? (
                <div>
                  <h6 className="fw-bold text-primary mb-1">{clientInfo.dietitianId.name}</h6>
                  <p className="text-secondary small mb-2">{clientInfo.dietitianId.email}</p>
                  <span className="badge bg-success-subtle text-success">Connected</span>
                </div>
              ) : (
                <div className="text-secondary small">
                  Status: <span className="badge bg-warning text-dark">{clientInfo.status}</span>
                  <p className="mt-2 mb-0">Waiting to connect with an available dietitian.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMealPlans;
