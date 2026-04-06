import { Navigate, Outlet } from "react-router-dom";

// We pass 'auth' as a prop, or get it from a Context
export const ProtectedRoute = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) => {
  if (!isAuthenticated) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child routes
  return <Outlet />;
};
