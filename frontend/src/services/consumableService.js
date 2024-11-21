import api from './api';

// Fonction pour récupérer la liste des consommables
export const getConsumables = async () => {
  const response = await api.get('/consumables');
  return response.data;
};

// Fonction pour récupérer les détails d'un consommable par ID
export const getConsumableById = async (id) => {
  const response = await api.get(`/consumables/${id}`);
  return response.data;
};

// Fonction pour ajouter un nouveau consommable (admin ou manager requis)
export const addConsumable = async (consumableData) => {
  const response = await api.post('/consumables', consumableData);
  return response.data;
};

// Fonction pour mettre à jour les informations d'un consommable
export const updateConsumable = async (id, consumableData) => {
  const response = await api.put(`/consumables/${id}`, consumableData);
  return response.data;
};

// Fonction pour supprimer un consommable
export const deleteConsumable = async (id) => {
  const response = await api.delete(`/consumables/${id}`);
  return response.data;
};

export default {
  getConsumables,
  getConsumableById,
  addConsumable,
  updateConsumable,
  deleteConsumable,
};
