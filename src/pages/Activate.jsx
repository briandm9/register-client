import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Typography, Button, CircularProgress } from "@mui/material";
import { usePageTitle } from "../hooks/usePageTitle";
import { activateAccount } from "../api/apiService";

export function Activate() {
  usePageTitle("Activate Account");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return; 
    hasRun.current = true;

    if (!token) {
      setMessage("Token is missing");
      setLoading(false);
      setIsError(true);
      return;
    }

    const activate = async () => {
      try {
        const data = await activateAccount(token);
        setMessage(data.message);
        setIsError(false);
      } catch (error) {
        const response = error.response?.data;
        setMessage(response?.message || "Activation failed");
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    activate();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Activate Account</Typography>

      {loading && <CircularProgress />}

      {!loading && (
        <Typography variant="body2" color={isError ? "error" : "success.main"}>
          {message}
        </Typography>
      )}

      {!loading && !isError && (
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      )}
    </Container>
  );
}
