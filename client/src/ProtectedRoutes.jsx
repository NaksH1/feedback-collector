import { Navigate } from "react-router-dom";
import { useAuth } from "./api/AuthContext";

function ProtectedRoute({ element: Element, roles }) {
  let { role } = useAuth();
  if (!role)
    role = localStorage.getItem('role')

  if (!role) {
    return <Navigate to="/admin/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/events" replace />;
  }

  return <Element />;
}

export default ProtectedRoute;

