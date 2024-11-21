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

// Fonction pour récupérer les images d'un produit spécifique (imprimante ou consommable)
export const getImagesByProduct = async (type, brand, model) => {
  const response = await api.get(`/images/${type}/${brand}/${model}`);
  return response.data;
};

// Fonction pour uploader une image (admin ou manager requis)
export const uploadImage = async (formData) => {
  const response = await api.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Fonction pour ajouter une image en base de données
export const addImage = async (imageData) => {
  const response = await api.post('/images', imageData);
  return response.data;
};

// Fonction pour mettre à jour une image par ID
export const updateImage = async (id, imageData) => {
  const response = await api.put(`/images/${id}`, imageData);
  return response.data;
};

// Fonction pour supprimer une image spécifique
export const deleteImage = async (type, brand, model, imageName) => {
  const response = await api.delete(`/images/${type}/${brand}/${model}/${imageName}`);
  return response.data;
};

export default {
  getCompatiblePrintersByConsumable,
  getCompatibleConsumablesByPrinter,
  addCompatibility,
  deleteCompatibility,
  getImagesByProduct,
  uploadImage,
  addImage,
  updateImage,
  deleteImage,
};
