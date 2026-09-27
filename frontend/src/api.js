import axios from "axios";

// In production this is injected by the frontend Docker/nginx config or
// falls back to same-origin "/api" if you put an nginx reverse proxy in front.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE,
});

export default api;
