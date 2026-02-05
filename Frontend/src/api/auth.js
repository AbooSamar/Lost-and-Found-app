// api/auth.js
import api from "./axios";

export const registerUser = async (payload) => {
  const { data } = await api.post("/api/v1/auth/register", payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/api/v1/auth/login", payload);
  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post("/api/v1/auth/logout");
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/api/v1/auth/profile");
  return data.user;
};
