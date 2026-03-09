<?php
require_once 'models/Reservation.php';
require_once 'models/TypeTicket.php';
require_once 'models/Ticket.php';
require_once 'models/Paiement.php';

class ReservationControleur
{
    private $modeleReservation;
    private $modeleTypeTicket;
    private $modeleTicket;
    private $modelePaiement;

    /**
     * Constructeur de ReservationControleur.
     * Initialise les modèles nécessaires pour le cycle de vie d'une réservation.
     * 
     * @param mysqli $db Connexion à la base de données.
     */
    public function __construct($db)
    {
        $this->modeleReservation = new Reservation($db);
        $this->modeleTypeTicket = new TypeTicket($db);
        $this->modeleTicket = new Ticket($db);
        $this->modelePaiement = new Paiement($db);
    }

    /**
     * Initie le processus de réservation pour un client.
     * Processus :
     * 1. Vérifie si l'utilisateur est connecté.
     * 2. Si POST, récupère le type de ticket choisi.
     * 3. Calcule le prix total via le modèle TypeTicket.
     * 4. Crée une entrée de réservation 'en attente'.
     * 5. Redirige vers l'étape de paiement.
     */
    public function reserver()
    {
        if (!isset($_SESSION['utilisateur_id'])) {
            header("Location: index.php?action=connexion");
            exit();
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id_ev = $_POST['id_evenement'];
            $id_type = $_POST['id_type_ticket'];
            $quantite = 1; // Simplification pour le moment

            // Récupérer le prix du type de ticket
            $type = $this->modeleTypeTicket->chargerParId($id_type);
            $total = $type['prix'];

            $id_res = $this->modeleReservation->creer($_SESSION['utilisateur_id'], $id_ev, $total);
            if ($id_res) {
                header("Location: index.php?action=paiement&id_res=" . $id_res);
                exit();
            }
        }
    }

    /**
     * Simule l'étape de paiement d'une réservation.
     * Processus :
     * 1. Reçoit l'ID de la réservation.
     * 2. Si POST (simule validation carte), génère un ID de transaction fictif.
     * 3. Enregistre le paiement en base de données.
     * 4. Change le statut de la réservation en 'payee'.
     * 5. Génère physiquement le ticket avec un code unique.
     * 6. Redirige vers l'espace client.
     */
    public function paiement()
    {
        $id_res = $_GET['id_res'] ?? null;
        if (!$id_res)
            header("Location: index.php?action=accueil");

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Simulation de succès du paiement
            $transaction_id = "TRANS_" . uniqid();
            $reservation = $this->modeleReservation->chargerParId($id_res);

            if ($this->modelePaiement->enregistrer($id_res, $reservation['total'], 'carte', $transaction_id)) {
                $this->modeleReservation->modifierStatut($id_res, 'payee');

                // Générer le ticket
                $code_unique = strtoupper(uniqid("TICK-"));
                $this->modeleTicket->generer($id_res, 1, $code_unique); // Simplifié à type 1 pour la démo

                header("Location: index.php?action=mes_reservations&success=paye");
                exit();
            }
        }
        require 'views/reservation/paiement.php';
    }

    /**
     * Affiche l'historique des réservations effectuées par le client.
     */
    public function mesReservations()
    {
        if (!isset($_SESSION['utilisateur_id'])) {
            header("Location: index.php?action=connexion");
            exit();
        }
        $reservations = $this->modeleReservation->listerParClient($_SESSION['utilisateur_id']);
        require 'views/client/mes_reservations.php';
    }
}
?>
