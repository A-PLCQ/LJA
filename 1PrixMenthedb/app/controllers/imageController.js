// imageController.js - Contrôleur pour gérer les images des produits

const fs = require('fs');
const path = require('path');
const multer = require('multer');

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

// Fonction pour uploader une image
const uploadImage = (req, res) => {
  try {
    res.status(200).json({ message: 'Image uploadée avec succès', filePath: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'upload de l\'image', error: error.message });
  }
};

// Fonction pour récupérer les images d'un modèle
const getImages = (req, res) => {
  const { type, brand, model } = req.params;
  const folderPath = path.join(__dirname, '../../uploads', type, brand, model);

  try {
    const files = fs.readdirSync(folderPath).map(file => {
      // Générer le chemin d'accès correct et appliquer les remplacements
      return path.join(`/uploads/${type}/${brand}/${model}`, file)
        .replace(/\\/g, '/') // Remplace les backslashes par des slashes
        .replace(/ /g, '-'); // Remplace les espaces par des tirets
    });
    
    res.status(200).json({ images: files });
  } catch (error) {
    res.status(404).json({ message: 'Images non trouvées', error: error.message });
  }
};


// Fonction pour supprimer une image spécifique
const deleteImage = (req, res) => {
  const { type, brand, model, imageName } = req.params;
  const filePath = path.join(__dirname, '../../uploads', type, brand, model, imageName);

  try {
    fs.unlinkSync(filePath);
    res.status(200).json({ message: 'Image supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'image', error: error.message });
  }
};

module.exports = {
  uploadImage: upload.single('image'), // Middleware Multer pour une seule image
  getImages,
  deleteImage,
};
