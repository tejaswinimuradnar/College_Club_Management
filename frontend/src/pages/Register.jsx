import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api.js";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/users/register", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  }

  return (
    <div className="card narrow">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={form.name} onChange={(e) => update("name", e.target.value)} required />

        <label>Email</label>
        <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />

        <label>Password</label>
        <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required />

        {error && <p className="error">{error}</p>}
        {success && <p className="success">Account created. Redirecting to login…</p>}

        <button type="submit">Create account</button>
      </form>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}
