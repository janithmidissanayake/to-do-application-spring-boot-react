import axios from 'axios';

// Axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
