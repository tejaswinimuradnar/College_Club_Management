import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";

export default function Clubs({ user }) {
  const [clubs, setClubs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/clubs").then((res) => setClubs(res.data)).catch(() => setError("Could not load clubs"));
  }, []);

  async function join(clubId) {
    if (!user) {
      setError("Log in to join a club");
      return;
    }
    try {
      await api.post("/memberships/join", { userId: user.id, clubId });
      alert("Joined club");
    } catch (err) {
      setError(err.response?.data?.error || "Could not join club");
    }
  }

  return (
    <div className="card">
      <h1>Clubs</h1>
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {clubs.map((club) => (
          <li key={club.id} className="list-item">
            <div>
              <Link to={`/clubs/${club.id}`}><strong>{club.name}</strong></Link>
              <p className="muted">{club.category}</p>
              <p>{club.description}</p>
            </div>
            <button onClick={() => join(club.id)}>Join</button>
          </li>
        ))}
        {clubs.length === 0 && <p className="muted">No clubs yet.</p>}
      </ul>
    </div>
  );
}
