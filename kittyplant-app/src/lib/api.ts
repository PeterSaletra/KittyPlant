import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.DEV ? "http://localhost:8000/api/" : "/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

export default instance;
