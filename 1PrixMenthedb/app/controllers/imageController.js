// imageController.js - Contrôleur pour gérer les images des produits

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { Images } = require('../models');
const { HTTP_STATUS } = require('../config/constants');

// Configuration de Multer pour l'upload dynamique
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type, brand, model } = req.body;
    const folderPath = path.join(__dirname, '../../uploads', type, brand, model);

    // Création du répertoire si nécessaire
    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const { model } = req.body;
    const fileIndex = Date.now(); // Utiliser un timestamp pour éviter les collisions
    cb(null, `${model}_${fileIndex}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Ajouter une nouvelle image
const addImage = async (req, res) => {
  try {
    const { id_printer, id_consumable, url, is_primary } = req.body;

    // Validation: une seule référence doit être définie (soit imprimante, soit consommable)
    if ((id_printer && id_consumable) || (!id_printer && !id_consumable)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Il faut définir soit id_printer, soit id_consumable, mais pas les deux.' });
    }

    const newImage = await Images.create({ id_printer, id_consumable, url, is_primary });
    res.status(HTTP_STATUS.CREATED).json(newImage);
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Erreur lors de l'ajout de l'image.", error: error.message });
  }
};

// Fonction pour uploader une image
const uploadImage = (req, res) => {
  try {
    res.status(200).json({ message: 'Image uploadée avec succès', filePath: req.file.path });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'upload de l'image", error: error.message });
  }
};

// Récupérer les images par produit (imprimante ou consommable)
const getImagesByProduct = async (req, res) => {
  try {
    const { type, brand, model } = req.params;
    const folderPath = path.join(__dirname, '../../uploads', type, brand, model);

    const files = fs.readdirSync(folderPath).map(file => {
      // Générer le chemin d'accès correct et appliquer les remplacements
      return path.join(`/uploads/${type}/${brand}/${model}`, file)
        .replace(/\\/g, '/') // Remplace les backslashes par des slashes
        .replace(/ /g, '-'); // Remplace les espaces par des tirets
    });
    
    res.status(HTTP_STATUS.OK).json({ images: files });
  } catch (error) {
    res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Images non trouvées', error: error.message });
  }
};

// Mettre à jour une image par ID
const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, is_primary } = req.body;

    const image = await Images.findByPk(id);
    if (!image) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Image non trouvée.' });
    }

    image.url = url || image.url;
    image.is_primary = is_primary !== undefined ? is_primary : image.is_primary;
    await image.save();

    res.status(HTTP_STATUS.OK).json({ message: 'Image mise à jour avec succès.', image });
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Erreur lors de la mise à jour de l'image.", error: error.message });
  }
};

// Supprimer une image par ID
const deleteImage = async (req, res) => {
  try {
    const { type, brand, model, imageName } = req.params;
    const filePath = path.join(__dirname, '../../uploads', type, brand, model, imageName);

    fs.unlinkSync(filePath);
    res.status(HTTP_STATUS.OK).json({ message: 'Image supprimée avec succès.' });
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: "Erreur lors de la suppression de l'image.", error: error.message });
  }
};

module.exports = {
  addImage,
  uploadImage: upload.single('image'), 
  getImagesByProduct,
  updateImage,
  deleteImage,
};
