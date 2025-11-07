import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.error("Błąd autoryzacji (401). Wylogowywanie.");
      localStorage.removeItem("jwtToken");
    }
    return Promise.reject(error);
  }
);
