import api from './api';

// Fonction pour récupérer les imprimantes compatibles pour un consommable
export const getCompatiblePrintersByConsumable = async (consumableId) => {
  const response = await api.get(`/compatibles/consumable/${consumableId}`);
  return response.data;
};

// Fonction pour récupérer les consommables compatibles pour une imprimante
export const getCompatibleConsumablesByPrinter = async (printerId) => {
  const response = await api.get(`/compatibles/printer/${printerId}`);
  return response.data;
};

// Fonction pour ajouter une compatibilité entre une imprimante et un consommable (admin ou manager requis)
export const addCompatibility = async (compatibilityData) => {
  const response = await api.post('/compatibles', compatibilityData);
  return response.data;
};

// Fonction pour supprimer une compatibilité entre une imprimante et un consommable
export const deleteCompatibility = async (printerId, consumableId) => {
  const response = await api.delete(`/compatibles/${printerId}/${consumableId}`);
  return response.data;
};

export default {
  getCompatiblePrintersByConsumable,
  getCompatibleConsumablesByPrinter,
  addCompatibility,
  deleteCompatibility,
};
