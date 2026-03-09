<?php

class Reservation
{
    private $connexion;

    /**
     * Constructeur de la classe Reservation.
     * @param mysqli $db Instance de connexion à la base de données.
     */
    public function __construct($db)
    {
        $this->connexion = $db;
    }

    /**
     * Crée une nouvelle réservation pour un client pour un événement donné.
     * Initialise le statut par défaut (souvent 'en attente').
     * 
     * @param int $id_client Identifiant du client.
     * @param int $id_evenement Identifiant de l'événement.
     * @param float $total Montant total de la réservation.
     * @return int|false ID de la réservation créée ou False en cas d'erreur.
     */
    public function creer($id_client, $id_evenement, $total)
    {
        $sql = "INSERT INTO reservations (id_client, id_evenement, total) VALUES (?, ?, ?)";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("iid", $id_client, $id_evenement, $total);
        if ($requete->execute()) {
            return $this->connexion->insert_id;
        }
        return false;
    }

    /**
     * Met à jour le statut d'une réservation (ex: 'payee', 'annulee').
     * 
     * @param int $id Identifiant de la réservation.
     * @param string $statut Nouveau statut à appliquer.
     * @return bool Succès de l'opération.
     */
    public function modifierStatut($id, $statut)
    {
        $sql = "UPDATE reservations SET statut = ? WHERE id = ?";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("si", $statut, $id);
        return $requete->execute();
    }

    /**
     * Liste l'historique des réservations d'un client spécifique.
     * Joint les informations de l'événement pour plus de détails.
     * 
     * @param int $id_client Identifiant du client.
     * @return array Liste des réservations du client.
     */
    public function listerParClient($id_client)
    {
        $sql = "SELECT r.*, e.titre as evenement_titre, e.date_evenement 
                FROM reservations r 
                JOIN evenements e ON r.id_evenement = e.id 
                WHERE r.id_client = ? ORDER BY r.date_reservation DESC";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("i", $id_client);
        $requete->execute();
        return $requete->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    /**
     * Charge les détails complets d'une réservation, incluant les infos client et événement.
     * 
     * @param int $id Identifiant unique de la réservation.
     * @return array|null Données descriptives de la réservation.
     */
    public function chargerParId($id)
    {
        $sql = "SELECT r.*, e.titre as evenement_titre, e.date_evenement, e.lieu, u.nom as client_nom, u.prenom as client_prenom 
                FROM reservations r 
                JOIN evenements e ON r.id_evenement = e.id 
                JOIN utilisateurs u ON r.id_client = u.id 
                WHERE r.id = ?";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("i", $id);
        $requete->execute();
        return $requete->get_result()->fetch_assoc();
    }

    /**
     * Calcule globalement le nombre total de réservations payées et le revenu total généré.
     * Utilisé par l'administrateur pour le suivi financier.
     * 
     * @return array Statistiques globales (total_reservations, revenu_total).
     */
    public function statsGlobales()
    {
        $sql = "SELECT COUNT(*) as total_reservations, SUM(total) as revenu_total 
                FROM reservations WHERE statut = 'payee'";
        return $this->connexion->query($sql)->fetch_assoc();
    }
}
?>
