const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? `http://${window.location.hostname}:5000`
    : "https://to-do-app-616k.onrender.com");

export default API_BASE_URL;
