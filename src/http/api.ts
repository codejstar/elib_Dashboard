import axios from "axios";

const api = axios.create({
  // to do : move this value to env variable
  baseURL: "http://localhost:5514",
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (data: { email: string; password: string }) =>
  api.post("/apis/users/login", data);

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/apis/users/register", data);
