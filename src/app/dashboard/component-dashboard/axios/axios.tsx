import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://121.58.249.178:8001/",
});

// Request Interceptor
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("Authorization");
    // Only add header if token actually exists and isn't a "null" string
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // 1. Clear the bad token immediately
      localStorage.removeItem("Authorization");

      // 2. ONLY redirect if we aren't already on the login page
      // This prevents the "Infinite Loop"
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        console.error("Session expired. Redirecting to login...");
        window.location.href = "/";
      }

      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
