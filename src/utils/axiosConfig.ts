// axiosInstance.ts
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://e1d8-123-20-76-221.ngrok-free.app',  // Replace with your base API URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,  // Set a timeout (optional)
});

export default axiosInstance;
