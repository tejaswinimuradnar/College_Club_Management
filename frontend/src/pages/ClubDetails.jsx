import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api.js";

export default function ClubDetails() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get(`/clubs/${id}`).then((res) => setClub(res.data));
    api.get("/events").then((res) => setEvents(res.data.filter((e) => String(e.clubId) === String(id))));
  }, [id]);

  if (!club) return <div className="card">Loading…</div>;

  return (
    <div className="card">
      <h1>{club.name}</h1>
      <p className="muted">{club.category}</p>
      <p>{club.description}</p>

      <h2>Upcoming events</h2>
      <ul className="list">
        {events.map((e) => (
          <li key={e.id} className="list-item"><strong>{e.title}</strong> — {e.venue}</li>
        ))}
        {events.length === 0 && <p className="muted">No events scheduled.</p>}
      </ul>
    </div>
  );
}
