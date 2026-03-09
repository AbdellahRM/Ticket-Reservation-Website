<?php
require_once 'models/Ticket.php';
require_once 'models/Reservation.php';

class TicketControleur
{
    private $modeleTicket;
    private $modeleReservation;

    /**
     * Constructeur de TicketControleur.
     * @param mysqli $db Connexion à la base de données.
     */
    public function __construct($db)
    {
        $this->modeleTicket = new Ticket($db);
        $this->modeleReservation = new Reservation($db);
    }

    /**
     * Gère la visualisation et simulation de téléchargement d'un ticket.
     * Processus :
     * 1. Sécurise l'accès en vérifiant l'ID de réservation et le propriétaire.
     * 2. Récupère les détails du ticket généré.
     * 3. Affiche une vue optimisée simulant le ticket PDF (prêt à être imprimé).
     */
    public function telecharger()
    {
        $id_res = $_GET['id_res'] ?? null;
        if (!$id_res)
            exit("Accès refusé");

        $reservation = $this->modeleReservation->chargerParId($id_res);
        $tickets = $this->modeleTicket->listerParReservation($id_res);

        if (!$reservation || $reservation['id_client'] != $_SESSION['utilisateur_id']) {
            exit("Vous n'avez pas accès à ce ticket.");
        }

        // Ici, on simule la génération PDF car FPDF est une bibliothèque externe.
        // On va afficher une vue "Ticket" qui peut être imprimée ou transformée en PDF.
        require 'views/ticket_pdf_simu.php';
    }

    /**
     * Affiche et traite l'interface de scan des tickets pour les organisateurs.
     * Processus :
     * 1. Valide que l'utilisateur connecté est bien un organisateur.
     * 2. Si un code unique est envoyé via POST, tente de valider le ticket dans le modèle.
     * 3. Affiche un message de succès (ticket valide) ou d'erreur (ticket frauduleux ou déjà utilisé).
     */
    public function scanner()
    {
        if (!isset($_SESSION['utilisateur_id']) || $_SESSION['role'] !== 'organisateur') {
            header("Location: index.php");
            exit();
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $code = $_POST['code_unique'];
            if ($this->modeleTicket->valider($code)) {
                $message = "Ticket validé avec succès !";
                $type = "success";
            }
            else {
                $message = "Ticket invalide ou déjà utilisé.";
                $type = "danger";
            }
        }
        require 'views/organisateur/scanner.php';
    }
}
?>
