import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, CircularProgress } from "@mui/material";
import { usePageTitle } from "../hooks/usePageTitle";
import { verifyToken } from "../api/apiService";

export function Home() {
  usePageTitle("Home");
  
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("loginToken");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("loginToken");
    
    if(!token){
      handleLogout();
    }

    const fetchUserData = async () => {
      try {
        const data = await verifyToken(token);
        setMessage(data.message);
        setUserData(data.user);
        setIsError(false);
      } catch (error) {
        const response = error.response?.data;
        setMessage(response?.message || "Server error");
        setIsError(true);

        if (response?.message === "Invalid or expired token") {
          localStorage.removeItem("loginToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Home</Typography>

      {loading && <CircularProgress />}

      {!loading && (
        <Typography variant="body2" color={isError ? "error" : "success.main"}>
          {message}
        </Typography>
      )}

      {userData && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }} color="primary">
            Welcome, {userData.username}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Email: {userData.email}
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 4 }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </>
      )}
    </Container>
  );
}