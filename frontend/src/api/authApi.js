import apiClient, { removeAccessToken, setAccessToken } from "@/api/apiClient";

export async function login({ email, password }) {
  const response = await apiClient.post("/users/login", {
    email,
    password,
  });

  const loginData = response.data;

  if (loginData?.token) {
    setAccessToken(loginData.token);
  }

  return loginData;
}

export async function signup({ email, password }) {
  const response = await apiClient.post("/users/signup", {
    email,
    password,
  });

  return response.data;
}

export async function getMyProfile() {
  const response = await apiClient.get("/users/me");

  return response.data;
}

export function logout() {
  removeAccessToken();
}
