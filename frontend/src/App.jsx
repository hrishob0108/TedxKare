import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Pages
import Home from './pages/Home';
import Apply from './pages/Apply';
import ThankYou from './pages/ThankYou';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin" element={<AdminLogin />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback for undefined routes */}
        <Route path="*" element={<div className="min-h-screen bg-black flex items-center justify-center text-white">Page not found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
