<?php

class Ticket
{
    private $connexion;

    /**
     * Constructeur de la classe Ticket.
     * @param mysqli $db Instance de connexion à la base de données.
     */
    public function __construct($db)
    {
        $this->connexion = $db;
    }

    /**
     * Crée un ticket physique (en base) associé à une réservation et un type de ticket.
     * Attribue un code unique pour la validation.
     * 
     * @param int $id_reservation Identifiant de la réservation.
     * @param int $id_type_ticket Identifiant du type de ticket (VIP, Standard, etc.).
     * @param string $code_unique Chaîne unique servant de référence ou QR Code.
     * @return bool True si la création réussit.
     */
    public function generer($id_reservation, $id_type_ticket, $code_unique)
    {
        $sql = "INSERT INTO tickets (id_reservation, id_type_ticket, code_unique) VALUES (?, ?, ?)";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("iis", $id_reservation, $id_type_ticket, $code_unique);
        return $requete->execute();
    }

    /**
     * Liste tous les tickets générés pour une réservation donnée.
     * 
     * @param int $id_reservation Identifiant de la réservation.
     * @return array Liste des tickets avec détails du type.
     */
    public function listerParReservation($id_reservation)
    {
        $sql = "SELECT t.*, tt.nom as type_nom, tt.prix 
                FROM tickets t 
                JOIN types_tickets tt ON t.id_type_ticket = tt.id 
                WHERE t.id_reservation = ?";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("i", $id_reservation);
        $requete->execute();
        return $requete->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    /**
     * Simule le scan d'un ticket en changeant son statut de 'valide' à 'utilise'.
     * Vérifie que le ticket n'a pas déjà été scanné auparavant.
     * 
     * @param string $code_unique Le code unique du ticket à valider.
     * @return bool True si un ticket a effectivement été marqué comme utilisé.
     */
    public function valider($code_unique)
    {
        $sql = "UPDATE tickets SET statut = 'utilise' WHERE code_unique = ? AND statut = 'valide'";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("s", $code_unique);
        $requete->execute();
        return $requete->affected_rows > 0;
    }

    /**
     * Récupère les détails exhaustifs d'un ticket individuel grâce à son code unique.
     * Utile pour la validation à l'entrée d'un événement.
     * 
     * @param string $code_unique Code de référence du ticket.
     * @return array|null Informations complètes (événement, client, type).
     */
    public function chargerParCode($code_unique)
    {
        $sql = "SELECT t.*, tt.nom as type_nom, e.titre as evenement_titre, e.date_evenement, u.nom as client_nom, u.prenom as client_prenom 
                FROM tickets t 
                JOIN types_tickets tt ON t.id_type_ticket = tt.id 
                JOIN reservations r ON t.id_reservation = r.id 
                JOIN evenements e ON r.id_evenement = e.id 
                JOIN utilisateurs u ON r.id_client = u.id 
                WHERE t.code_unique = ?";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("s", $code_unique);
        $requete->execute();
        return $requete->get_result()->fetch_assoc();
    }
}
?>
