import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Clubs from "./pages/Clubs.jsx";
import ClubDetails from "./pages/ClubDetails.jsx";
import Events from "./pages/Events.jsx";
import Announcements from "./pages/Announcements.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">College Club Management</Link>
        <nav>
          <Link to="/clubs">Clubs</Link>
          <Link to="/events">Events</Link>
          <Link to="/announcements">Announcements</Link>
          {user?.role === "ADMIN" || user?.role === "CLUB_COORDINATOR" ? (
            <Link to="/admin">Admin</Link>
          ) : null}
          {user ? (
            <>
              <span className="user-pill">{user.name}</span>
              <button onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/clubs" element={<Clubs user={user} />} />
          <Route path="/clubs/:id" element={<ClubDetails user={user} />} />
          <Route path="/events" element={<Events user={user} />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/admin" element={<AdminDashboard user={user} />} />
        </Routes>
      </main>

      <footer className="footer">
        College Club Management System
      </footer>
    </div>
  );
}
