import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

const BarcodeScanner = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);

  // Database of scan products
  const productsDB = {
    '789101112': {
      name: 'Organic Greek Yogurt (150g)',
      calories: 120,
      protein: 15,
      carbs: 6,
      fats: 4,
      water: 120
    },
    '123456789': {
      name: 'Steel-Cut Oatmeal (1 Cup)',
      calories: 150,
      protein: 5,
      carbs: 27,
      fats: 2.5,
      water: 200
    },
    '987654321': {
      name: 'Atlantic Grilled Salmon (150g)',
      calories: 280,
      protein: 34,
      carbs: 0,
      fats: 15,
      water: 80
    },
    '111213141': {
      name: 'Fizzy Lemon Soda (Can)',
      calories: 140,
      protein: 0,
      carbs: 38,
      fats: 0,
      water: 350
    }
  };

  const [selectedBarcode, setSelectedBarcode] = useState('789101112');

  const startScan = () => {
    setScanning(true);
    setScannedResult(null);

    // Simulate camera feed scanning for 2 seconds
    setTimeout(() => {
      setScanning(false);
      const product = productsDB[selectedBarcode];
      if (product) {
        setScannedResult(product);
        showToast('Barcode scanned successfully!', 'success');
      } else {
        showToast('Invalid barcode, product not in database', 'danger');
      }
    }, 2000);
  };

  const handleLogScannedItem = async () => {
    if (!scannedResult) return;
    
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      
      // Fetch latest values first to avoid overwriting existing ones
      let existingLog = { caloriesConsumed: 0, waterConsumed: 0, proteinConsumed: 0, carbsConsumed: 0, fatsConsumed: 0 };
      try {
        const checkRes = await axios.get('/progress');
        if (checkRes.data.success) {
          const matchingEntry = checkRes.data.data.find(l => l.date === todayStr);
          if (matchingEntry) existingLog = matchingEntry;
        }
      } catch (err) {
        // Log doesn't exist yet, that's fine
      }

      const payload = {
        date: todayStr,
        weight: user.weight,
        caloriesConsumed: existingLog.caloriesConsumed + scannedResult.calories,
        proteinConsumed: (existingLog.proteinConsumed || 0) + scannedResult.protein,
        carbsConsumed: (existingLog.carbsConsumed || 0) + scannedResult.carbs,
        fatsConsumed: (existingLog.fatsConsumed || 0) + scannedResult.fats,
        waterConsumed: (existingLog.waterConsumed || 0) + scannedResult.water,
        exercise: existingLog.exercise || 0
      };

      const res = await axios.post('/progress', payload);
      if (res.data.success) {
        showToast(`Logged ${scannedResult.name} to today's progress!`, 'success');
        setScannedResult(null);
      }
    } catch (err) {
      showToast('Error registering scanned product', 'danger');
    }
  };

  return (
    <div className="fade-in-element">
      <div className="mb-4">
        <h2 className="fw-extrabold mb-1 text-primary">Barcode Nutrition Scanner</h2>
        <p className="text-secondary">Simulate scanning grocery products to instantly capture nutritional details and log them.</p>
      </div>

      <div className="row g-4">
        {/* Scanner screen simulation */}
        <div className="col-12 col-md-6">
          <div className="glass-panel p-4 text-center">
            <h5 className="fw-bold mb-3 text-primary">Simulated Camera Feed</h5>
            
            {/* Visual scan window */}
            <div 
              className="position-relative bg-dark rounded-3 overflow-hidden d-flex justify-content-center align-items-center mb-3 border border-secondary"
              style={{ height: '240px' }}
            >
              {scanning ? (
                <>
                  {/* Laser line effect */}
                  <div 
                    className="position-absolute w-100 bg-danger" 
                    style={{ 
                      height: '3px',
                      boxShadow: '0 0 10px #ef4444',
                      animation: 'scanLaser 1.5s ease-in-out infinite'
                    }}
                  ></div>
                  <div className="text-secondary small">
                    <span className="spinner-border spinner-border-sm me-2 text-success"></span>
                    Accessing webcam stream...
                  </div>
                  
                  {/* Style tag for laser animation */}
                  <style>{`
                    @keyframes scanLaser {
                      0% { top: 10%; }
                      50% { top: 90%; }
                      100% { top: 10%; }
                    }
                  `}</style>
                </>
              ) : scannedResult ? (
                <div className="text-white text-center px-4 fade-in-element">
                  <i className="bi bi-check-circle-fill text-success fs-1 mb-2 d-block"></i>
                  <div className="fw-bold text-success">{scannedResult.name}</div>
                  <small className="text-secondary d-block mt-1">Barcode: {selectedBarcode}</small>
                </div>
              ) : (
                <div className="text-secondary text-center px-4">
                  <i className="bi bi-camera-video fs-1 mb-2 d-block text-muted"></i>
                  <small>webcam camera simulation offline</small>
                </div>
              )}
            </div>

            {/* Select scanner item */}
            <div className="mb-3 text-start">
              <label className="form-label small text-secondary fw-bold">Select Demo Item to Scan:</label>
              <select 
                className="form-select custom-input" 
                value={selectedBarcode} 
                onChange={(e) => setSelectedBarcode(e.target.value)}
                disabled={scanning}
              >
                <option value="789101112">Organic Greek Yogurt (120 kcal)</option>
                <option value="123456789">Steel-Cut Oatmeal (150 kcal)</option>
                <option value="987654321">Atlantic Grilled Salmon (280 kcal)</option>
                <option value="111213141">Fizzy Lemon Soda (140 kcal)</option>
              </select>
            </div>

            <button 
              onClick={startScan} 
              className="btn btn-primary-custom w-100"
              disabled={scanning}
            >
              {scanning ? 'Initializing Scan...' : 'Trigger Scan Product'}
            </button>
          </div>
        </div>

        {/* Nutritional Output */}
        <div className="col-12 col-md-6">
          {scannedResult ? (
            <div className="glass-panel p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4" style={{ borderColor: 'var(--border-color)' }}>
                  <h5 className="fw-bold text-primary mb-0"><i className="bi bi-card-list text-success me-2"></i>Product Nutrition facts</h5>
                  <span className="badge bg-success">{scannedResult.calories} kcal</span>
                </div>

                <h4 className="fw-bold text-success mb-3">{scannedResult.name}</h4>

                <div className="d-flex flex-column gap-2 small mb-4">
                  <div className="d-flex justify-content-between border-bottom pb-1" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="text-secondary fw-bold">Protein</span>
                    <span className="fw-bold text-primary">{scannedResult.protein} g</span>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-1" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="text-secondary fw-bold">Carbohydrates</span>
                    <span className="fw-bold text-primary">{scannedResult.carbs} g</span>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-1" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="text-secondary fw-bold">Fats</span>
                    <span className="fw-bold text-primary">{scannedResult.fats} g</span>
                  </div>
                  <div className="d-flex justify-content-between border-bottom pb-1" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="text-secondary fw-bold">Estimated Moisture/Water</span>
                    <span className="fw-bold text-primary">{scannedResult.water} ml</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleLogScannedItem} 
                className="btn btn-success w-100 py-2"
                style={{ background: 'var(--accent-gradient)', border: 'none' }}
              >
                Log Scanned Product to Today's Meals <i className="bi bi-journal-plus ms-1"></i>
              </button>
            </div>
          ) : (
            <div className="glass-panel p-5 text-center text-secondary h-100 d-flex flex-column justify-content-center">
              <i className="bi bi-qr-code fs-1 d-block mb-3 text-muted"></i>
              <h5 className="fw-bold text-primary">No Scan Output</h5>
              <p className="small mb-0">Products successfully captured via camera scanner will display nutrient macros sheets here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
