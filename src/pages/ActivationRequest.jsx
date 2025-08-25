import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link, Container, Typography, Button } from "@mui/material";
import { TextFieldCustom } from "../components/TextFieldCustom";
import { usePageTitle } from "../hooks/usePageTitle";
import { activationRequest } from "../api/apiService";

export function ActivationRequest() {
  usePageTitle("Request Activation Email");

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
      const data = await activationRequest(email);
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
        Request Activation Email
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
          {loading ? "Sending email..." : "Request Activation Email"}
        </Button>
      </form>

      {isError && responseErrors.length > 0 && responseErrors.map((err, idx) => (
        <Typography key={idx} variant="body2" color="error" sx={{ mt: 1 }}>
          {err.field ?? 'Error'}: {err.message}
        </Typography>
      ))}

      {!loading && !responseErrors.length && (
        <Typography variant="body2" color={isError ? "error" : "success.main"}>
          {message}
        </Typography>
      )}

      <Typography variant="body2" sx={{ mt: 2 }}>
        Already activated?{" "}
        <Link component={RouterLink} to="/login" color="secondary">
          Sign in
        </Link>
      </Typography>
    </Container>
  );
}
