<?php

class Paiement
{
    private $connexion;

    /**
     * Constructeur de la classe Paiement.
     * @param mysqli $db Instance de connexion à la base de données.
     */
    public function __construct($db)
    {
        $this->connexion = $db;
    }

    /**
     * Enregistre une transaction de paiement liée à une réservation.
     * 
     * @param int $id_reservation Identifiant de la réservation concernée.
     * @param float $montant Montant de la transaction.
     * @param string $methode Moyen de paiement utilisé (ex: Stripe, PayPal).
     * @param string $transaction_id Identifiant unique de la transaction externe.
     * @return bool True si l'enregistrement réussit.
     */
    public function enregistrer($id_reservation, $montant, $methode, $transaction_id)
    {
        $sql = "INSERT INTO paiements (id_reservation, montant, methode, transaction_id) VALUES (?, ?, ?, ?)";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("idss", $id_reservation, $montant, $methode, $transaction_id);
        return $requete->execute();
    }

    /**
     * Récupère les informations de paiement associées à une réservation spécifique.
     * 
     * @param int $id_reservation Identifiant de la réservation.
     * @return array|null Données du paiement.
     */
    public function chargerParReservation($id_reservation)
    {
        $sql = "SELECT * FROM paiements WHERE id_reservation = ?";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("i", $id_reservation);
        $requete->execute();
        return $requete->get_result()->fetch_assoc();
    }
}
?>
