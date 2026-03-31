import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role, children, redirectTo }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;