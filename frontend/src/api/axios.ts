import axios from 'axios';

// Replace with the actual URL of your PHP backend
const API_BASE_URL = 'http://localhost/Deuxieme_Anne/BackEnd/Chakchabani/index.php';

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for session cookies
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor to handle global errors (e.g., unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access globally (e.g. redirect to login)
            console.error('Non autorisé');
        }
        return Promise.reject(error);
    }
);
