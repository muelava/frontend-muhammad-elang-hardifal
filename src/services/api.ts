import axios from "axios";

const BASE_URL = "http://202.157.176.100:3001";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // config.headers.Authorization = `Bearer ${token}`;
    console.log("Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      "Response error:",
      error.response?.status,
      error.response?.data
    );

    // Handle different error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log("Unauthorized access");
    } else if (error.response?.status === 500) {
      // Handle server errors
      console.log("Server error");
    } else if (error.code === "ECONNABORTED") {
      // Handle timeout
      console.log("Request timeout");
    }

    return Promise.reject(error);
  }
);

export default api;
