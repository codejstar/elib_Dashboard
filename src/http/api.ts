import axios from "axios";
import useTokenStore from "@/store";

const api = axios.create({
  // to do : move this value to env variable
  baseURL: "http://localhost:5514",
  headers: {
    "Content-Type": "application/json",
  },
});

//interceptor is just like a middelware every request pass this middleware
api.interceptors.request.use((config) => {
  const token = useTokenStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const login = async (data: { email: string; password: string }) =>
  api.post("/apis/users/login", data);

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/apis/users/register", data);

export const getBooks = async () => api.get("/api/books");

export const createBook = async (data: FormData) =>
  api.post("/api/books", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
