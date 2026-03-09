<?php
/**
 * Point d'entrée principal (Front Controller)
 */
session_start();

// CORS Headers for React Frontend
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Accept");

// Handle Preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Add JSON header for API routes
if (str_contains($_GET['action'] ?? '', '_api')) {
    header('Content-Type: application/json');
}

require_once 'connexion.php';

// Chargement automatique des contrôleurs (simplifié)
require_once 'controllers/AuthentificationControleur.php';
require_once 'controllers/EvenementControleur.php';
require_once 'controllers/ReservationControleur.php';
require_once 'controllers/AdminControleur.php';
require_once 'controllers/TicketControleur.php';

$action = $_GET['action'] ?? 'accueil';

// Initialisation des contrôleurs
$authCtrl = new AuthentificationControleur($connexion);
$evCtrl = new EvenementControleur($connexion);
$resCtrl = new ReservationControleur($connexion);
$adminCtrl = new AdminControleur($connexion);
$ticketCtrl = new TicketControleur($connexion);

// Routage basique
switch ($action) {
    // API Routes for React
    case 'connexion_api':
        $authCtrl->connexion_api();
        break;
    case 'check_auth_api':
        $authCtrl->check_auth_api();
        break;
    case 'deconnexion_api':
        $authCtrl->deconnexion_api();
        break;
    case 'inscription_api':
        $authCtrl->inscription_api();
        break;
    case 'evenements_api':
        $evCtrl->liste_api();
        break;
    case 'details_api':
        $evCtrl->details_api();
        break;
    case 'admin_stats_api':
        $adminCtrl->admin_stats_api();
        break;
    case 'organizer_stats_api':
        $evCtrl->stats_organisateur_api();
        break;
    case 'mes_evenements_api':
        $evCtrl->mes_evenements_api();
        break;

    // ... existants ...
    case 'telecharger_ticket':
        $ticketCtrl->telecharger();
        break;
    case 'scanner_ticket':
        $ticketCtrl->scanner();
        break;
    case 'accueil':
        $evCtrl->accueil();
        break;
    case 'details':
        $evCtrl->details();
        break;
    case 'inscription':
        $authCtrl->inscription();
        break;
    case 'connexion':
        $authCtrl->connexion();
        break;
    case 'deconnexion':
        $authCtrl->deconnexion();
        break;
    case 'mes_evenements':
        $evCtrl->mesEvenements();
        break;
    case 'creer_evenement':
        $evCtrl->creer();
        break;
    case 'modifier_evenement':
        $evCtrl->modifier();
        break;
    case 'reserver':
        $resCtrl->reserver();
        break;
    case 'paiement':
        $resCtrl->paiement();
        break;
    case 'mes_reservations':
        $resCtrl->mesReservations();
        break;
    case 'admin_dashboard':
        $adminCtrl->dashboard();
        break;
    case 'admin_supprimer_user':
        $adminCtrl->supprimerUtilisateur();
        break;
    case 'mon_profil':
        $authCtrl->profil();
        break;
    default:
        $evCtrl->accueil();
        break;
}
?>
