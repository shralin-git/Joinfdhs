import axios from "axios";
import { useAuth } from "../context/AuthContext";


const apiClient = axios.create({
  baseURL: "https://asia-south1-mediksharegistration.cloudfunctions.net",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("idToken"); // Retrieve idToken from local storage
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiService = {
  get: async (url: string, params = {}) => {
    try {
      console.log("API GET Request: ", url, params, apiClient.defaults.headers);
      const response = await apiClient.get(url, { params });
      console.log("API GET Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("API GET Error:", error.response || error.message);
      throw error;
    }
  },
};