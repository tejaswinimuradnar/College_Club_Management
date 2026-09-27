import { useEffect, useState } from "react";
import api from "../api.js";

export default function Events({ user }) {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/events").then((res) => setEvents(res.data)).catch(() => setError("Could not load events"));
  }, []);

  async function registerForEvent(eventId) {
    if (!user) {
      setError("Log in to register for an event");
      return;
    }
    try {
      await api.post(`/events/${eventId}/register`, { userId: user.id });
      alert("Registered for event");
    } catch (err) {
      setError(err.response?.data?.error || "Could not register");
    }
  }

  return (
    <div className="card">
      <h1>Events</h1>
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {events.map((ev) => (
          <li key={ev.id} className="list-item">
            <div>
              <strong>{ev.title}</strong>
              <p className="muted">{ev.venue} • {ev.eventDate ? new Date(ev.eventDate).toLocaleString() : "Date TBA"}</p>
              <p>{ev.description}</p>
            </div>
            <button onClick={() => registerForEvent(ev.id)}>Register</button>
          </li>
        ))}
        {events.length === 0 && <p className="muted">No events yet.</p>}
      </ul>
    </div>
  );
}
