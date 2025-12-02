const HOST = process.env.NEXT_PUBLIC_API_HOST;
const PORT = process.env.NEXT_PUBLIC_API_PORT;

// Menggabungkan menjadi URL lengkap, misal: http://localhost:8080/api
// Sesuaikan protokol (http/https) jika nanti menggunakan SSL
export const API_BASE_URL = `http://${HOST}:${PORT}/api`;

// Opsional: Object helper untuk endpoint spesifik agar lebih rapi
export const ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    CUSTOMERS: `${API_BASE_URL}/customers`,
};