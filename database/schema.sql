CREATE DATABASE IF NOT EXISTS event_managment;
USE event_managment;

-- Table : utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    photo_profil VARCHAR(255) DEFAULT 'default_profile.png',
    role ENUM('client', 'organisateur', 'administrateur') NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table : evenements
CREATE TABLE IF NOT EXISTS evenements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_organisateur INT NOT NULL,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    date_evenement DATETIME NOT NULL,
    date_fin DATETIME,
    lieu VARCHAR(200),
    categorie VARCHAR(100),
    prix_base DECIMAL(10, 2) DEFAULT 0.00,
    capacite INT,
    image VARCHAR(255),
    statut ENUM('brouillon', 'publie', 'termine') DEFAULT 'brouillon',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_organisateur) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table : types_tickets
CREATE TABLE IF NOT EXISTS types_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_evenement INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prix DECIMAL(10, 2) NOT NULL,
    quantite_disponible INT NOT NULL,
    FOREIGN KEY (id_evenement) REFERENCES evenements(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table : evenement_images
CREATE TABLE IF NOT EXISTS evenement_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_evenement INT NOT NULL,
    chemin_image VARCHAR(255) NOT NULL,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_evenement) REFERENCES evenements(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table : reservations
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_client INT NOT NULL,
    id_evenement INT NOT NULL,
    date_reservation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('en_attente', 'payee', 'annulee') DEFAULT 'en_attente',
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_client) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (id_evenement) REFERENCES evenements(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table : paiements
CREATE TABLE IF NOT EXISTS paiements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_reservation INT NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    methode VARCHAR(50) DEFAULT 'carte',
    transaction_id VARCHAR(100) UNIQUE,
    date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_reservation) REFERENCES reservations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table : tickets
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_reservation INT NOT NULL,
    id_type_ticket INT NOT NULL,
    code_unique VARCHAR(50) UNIQUE NOT NULL,
    qr_code VARCHAR(255),
    statut ENUM('valide', 'utilise') DEFAULT 'valide',
    FOREIGN KEY (id_reservation) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (id_type_ticket) REFERENCES types_tickets(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- DONNÉES DE TEST (Mot de passe : test1234)
-- ==========================================

-- Utilisateurs
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role) VALUES 
('Admin', 'Super', 'admin@test.com', '$2y$10$M7n3slxcI3qF.rrXUM5TceDwWhF.p6B/2uTmwTjGpWmkB6qsZ6cXW', 'administrateur'),
('Organisateur', 'Jean', 'org@test.com', '$2y$10$M7n3slxcI3qF.rrXUM5TceDwWhF.p6B/2uTmwTjGpWmkB6qsZ6cXW', 'organisateur'),
('Client', 'Alice', 'client@test.com', '$2y$10$M7n3slxcI3qF.rrXUM5TceDwWhF.p6B/2uTmwTjGpWmkB6qsZ6cXW', 'client');

-- Événements
INSERT INTO evenements (id_organisateur, titre, description, date_evenement, lieu, categorie, prix_base, capacite, image, statut) VALUES 
(2, 'Concert de Jazz', 'Un magnifique concert sous les étoiles.', '2024-12-15 20:00:00', 'Parc Central', 'Concert', 25.00, 200, 'default.jpg', 'publie'),
(2, 'Atelier Cuisine', 'Apprenez à faire de la cuisine avec nous !', '2024-11-20 10:00:00', 'Cuisine de Lyon', 'Autre', 15.00, 20, 'default.jpg', 'publie');

-- Types de Tickets
INSERT INTO types_tickets (id_evenement, nom, prix, quantite_disponible) VALUES 
(1, 'Standard', 25.00, 150),
(1, 'VIP', 50.00, 50),
(2, 'Unique', 15.00, 20);
