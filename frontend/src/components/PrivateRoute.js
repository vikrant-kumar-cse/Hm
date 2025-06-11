import { Navigate } from 'react-router-dom';

// This component checks if the user is authenticated and has the correct role
const PrivateRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // Assuming role is saved during login

  // If no token or role mismatch, redirect to login or unauthorized page
  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default PrivateRoute;
