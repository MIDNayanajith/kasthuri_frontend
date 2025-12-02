import axios from "axios";

const axiosConfig = axios.create({
  baseURL: "http://localhost:8080/api/v1.0/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const excludeEndPoints = ["/login", "/status", "/activate", "/health"];

// Add a request interceptor
axiosConfig.interceptors.request.use(
  (config) => {
    const shouldSkipToken = excludeEndPoints.some((endpoint) => {
      return config.url?.includes(endpoint);
    });
    if (!shouldSkipToken) {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//response interceptor
axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again later.");
    }
    return Promise.reject(error);
  }
);

export default axiosConfig;
