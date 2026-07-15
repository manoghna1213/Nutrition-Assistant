import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';


// Components & Layouts
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';



// Public Pages
import Landing from './pages/Landing';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

// Protected User Pages
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import UserMealPlans from './pages/UserMealPlans';
import UserProgress from './pages/UserProgress';
import AIMealRecommender from './pages/AIMealRecommender';
import BarcodeScanner from './pages/BarcodeScanner';
import Notifications from './pages/Notifications';

// Protected Dietitian Pages
import DietitianDashboard from './pages/DietitianDashboard';
import CreateMealPlan from './pages/CreateMealPlan';
import ManageClient from './pages/ManageClient';

// Protected Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';

// A dynamic router dashboard root that handles dashboards based on role
const DashboardRoot = () => {
  const { user } = useContext(AuthContext);

  if (user.role === 'Admin') {
    return <AdminDashboard />;
  } else if (user.role === 'Dietitian') {
    return <DietitianDashboard />;
  } else {
    return <UserDashboard />;
  }
};

const AppContent = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebarOpen = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'var(--bg-primary)' }}>
        <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading application context...</span>
        </div>
      </div>
    );
  }

  // Layout selection: Unauthenticated pages should be full screen.
  // Authenticated dashboards get Sidebar + Navbar layout grid wrapper.
  return (
    <Router>
      {isAuthenticated ? (
        <div className="app-wrapper">
          <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
          
          <div className="d-flex flex-column flex-grow-1 min-vh-100" style={{ background: 'var(--bg-primary)', overflow: 'hidden' }}>
            <Navbar toggleSidebarOpen={toggleSidebarOpen} />
            
            <main className="main-content flex-grow-1 container-fluid">
              <Routes>
                {/* Unified dashboard resolver */}
                <Route path="/" element={<ProtectedRoute><DashboardRoot /></ProtectedRoute>} />
                
                {/* Shared routes */}
                <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

                {/* Client / User routes */}
                <Route path="/progress" element={<ProtectedRoute allowedRoles={['User']}><UserProgress /></ProtectedRoute>} />
                <Route path="/mealplans" element={<ProtectedRoute allowedRoles={['User']}><UserMealPlans /></ProtectedRoute>} />
                <Route path="/ai-recommend" element={<ProtectedRoute allowedRoles={['User']}><AIMealRecommender /></ProtectedRoute>} />
                <Route path="/barcode" element={<ProtectedRoute allowedRoles={['User']}><BarcodeScanner /></ProtectedRoute>} />

                {/* Dietitian routes */}
                <Route path="/create-meal-plan" element={<ProtectedRoute allowedRoles={['Dietitian', 'Admin']}><CreateMealPlan /></ProtectedRoute>} />
                <Route path="/manage-client/:id" element={<ProtectedRoute allowedRoles={['Dietitian', 'Admin']}><ManageClient /></ProtectedRoute>} />

                {/* Admin routes */}
                <Route path="/admin-users" element={<ProtectedRoute allowedRoles={['Admin']}><AdminUsers /></ProtectedRoute>} />

                {/* Catch All redirects */}
                <Route path="/landing" element={<Navigate to="/" replace />} />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/register" element={<Navigate to="/" replace />} />
                <Route path="/forgot-password" element={<Navigate to="/" replace />} />
                <Route path="/reset-password" element={<Navigate to="/" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </div>
      ) : (
        <Routes>
          {/* Public access routing */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
