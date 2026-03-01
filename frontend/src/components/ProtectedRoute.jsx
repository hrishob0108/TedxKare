import { Navigate } from 'react-router-dom';
import { storage } from '../utils/helpers';

// ==================== PROTECTED ROUTE COMPONENT ====================
// Redirects to login if user is not authenticated
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = storage.isAdminLoggedIn();

  if (!isLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
