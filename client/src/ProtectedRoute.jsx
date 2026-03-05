import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Check if user exists in localStorage
  if (!user) {
    return <Navigate to="/artistlogin" />;
  }

  // Check if they have the right role
  if (role && user.role !== role) {
    return <Navigate to="/home" />;
  }

  // If using as a wrapper around children
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
