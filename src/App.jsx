import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Activate } from "./pages/Activate";
import { ActivationRequest } from "./pages/ActivationRequest";
import { PasswordReset } from "./pages/PasswordReset";
import { ResetPasswordRequest } from "./pages/ResetPasswordRequest";

export function App() {
  return (
    <BrowserRouter /*basename="/app"*/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activate" element={<Activate />} />
        <Route path="/request-activate" element={<ActivationRequest />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/request-password-reset" element={<ResetPasswordRequest />} />
      </Routes>
    </BrowserRouter>
  );
}
