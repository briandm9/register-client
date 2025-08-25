import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link, Container, Typography, Button } from "@mui/material";
import { TextFieldCustom } from "../components/TextFieldCustom";
import { usePageTitle } from "../hooks/usePageTitle";
import { resetPasswordRequest } from "../api/apiService";

export function ResetPasswordRequest() {
  usePageTitle("Request Password Reset");

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [responseErrors, setResponseErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    setIsError(false);

    try {
      const data = await resetPasswordRequest(email);
      setMessage(data.message);
      setResponseErrors([]);
      setIsError(false);

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
        Reset Password Request
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextFieldCustom
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Sending email..." : "Request Password Email"}
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
        Remembered your password?{" "}
        <Link component={RouterLink} to="/login" color="secondary">
          Sign in
        </Link>
      </Typography>
    </Container>
  );
}
