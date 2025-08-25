import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link, Container, Typography, Button, CircularProgress } from "@mui/material";
import { TextFieldCustom } from "../components/TextFieldCustom";
import { usePageTitle } from "../hooks/usePageTitle";
import { loginUser, verifyToken } from "../api/apiService";

export function Login() {
  usePageTitle("Login");
  
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkingToken, setCheckingToken] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [responseErrors, setResponseErrors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("loginToken");

    if (token) {
      const checkToken = async () => {
        try {
          await verifyToken(token);
          navigate("/");
        } catch (error) {
          localStorage.removeItem("loginToken");
          setCheckingToken(false);
        }
      };
      checkToken();
    } else {
      setCheckingToken(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    setIsError(false);
    
    try {
      const data = await loginUser(email, password);
      setMessage(data.message);
      setResponseErrors([]);
      setIsError(false);

      localStorage.setItem("loginToken", data.token);
      navigate("/");
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors) {
        setMessage("");
        setResponseErrors(response.errors);
      } else {
        setMessage(response?.message || "Server error");
        setResponseErrors([]);
      }

      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography variant="h6">Checking session...</Typography>
        {loading && <CircularProgress />}
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Login</Typography>

      <form onSubmit={handleSubmit}>
        <TextFieldCustom
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextFieldCustom
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {isError && responseErrors.length > 0 && responseErrors.map((err, idx) => (
        <Typography key={idx} variant="body2" color="error" sx={{ mt: 1 }}>
          {err.field ?? 'Error'}: {err.message}
        </Typography>
      ))}

      {!loading && !responseErrors.length && (
        <Typography variant="body2" color={isError ? "error" : "success.main"} sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}

      <Typography variant="body2" sx={{ mt: 2 }}>
        Don’t have an account? <Link component={RouterLink} to="/register" color="secondary">Sign up</Link>
      </Typography>
      
      <Typography variant="body2" sx={{ mt: 2 }}>
        Forgot your password? <Link component={RouterLink} to="/request-password-reset" color="secondary">Reset password</Link>
      </Typography>
    </Container>
  );
}