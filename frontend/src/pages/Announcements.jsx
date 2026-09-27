import { useEffect, useState } from "react";
import api from "../api.js";

export default function Announcements() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/announcements").then((res) => setItems(res.data));
  }, []);

  return (
    <div className="card">
      <h1>Announcements</h1>
      <ul className="list">
        {items.map((a) => (
          <li key={a.id} className="list-item">
            <strong>{a.title}</strong>
            <p className="muted">{new Date(a.postedAt).toLocaleString()}</p>
            <p>{a.content}</p>
          </li>
        ))}
        {items.length === 0 && <p className="muted">No announcements yet.</p>}
      </ul>
    </div>
  );
}
