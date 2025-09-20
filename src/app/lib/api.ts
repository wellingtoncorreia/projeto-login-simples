import axios from 'axios';

// A URL da API agora é lida da variável de ambiente
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default api;