import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";
import isTokenExpired from "./isTokenExpired";


const useAuthCheck = () => {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (isTokenExpired(token)) {
      setIsAuthenticated(false);
      navigate('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated, navigate]);
};

export default useAuthCheck;


