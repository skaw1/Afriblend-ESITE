
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-dark-bg">
        <div className="text-brand-primary dark:text-dark-text">Verifying authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they login.
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  // If roles are specified, check if the user has one of the allowed roles
  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
      // Redirect to a safe page if role is not allowed.
      // e.g. A Store Owner trying to access a dev page will be sent to their dashboard.
      return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
