import { Link } from "react-router-dom";

export default function Dashboard({ user }) {
  return (
    <div className="card">
      <h1>Welcome{user ? `, ${user.name}` : ""}</h1>
      <p>Browse clubs, join the ones you like, and keep up with events and announcements.</p>
      <div className="quick-links">
        <Link to="/clubs" className="tile">Clubs</Link>
        <Link to="/events" className="tile">Events</Link>
        <Link to="/announcements" className="tile">Announcements</Link>
      </div>
    </div>
  );
}
