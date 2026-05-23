import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000", // Your Express backend
  withCredentials: true,
});

export default instance;
