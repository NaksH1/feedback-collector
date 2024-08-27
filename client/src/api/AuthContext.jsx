import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import isTokenExpired from "./isTokenExpired";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const publicRoutes = ['/admin/login', '/admin/signup'];
  useEffect(() => {
    const currentPath = location.pathname;
    const token = localStorage.getItem("token");
    if (!(publicRoutes.includes(currentPath))) {
      if (isTokenExpired(token)) {
        setIsAuthenticated(false);
        navigate("/admin/login");
      }
      else {
        setIsAuthenticated(true);
      }
    }
  }, [navigate]);
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);


