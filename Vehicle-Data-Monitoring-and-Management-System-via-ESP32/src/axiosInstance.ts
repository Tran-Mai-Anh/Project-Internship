import axios from "axios";
import { router } from "./routes/MapRouter";

const axiosInstance = axios.create({
  baseURL: "https://a79d50e67e9a.ngrok-free.app/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized - Redirecting to login");
      router.navigate("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
