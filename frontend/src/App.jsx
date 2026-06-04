import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Pages
import Home from './pages/Home';
import Apply from './pages/Apply';
import SpeakerApply from './pages/SpeakerApply';
import ThankYou from './pages/ThankYou';
import SpeakerThankYou from './pages/SpeakerThankYou';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TeamRecruitment from './pages/TeamRecruitment';
import MeetTeam from './pages/MeetTeam';
import Events from './pages/Events';
import Sponsor from './pages/Sponsor';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/apply/speaker" element={<SpeakerApply />} />
        <Route path="/team-recruitment" element={<TeamRecruitment />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/thank-you-speaker" element={<SpeakerThankYou />} />
        <Route path="/ad" element={<AdminLogin />} />
        <Route path="/meet-team" element={<MeetTeam />} />
        <Route path="/events" element={<Events />} />
        <Route path="/sponsor" element={<Sponsor />} />


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
