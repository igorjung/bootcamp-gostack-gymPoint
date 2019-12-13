import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3264',
});

export default api;
