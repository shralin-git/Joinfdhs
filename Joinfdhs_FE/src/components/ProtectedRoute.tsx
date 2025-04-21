import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Optional: Restrict route to specific roles
  children: React.ReactNode; // The component to render if access is allowed
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles = [], children }) => {
  const { idToken, username, role } = useAuth();

  // Redirect to login if not authenticated
  if (!idToken) {
    console.warn("Access denied: User not authenticated.");
    return <Navigate to="/" replace />;
  }

  // Check if user's role is allowed for this route
  if (allowedRoles.length > 0 && !allowedRoles.includes(role || "")) {
    console.warn(
      `Access denied: User role "${role}" is not authorized for this route. Allowed roles: ${allowedRoles.join(", ")}`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;