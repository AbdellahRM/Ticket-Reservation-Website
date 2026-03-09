# EventZ&A - Application de Réservation d'Événements

Plateforme complète de gestion et réservation d'événements développée en PHP 8+ avec architecture MVC.

## 🚀 Installation locale (WAMP / XAMPP)

1. **Copier le projet** : Placez le dossier `Chakchabani` dans `C:\wamp64\www\` ou `C:\xampp\htdocs\`.
2. **Base de données** :
    - Ouvrez **phpMyAdmin**.
    - Créez une base de données nommée `event_managment`.
    - Importez le fichier `database/schema.sql` situé à la racine du projet.
3. **Configuration** :
    - Le fichier `connexion.php` est configuré par défaut pour `root` sans mot de passe. Modifiez-le si nécessaire.
4. **Lancement** :
    - Accédez à `http://localhost/Chakchabani/index.php`.

## 📂 Structure du projet

- `models/` : Classes PHP interagissant avec la base de données.
- `controllers/` : Logique métier et routage des actions.
- `views/` : Fichiers d'affichage HTML/PHP.
- `public/` : Ressources statiques (CSS, Images).
- `connexion.php` : Instance de connexion mysqli.
- `index.php` : Point d'entrée unique.

## 🛠 Fonctionnalités incluses

- **Authentification** : Gestion des rôles (Client, Organisateur, Admin).
- **Événements** : CRUD complet pour les organisateurs.
- **Réservations** : Système de panier, simulation de paiement.
- **Tickets** : Génération de tickets avec QR Code unique (via Google Charts API).
- **Administration** : Statistiques globales et gestion des utilisateurs.
- **Scan** : Simulation d'interface de contrôle des tickets à l'entrée.

## 🔒 Sécurité

- Requêtes préparées `mysqli` obligatoires.
- Hachage des mots de passe avec `password_hash()`.
- Protection contre les failles XSS via `htmlspecialchars()`.
- Gestion des accès par session selon le rôle utilisateur.
"# Ticket-Reservation-Website" 
"# Ticket-Reservation-Website" 
