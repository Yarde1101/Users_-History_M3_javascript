import axios from 'axios';

// URL base de usuarios desde el .env
const AUTH_API = import.meta.env.VITE_AUTH_API;

// Tiempo máximo de espera
const TIME_OUT = import.meta.env.VITE_TIME_OUT;

// Cliente HTTP centralizado con axios
const httpClient = axios.create({
    baseURL: AUTH_API,
    timeout: TIME_OUT
});

// Interceptor de petición: muestra en consola qué se está pidiendo
httpClient.interceptors.request.use(
    config => {
        console.log(`[REQUEST]: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    error => Promise.reject(error)
);

// Interceptor de respuesta: muestra en consola si algo falla
httpClient.interceptors.response.use(
    response => response,
    error => {
        console.error('[API ERROR]:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default httpClient;
