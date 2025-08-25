import axios from "axios";

const API_URL = "http://localhost:3000";

export async function registerUser(username, email, password) {
  const response = await axios.post(`${API_URL}/register`, { username, email, password });
  return response.data;
};

export async function activateAccount(token) {
  const response = await axios.get(`${API_URL}/activate?token=${token}`);
  return response.data;
};

export async function loginUser(email, password) {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export async function activationRequest(email) {
  const response = await axios.post(`${API_URL}/activation-request`, { email });
  return response.data;
};

export async function resetPasswordRequest(email) {
  const response = await axios.post(`${API_URL}/reset-password-request`, { email });
  return response.data;
};

export async function passwordReset(token, password) {
  const response = await axios.post(`${API_URL}/password-reset?token=${token}`, {
    password,
  });
  return response.data;
};

export async function verifyToken(token) {
  const response = await axios.get(`${API_URL}/verifyToken`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};