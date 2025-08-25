import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";
import { TextFieldCustom } from "../components/TextFieldCustom";
import { usePageTitle } from "../hooks/usePageTitle";
import { passwordReset } from "../api/apiService";

export function PasswordReset() {
  usePageTitle("Password Reset");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [responseErrors, setResponseErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    setIsError(false);

    if (!token) {
      setIsError(true);
      setMessage("Token is missing");
      return;
    }

    try {
      const data = await passwordReset(token, password);
      setMessage(data.message);
      setResponseErrors([]);
      setIsError(false);

      setTimeout(() => navigate("/login"), 2000);
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

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Password Reset
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextFieldCustom
          label="New Password"
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
          {loading ? "Changing password..." : "Change password"}
        </Button>
      </form>

      {isError && responseErrors.length > 0 && responseErrors.map((err, idx) => (
          <Typography key={idx} variant="body2" color="error" sx={{ mt: 1 }}>
            {err.field ?? "Error"}: {err.message}
          </Typography>
        ))}

      {!loading && !responseErrors.length && (
        <Typography variant="body2" color={isError ? "error" : "success.main"} sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Container>
  );
}
