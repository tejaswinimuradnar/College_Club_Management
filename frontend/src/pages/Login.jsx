import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api.js";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/users/login", { email, password });
      setUser(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="card narrow">
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="error">{error}</p>}

        <button type="submit">Log in</button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}
