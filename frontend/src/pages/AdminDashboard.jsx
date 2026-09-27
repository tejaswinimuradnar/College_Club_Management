import { useEffect, useState } from "react";
import api from "../api.js";

export default function AdminDashboard({ user }) {
  const [clubForm, setClubForm] = useState({ name: "", description: "", category: "" });
  const [eventForm, setEventForm] = useState({ title: "", description: "", venue: "", clubId: "", eventDate: "" });
  const [annForm, setAnnForm] = useState({ title: "", content: "", clubId: "" });
  const [message, setMessage] = useState("");

  if (!user || (user.role !== "ADMIN" && user.role !== "CLUB_COORDINATOR")) {
    return <div className="card"><p>You need coordinator or admin access to view this page.</p></div>;
  }

  async function createClub(e) {
    e.preventDefault();
    await api.post("/clubs", { ...clubForm, coordinatorId: user.id });
    setMessage("Club created");
    setClubForm({ name: "", description: "", category: "" });
  }

  async function createEvent(e) {
    e.preventDefault();
    await api.post("/events", { ...eventForm, clubId: Number(eventForm.clubId) });
    setMessage("Event created");
    setEventForm({ title: "", description: "", venue: "", clubId: "", eventDate: "" });
  }

  async function postAnnouncement(e) {
    e.preventDefault();
    await api.post("/announcements", { ...annForm, clubId: Number(annForm.clubId) });
    setMessage("Announcement posted");
    setAnnForm({ title: "", content: "", clubId: "" });
  }

  return (
    <div className="card">
      <h1>Admin</h1>
      {message && <p className="success">{message}</p>}

      <section>
        <h2>Create club</h2>
        <form onSubmit={createClub}>
          <label>Name</label>
          <input value={clubForm.name} onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })} required />
          <label>Category</label>
          <input value={clubForm.category} onChange={(e) => setClubForm({ ...clubForm, category: e.target.value })} />
          <label>Description</label>
          <textarea value={clubForm.description} onChange={(e) => setClubForm({ ...clubForm, description: e.target.value })} />
          <button type="submit">Create club</button>
        </form>
      </section>

      <section>
        <h2>Create event</h2>
        <form onSubmit={createEvent}>
          <label>Club ID</label>
          <input value={eventForm.clubId} onChange={(e) => setEventForm({ ...eventForm, clubId: e.target.value })} required />
          <label>Title</label>
          <input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
          <label>Venue</label>
          <input value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} />
          <label>Date</label>
          <input type="datetime-local" value={eventForm.eventDate} onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })} />
          <label>Description</label>
          <textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} />
          <button type="submit">Create event</button>
        </form>
      </section>

      <section>
        <h2>Post announcement</h2>
        <form onSubmit={postAnnouncement}>
          <label>Club ID</label>
          <input value={annForm.clubId} onChange={(e) => setAnnForm({ ...annForm, clubId: e.target.value })} required />
          <label>Title</label>
          <input value={annForm.title} onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })} required />
          <label>Content</label>
          <textarea value={annForm.content} onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })} />
          <button type="submit">Post</button>
        </form>
      </section>
    </div>
  );
}
