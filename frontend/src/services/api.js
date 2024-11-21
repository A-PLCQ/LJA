import axios from 'axios';

// Configuration d'Axios avec l'URL de l'API, récupérée des variables d'environnement
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Utilisation de Vite pour les variables d'environnement
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requêtes pour attacher le token d'authentification s'il existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs globales et rafraîchir le token si nécessaire
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Gestion des erreurs 401 : Token expiré, essayer de rafraîchir le token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Mise à jour des tokens dans le localStorage
          localStorage.setItem('authToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Mise à jour du header Authorization et rejouer la requête initiale
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Erreur lors du rafraîchissement du token, redirection vers la page de connexion.');
        // Redirection vers la page de connexion ou autre action appropriée
      }
    }
    return Promise.reject(error);
  }
);

export default api;
