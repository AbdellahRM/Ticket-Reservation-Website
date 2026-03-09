<?php

class TypeTicket
{
    private $connexion;

    /**
     * Constructeur de la classe TypeTicket.
     * @param mysqli $db Instance de connexion à la base de données.
     */
    public function __construct($db)
    {
        $this->connexion = $db;
    }

    /**
     * Définit un nouveau type de ticket (ex: VIP, Regular) pour un événement.
     * Précise le prix unitaire et le stock initial.
     * 
     * @param int $id_evenement Identifiant de l'événement associé.
     * @param string $nom Nom de la catégorie (ex: 'VIP').
     * @param float $prix Prix unitaire du ticket.
     * @param int $quantite Nombre de places disponibles initialement.
     * @return bool Succès de l'insertion.
     */
    public function creer($id_evenement, $nom, $prix, $quantite)
    {
        $sql = "INSERT INTO types_tickets (id_evenement, nom, prix, quantite_disponible) VALUES (?, ?, ?, ?)";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("isdi", $id_evenement, $nom, $prix, $quantite);
        return $requete->execute();
    }

    /**
     * Liste toutes les catégories de tickets disponibles pour un événement.
     * 
     * @param int $id_evenement Identifiant de l'événement.
     * @return array Liste des types de tickets.
     */
    public function listerParEvenement($id_evenement)
    {
        $sql = "SELECT * FROM types_tickets WHERE id_evenement = ?";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("i", $id_evenement);
        $requete->execute();
        return $requete->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    /**
     * Diminue la quantité de tickets disponibles lors d'une réservation.
     * Utilise une condition SQL pour s'assurer que le stock ne tombe pas sous zéro.
     * 
     * @param int $id Identifiant du type de ticket.
     * @param int $quantite Nombre de tickets à déduire.
     * @return bool True si la mise à jour a pu avoir lieu (stock suffisant).
     */
    public function mettreAJourQuantite($id, $quantite)
    {
        $sql = "UPDATE types_tickets SET quantite_disponible = quantite_disponible - ? WHERE id = ? AND quantite_disponible >= ?";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("iii", $quantite, $id, $quantite);
        return $requete->execute();
    }

    /**
     * Supprime toutes les catégories de tickets rattachées à un événement.
     * 
     * @param int $id_evenement Identifiant de l'événement.
     * @return bool Succès de la suppression.
     */
    public function supprimerParEvenement($id_evenement)
    {
        $sql = "DELETE FROM types_tickets WHERE id_evenement = ?";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("i", $id_evenement);
        return $requete->execute();
    }
    /**
     * Récupère les données d'un type de ticket spécifique par son identifiant.
     * 
     * @param int $id Identifiant du type de ticket.
     * @return array|null Informations sur le type de ticket.
     */
    public function chargerParId($id)
    {
        $sql = "SELECT * FROM types_tickets WHERE id = ?";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("i", $id);
        $requete->execute();
        return $requete->get_result()->fetch_assoc();
    }
}
?>
