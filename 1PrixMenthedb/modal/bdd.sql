-- Création de la base de données
CREATE DATABASE IF NOT EXISTS PrixMentheDB;
USE PrixMentheDB;

-- Création de la table utilisateur
CREATE TABLE IF NOT EXISTS users (
  id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100),
  prenom VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  mot_de_passe VARCHAR(255),
  telephone VARCHAR(15),
  adresse VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  last_login DATETIME
);

-- Table des imprimantes (printers)
CREATE TABLE IF NOT EXISTS printers (
    id_printer INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    product_series VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    reference VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    weight_kg DECIMAL(5, 2) NOT NULL CHECK (weight_kg > 0),
    print_speed_ppm INT NOT NULL,
    scan_speed_ipm INT NOT NULL,
    copy_volume_per_month VARCHAR(50) NOT NULL,
    color_support BOOLEAN NOT NULL,
    supports_A3 BOOLEAN NOT NULL,
    supports_A4 BOOLEAN NOT NULL,
    connectivity VARCHAR(255) NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    short_description TEXT,
    detailed_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX (model)
);

-- Table des consommables (consumables)
CREATE TABLE IF NOT EXISTS consumables (
    id_consumable INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    reference VARCHAR(100) UNIQUE NOT NULL,
    compatible_printer VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    weight_kg DECIMAL(5, 2) NOT NULL,
    page_capacity INT NOT NULL,
    size VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    stock INT NOT NULL
);

CREATE TABLE IF NOT EXISTS compatible_printers (
    id_consumable INT NOT NULL,
    id_printer INT NOT NULL,
    PRIMARY KEY (id_consumable, id_printer),
    FOREIGN KEY (id_consumable) REFERENCES consumables(id_consumable) ON DELETE CASCADE,
    FOREIGN KEY (id_printer) REFERENCES printers(id_printer) ON DELETE CASCADE
);

-- Table des images (images)
CREATE TABLE IF NOT EXISTS images (
    id_image INT AUTO_INCREMENT PRIMARY KEY,
    id_printer INT,
    id_consumable INT,
    url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_printer) REFERENCES printers(id_printer) ON DELETE CASCADE,
    FOREIGN KEY (id_consumable) REFERENCES consumables(id_consumable) ON DELETE CASCADE,
    CHECK (
        (id_printer IS NOT NULL AND id_consumable IS NULL) OR
        (id_printer IS NULL AND id_consumable IS NOT NULL)
    )
);

-- Création de la table commande
CREATE TABLE IF NOT EXISTS orders (
  id_commande INT AUTO_INCREMENT PRIMARY KEY,
  id_utilisateur INT,
  montant_total DECIMAL(10, 2),
  status VARCHAR(50),
  date_commande DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
  adresse_livraison VARCHAR(255),
  FOREIGN KEY (id_utilisateur) REFERENCES users(id_utilisateur)
);

-- Création de la table paiement
CREATE TABLE IF NOT EXISTS payments (
  id_paiement INT AUTO_INCREMENT PRIMARY KEY,
  id_commande INT,
  montant DECIMAL(10, 2),
  methode_paiement VARCHAR(50),
  date_paiement DATETIME DEFAULT CURRENT_TIMESTAMP,
  statut VARCHAR(50),
  transaction_id VARCHAR(100) UNIQUE,
  FOREIGN KEY (id_commande) REFERENCES orders(id_commande)
);

-- Création de la table panier (cart_items pour plus de flexibilité)
CREATE TABLE IF NOT EXISTS cart_items (
    id_cart_item INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255),
    id_utilisateur INT,
    id_printer INT,
    id_consumable INT,
    quantite INT NOT NULL CHECK (quantite > 0),
    version INT DEFAULT 0,
    date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_utilisateur) REFERENCES users(id_utilisateur),
    FOREIGN KEY (id_printer) REFERENCES printers(id_printer),
    FOREIGN KEY (id_consumable) REFERENCES consumables(id_consumable)
);


-- Création de la table commande_produit pour relier les commandes aux produits (imprimantes et consommables)
CREATE TABLE IF NOT EXISTS order_items (
  id_commande INT,
  id_printer INT,
  id_consumable INT,
  quantite INT,
  PRIMARY KEY (id_commande, id_printer, id_consumable),
  FOREIGN KEY (id_commande) REFERENCES orders(id_commande),
  FOREIGN KEY (id_printer) REFERENCES printers(id_printer),
  FOREIGN KEY (id_consumable) REFERENCES consumables(id_consumable),
  CHECK (
      (id_printer IS NOT NULL AND id_consumable IS NULL) OR
      (id_printer IS NULL AND id_consumable IS NOT NULL)
  )
);

-- Création de la table refresh_tokens pour gérer les tokens de renouvellement
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  expires_at DATETIME NOT NULL,
  is_revoked BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  device_info VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id_utilisateur)                      
);

/* SQL Indexation */

-- Indexation des colonnes dans la table imprimante
CREATE INDEX idx_printer_brand_model ON printers (brand, model);
CREATE INDEX idx_consumable_brand_model ON consumables (brand, model);
CREATE INDEX idx_compatible_printers ON compatible_printers (id_printer, id_consumable);

-- Indexation des clés étrangères dans les tables liées aux utilisateurs
CREATE INDEX idx_id_utilisateur_cart_items ON cart_items (id_utilisateur);
CREATE INDEX idx_id_utilisateur_orders ON orders (id_utilisateur);
CREATE INDEX idx_id_commande_payments ON payments (id_commande);
CREATE INDEX idx_id_utilisateur_tokens ON refresh_tokens (user_id);

-- Indexation pour améliorer la recherche par statut et date
CREATE INDEX idx_status_orders ON orders (status);
CREATE INDEX idx_date_commande_orders ON orders (date_commande);
CREATE INDEX idx_statut_payments ON payments (statut);
CREATE INDEX idx_date_paiement_payments ON payments (date_paiement);
