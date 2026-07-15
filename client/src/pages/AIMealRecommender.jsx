import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

const AIMealRecommender = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRecommendations = () => {
    setLoading(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const pref = user.dietaryPreference || 'None';
      const bmi = user.bmi || 22;

      let recommendationsObj = {};

      if (pref === 'Vegetarian') {
        recommendationsObj = {
          breakfast: 'Tofu scramble with spinach, cherry tomatoes, and two slices of gluten-free toast.',
          lunch: 'Lentil soup served with a kale avocado salad dressed in light olive oil.',
          dinner: 'Paneer tikka or chickpea curry with brown rice and steamed green beans.',
          snack: 'Roasted chickpeas or almond milk chia pudding.'
        };
      } else if (pref === 'Vegan') {
        recommendationsObj = {
          breakfast: 'Oatmeal cooked in soy milk, topped with sliced bananas, flax seeds, and maple syrup.',
          lunch: 'Spiced tempeh wrap with shredded purple cabbage, lettuce, and tahini cream.',
          dinner: 'Crispy tofu baked cubes tossed with broccoli, carrots, and brown rice.',
          snack: 'Sliced apple with peanut butter.'
        };
      } else if (pref === 'Keto') {
        recommendationsObj = {
          breakfast: 'Scrambled eggs in grass-fed butter, with smoked salmon, avocado slices, and spinach.',
          lunch: 'Grilled chicken Caesar salad (no croutons) with parmesan flakes and olive oil.',
          dinner: 'Baked salmon fillet with lemon herb butter sauce and roasted asparagus.',
          snack: 'Macadamia nuts or celery sticks with cream cheese.'
        };
      } else {
        // Standard Balanced Diet
        recommendationsObj = {
          breakfast: 'Boiled eggs, wheat bread toast with avocado spread, and a glass of fresh orange juice.',
          lunch: 'Grilled chicken breast salad with quinoa, cherry tomatoes, cucumbers, and balsamic glaze.',
          dinner: 'Grilled mackerel or turkey breast served with sweet potato mash and broccoli.',
          snack: 'Greek yogurt with fresh berries.'
        };
      }

      // Add target metrics based on BMI
      let targetCals = 2000;
      if (bmi > 25) targetCals = 1600; // Lose weight
      else if (bmi < 18.5) targetCals = 2400; // Gain weight

      setRecommendations({
        meals: recommendationsObj,
        targetCals,
        protein: Math.round(targetCals * 0.15 / 4),
        carbs: Math.round(targetCals * 0.55 / 4),
        fats: Math.round(targetCals * 0.30 / 9)
      });
      
      setLoading(false);
      showToast('AI diet recommendation generated successfully!', 'success');
    }, 1500);
  };

  return (
    <div className="fade-in-element">
      <div className="mb-4">
        <h2 className="fw-extrabold mb-1 text-primary">AI Meal Recommendation Engine</h2>
        <p className="text-secondary">Generate instant meal targets matching your dietary preference: <strong>{user.dietaryPreference || 'None'}</strong>.</p>
      </div>

      <div className="row g-4">
        {/* Left Card: Input parameters */}
        <div className="col-12 col-md-4">
          <div className="glass-panel p-4 text-center">
            <div className="p-3 bg-secondary rounded-circle d-inline-flex justify-content-center align-items-center mb-3 text-success" style={{ width: '70px', height: '70px' }}>
              <i className="bi bi-robot fs-2"></i>
            </div>
            <h5 className="fw-bold text-primary">AI Diet Planner</h5>
            <p className="text-secondary small">
              Our rule-based engine calculates target macronutrients using your physical height, weight, BMI profile, and preferences.
            </p>
            
            <div className="border-top pt-3 text-start small d-flex flex-column gap-2 mb-4" style={{ borderColor: 'var(--border-color)' }}>
              <div><strong className="text-primary">Diet preference:</strong> <span className="text-secondary">{user.dietaryPreference || 'None'}</span></div>
              <div><strong className="text-primary">My BMI:</strong> <span className="text-secondary">{user.bmi || 'Not set'}</span></div>
              <div><strong className="text-primary">Current Weight:</strong> <span className="text-secondary">{user.weight || 0} kg</span></div>
            </div>

            <button
              onClick={generateRecommendations}
              className="btn btn-primary-custom w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  Processing AI...
                </>
              ) : (
                <>
                  Generate Recommendations <i className="bi bi-cpu ms-1"></i>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right card: recommendations */}
        <div className="col-12 col-md-8">
          {recommendations ? (
            <div className="glass-panel p-4">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4" style={{ borderColor: 'var(--border-color)' }}>
                <h4 className="fw-bold text-primary mb-0">Recommended Diet Guide</h4>
                <span className="badge bg-success-subtle text-success">Balanced Ratio</span>
              </div>

              {/* Meals list */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="bg-secondary p-3 rounded">
                    <h6 className="fw-bold text-primary"><i className="bi bi-sunrise text-warning me-2"></i>Breakfast</h6>
                    <p className="text-secondary small mb-0">{recommendations.meals.breakfast}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-secondary p-3 rounded">
                    <h6 className="fw-bold text-primary"><i className="bi bi-sun text-danger me-2"></i>Lunch</h6>
                    <p className="text-secondary small mb-0">{recommendations.meals.lunch}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-secondary p-3 rounded">
                    <h6 className="fw-bold text-primary"><i className="bi bi-sunset text-primary me-2"></i>Dinner</h6>
                    <p className="text-secondary small mb-0">{recommendations.meals.dinner}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-secondary p-3 rounded">
                    <h6 className="fw-bold text-primary"><i className="bi bi-apple text-success me-2"></i>Snack Option</h6>
                    <p className="text-secondary small mb-0">{recommendations.meals.snack}</p>
                  </div>
                </div>
              </div>

              {/* Target nutrition stats */}
              <h5 className="fw-bold mb-3 text-primary border-top pt-3" style={{ borderColor: 'var(--border-color)' }}>Suggested Daily Targets</h5>
              <div className="row text-center g-2">
                <div className="col-6 col-md-3">
                  <div className="border p-2 rounded">
                    <small className="text-secondary d-block">Calories</small>
                    <span className="fw-bold text-primary">{recommendations.targetCals} kcal</span>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="border p-2 rounded">
                    <small className="text-secondary d-block">Protein</small>
                    <span className="fw-bold text-success">{recommendations.protein} g</span>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="border p-2 rounded">
                    <small className="text-secondary d-block">Carbs</small>
                    <span className="fw-bold text-info">{recommendations.carbs} g</span>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="border p-2 rounded">
                    <small className="text-secondary d-block">Fats</small>
                    <span className="fw-bold text-warning">{recommendations.fats} g</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-5 text-center text-secondary h-100 d-flex flex-column justify-content-center">
              <i className="bi bi-robot fs-1 d-block mb-3 text-muted"></i>
              <h4 className="fw-bold text-primary">No Recommendations Loaded</h4>
              <p className="small mb-0">Select the option to compile an automated plan using our smart rule engine.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIMealRecommender;
