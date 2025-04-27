import axios from "axios";

// const baseURL = import.meta.env.OFFLINE
//   ? "http://localhost:3000"
//   : import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const baseURL=import.meta.env.VITE_API_BASE_URL 
const api = axios.create({
  baseURL,
});
  
// Add request interceptor (preserves your existing components)
api.interceptors.request.use(config => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    return config;
});

export default api;