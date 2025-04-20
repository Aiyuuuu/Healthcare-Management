import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000'// Now points to 3000
  });

  console.log(import.meta.env.VITE_API_BASE_URL)
  
// Add request interceptor (preserves your existing components)
api.interceptors.request.use(config => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    return config;
});

export default api;