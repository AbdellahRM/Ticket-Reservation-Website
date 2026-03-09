<?php

class EvenementImage
{
    private $connexion;

    /**
     * Constructeur de la classe EvenementImage.
     * @param mysqli $db Instance de connexion à la base de données.
     */
    public function __construct($db)
    {
        $this->connexion = $db;
    }

    /**
     * Associe une nouvelle image à un événement spécifique.
     * 
     * @param int $id_evenement Identifiant de l'événement.
     * @param string $chemin_image Chemin d'accès relatif ou absolu vers l'image.
     * @return bool True si l'image a été ajoutée avec succès.
     */
    public function ajouter($id_evenement, $chemin_image)
    {
        $sql = "INSERT INTO evenement_images (id_evenement, chemin_image) VALUES (?, ?)";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("is", $id_evenement, $chemin_image);
        return $requete->execute();
    }

    /**
     * Récupère la liste de toutes les images associées à un événement.
     * 
     * @param int $id_evenement Identifiant de l'événement.
     * @return array Liste des chemins d'images classés par date d'ajout.
     */
    public function listerParEvenement($id_evenement)
    {
        $sql = "SELECT * FROM evenement_images WHERE id_evenement = ? ORDER BY date_ajout ASC";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("i", $id_evenement);
        $requete->execute();
        return $requete->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}
?>
