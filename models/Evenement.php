<?php

class Evenement
{
    private $connexion;

    /**
     * Constructeur de la classe Evenement.
     * @param mysqli $db Instance de connexion à la base de données.
     */
    public function __construct($db)
    {
        $this->connexion = $db;
    }

    /**
     * Création d'un nouvel événement.
     * Processus :
     * 1. Insère les détails de l'événement fournis par l'organisateur.
     * 2. Retourne l'identifiant généré pour le nouvel événement.
     * 
     * @return int|false ID de l'événement créé ou False en cas d'erreur.
     */
    public function creer($id_organisateur, $titre, $description, $date_evenement, $date_fin, $lieu, $categorie, $prix_base, $capacite, $image)
    {
        $sql = "INSERT INTO evenements (id_organisateur, titre, description, date_evenement, date_fin, lieu, categorie, prix_base, capacite, image, statut) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'publie')";

        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("issssssdis", $id_organisateur, $titre, $description, $date_evenement, $date_fin, $lieu, $categorie, $prix_base, $capacite, $image);

        if ($requete->execute()) {
            return $this->connexion->insert_id;
        }
        return false;
    }

    /**
     * Mise à jour des informations d'un événement existant.
     * 
     * @param int $id Identifiant de l'événement à modifier.
     * @return bool True si la mise à jour est réussie.
     */
    public function modifier($id, $titre, $description, $date_evenement, $date_fin, $lieu, $categorie, $prix_base, $capacite, $image)
    {
        $sql = "UPDATE evenements SET titre = ?, description = ?, date_evenement = ?, date_fin = ?, lieu = ?, categorie = ?, prix_base = ?, capacite = ?, image = ? 
                WHERE id = ?";

        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("ssssssdisi", $titre, $description, $date_evenement, $date_fin, $lieu, $categorie, $prix_base, $capacite, $image, $id);

        return $requete->execute();
    }

    /**
     * Suppression définitive d'un événement par son identifiant.
     * 
     * @param int $id Identifiant de l'événement.
     * @return bool Résultat de l'opération.
     */
    public function supprimer($id)
    {
        $sql = "DELETE FROM evenements WHERE id = ?";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("i", $id);
        return $requete->execute();
    }

    /**
     * Change le statut d'un événement en 'publie', le rendant visible au public.
     * 
     * @param int $id Identifiant de l'événement.
     * @return bool Résultat de l'opération.
     */
    public function publier($id)
    {
        $sql = "UPDATE evenements SET statut = 'publie' WHERE id = ?";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("i", $id);
        return $requete->execute();
    }

    /**
     * Récupère la liste de tous les événements ayant le statut 'publie'.
     * Inclut le nom de l'organisateur pour l'affichage.
     * 
     * @return array Liste des événements publics.
     */
    public function listerPublics()
    {
        $sql = "SELECT e.*, u.nom as organisateur_nom FROM evenements e 
                JOIN utilisateurs u ON e.id_organisateur = u.id 
                ORDER BY e.date_evenement ASC";
        return $this->connexion->query($sql)->fetch_all(MYSQLI_ASSOC);
    }

    /**
     * Liste tous les événements créés par un organisateur spécifique.
     * 
     * @param int $id_organisateur Identifiant de l'organisateur.
     * @return array Liste des événements de l'organisateur.
     */
    public function listerParOrganisateur($id_organisateur)
    {
        $sql = "SELECT * FROM evenements WHERE id_organisateur = ? ORDER BY date_creation DESC";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("i", $id_organisateur);
        $requete->execute();
        return $requete->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    /**
     * Récupère les détails complets d'un événement par son identifiant.
     * Joint la table utilisateurs pour obtenir les informations de l'organisateur.
     * 
     * @param int $id Identifiant de l'événement.
     * @return array|null Données de l'événement.
     */
    public function chargerParId($id)
    {
        $sql = "SELECT e.*, u.nom as organisateur_nom, u.prenom as organisateur_prenom 
                FROM evenements e 
                JOIN utilisateurs u ON e.id_organisateur = u.id 
                WHERE e.id = ?";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("i", $id);
        $requete->execute();
        return $requete->get_result()->fetch_assoc();
    }
    /**
     * Liste tous les événements du système pour le tableau de bord administrateur.
     * 
     * @return array Liste complète des événements.
     */
    public function listerTousAdmin()
    {
        $sql = "SELECT e.*, u.nom as organisateur_nom, u.prenom as organisateur_prenom 
                FROM evenements e 
                JOIN utilisateurs u ON e.id_organisateur = u.id 
                ORDER BY e.date_creation DESC";
        return $this->connexion->query($sql)->fetch_all(MYSQLI_ASSOC);
    }

    /**
     * Récupère des statistiques détaillées pour chaque événement d'un organisateur.
     * Calcule le nombre de réservations payées et le nombre de places restantes via des sous-requêtes.
     * 
     * @param int $id_organisateur Identifiant de l'organisateur.
     * @return array Statistiques de performance des événements.
     */
    public function getStatsPourOrganisateur($id_organisateur)
    {
        $sql = "SELECT e.id, e.titre, e.capacite, e.lieu, e.date_evenement, e.image,
                (SELECT COUNT(*) FROM reservations r WHERE r.id_evenement = e.id AND r.statut = 'payee') as nb_reservations,
                (SELECT IFNULL(SUM(tt.quantite_disponible), 0) FROM types_tickets tt WHERE tt.id_evenement = e.id) as places_restantes
                FROM evenements e
                WHERE e.id_organisateur = ?
                ORDER BY e.date_evenement ASC";

        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("i", $id_organisateur);
        $requete->execute();
        return $requete->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}
?>
