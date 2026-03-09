<?php
require_once 'models/Utilisateur.php';
require_once 'models/Evenement.php';
require_once 'models/Reservation.php';

class AdminControleur
{
    private $modeleUtilisateur;
    private $modeleEvenement;
    private $modeleReservation;

    /**
     * Constructeur de AdminControleur.
     * Initialise les modèles nécessaires pour l'administration.
     * 
     * @param mysqli $db Connexion à la base de données.
     */
    public function __construct($db)
    {
        $this->modeleUtilisateur = new Utilisateur($db);
        $this->modeleEvenement = new Evenement($db);
        $this->modeleReservation = new Reservation($db);
    }

    /**
     * Affiche le tableau de bord principal de l'administrateur.
     * Processus :
     * 1. Vérifie si l'utilisateur est connecté et possède le rôle 'administrateur'.
     * 2. Si non, redirige vers l'accueil.
     * 3. Si oui, récupère les statistiques globales, la liste des utilisateurs et les événements publics.
     * 4. Charge la vue du tableau de bord.
     */
    public function dashboard()
    {
        if (!isset($_SESSION['utilisateur_id']) || $_SESSION['role'] !== 'administrateur') {
            header("Location: index.php?action=accueil");
            exit();
        }

        $stats = $this->modeleReservation->statsGlobales();
        $utilisateurs = $this->modeleUtilisateur->listerTous();
        $evenements = $this->modeleEvenement->listerPublics();

        require 'views/admin/dashboard.php';
    }

    /**
     * Gestion des utilisateurs.
     */
    /**
     * Point de terminaison API retournant les statistiques globales.
     * Processus :
     * 1. Valide les droits d'accès administrateur.
     * 2. Agrège les données provenant de plusieurs modèles (Réservations, Utilisateurs, Événements).
     * 3. Retourne le tout au format JSON pour une utilisation côté client (React/Vue).
     */
    public function admin_stats_api()
    {
        if (!isset($_SESSION['utilisateur_id']) || $_SESSION['role'] !== 'administrateur') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Accès interdit']);
            return;
        }

        $stats = $this->modeleReservation->statsGlobales();
        $utilisateurs = $this->modeleUtilisateur->listerTous();
        $evenements = $this->modeleEvenement->listerTousAdmin();

        echo json_encode([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'utilisateurs' => $utilisateurs,
                'evenements' => $evenements
            ]
        ]);
    }
}
?>
