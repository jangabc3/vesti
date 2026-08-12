import axios from "axios";

export const ACCESS_TOKEN_KEY = "vesti-access-token";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("인증이 필요하거나 로그인 정보가 만료되었습니다.");
    }

    return Promise.reject(error);
  },
);

export function setAccessToken(token) {
  if (!token) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export default apiClient;
