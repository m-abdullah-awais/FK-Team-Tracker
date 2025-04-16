import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../constants/API_BASE_URL";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("fk-user-refresh");
      
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) throw new Error("Token refresh failed");

      const data = await response.json();
      localStorage.setItem("fk-user-access", data.accessToken);
      if (data?.refreshToken) {
        localStorage.setItem("fk-user-refresh", data.refreshToken);
      }

      const decoded = jwtDecode(data.accessToken);
      setUser(decoded);
      return true;
    } catch (error) {
      console.error("Error refreshing token:", error);
      localStorage.removeItem("fk-user");
      localStorage.removeItem("fk-refresh-token");
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("fk-user-access");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);

        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          console.warn("Token expired, attempting refresh");
          const refreshed = await refreshAccessToken();
          if (!refreshed) {
            setUser(null);
          }
        } else {
          setUser(decoded);
        }
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("fk-user");
        localStorage.removeItem("fk-refresh-token");
        setUser(null);
      }

      setLoading(false);
    };

    validateToken();
  }, []);


  console.info("User data:", user);

  return { user, loading, refreshAccessToken };
};

export default useAuth;