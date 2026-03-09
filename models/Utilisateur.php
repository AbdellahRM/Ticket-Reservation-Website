<?php

class Utilisateur
{
    private $connexion;

    /**
     * Constructeur de la classe Utilisateur.
     * Initialise la connexion à la base de données.
     * 
     * @param mysqli $db Instance de connexion à la base de données.
     */
    public function __construct($db)
    {
        $this->connexion = $db;
    }

    /**
     * Inscription d'un nouvel utilisateur.
     * Processus :
     * 1. Reçoit les informations de l'utilisateur.
     * 2. Hash le mot de passe pour la sécurité.
     * 3. Insère les données dans la table 'utilisateurs'.
     * 
     * @return bool True si l'insertion réussit, sinon False.
     */
    public function inscrire($nom, $prenom, $email, $mot_de_passe, $role)
    {
        $sql = "INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)";
        $requete = $this->connexion->prepare($sql);

        $hash = password_hash($mot_de_passe, PASSWORD_BCRYPT);
        $requete->bind_param("sssss", $nom, $prenom, $email, $hash, $role);

        return $requete->execute();
    }

    /**
     * Connexion d'un utilisateur.
     * Processus :
     * 1. Recherche l'utilisateur par son email.
     * 2. Si trouvé, vérifie si le mot de passe correspond au hash stocké.
     * 3. Retourne les données de l'utilisateur si la vérification réussit.
     * 
     * @return array|false Données de l'utilisateur ou False en cas d'échec.
     */
    public function connecter($email, $mot_de_passe)
    {
        $sql = "SELECT * FROM utilisateurs WHERE email = ?";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("s", $email);
        $requete->execute();

        $resultat = $requete->get_result();
        if ($utilisateur = $resultat->fetch_assoc()) {
            if (password_verify($mot_de_passe, $utilisateur['mot_de_passe'])) {
                return $utilisateur;
            }
        }
        return false;
    }

    /**
     * Récupérer un utilisateur par son identifiant unique.
     * 
     * @param int $id Identifiant de l'utilisateur.
     * @return array|null Données de l'utilisateur.
     */
    public function chargerParId($id)
    {
        $sql = "SELECT * FROM utilisateurs WHERE id = ?";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("i", $id);
        $requete->execute();
        return $requete->get_result()->fetch_assoc();
    }

    /**
     * Liste tous les utilisateurs enregistrés.
     * Utilisé principalement par l'administrateur pour la gestion des comptes.
     * 
     * @return array Liste des utilisateurs sous forme de tableau associatif.
     */
    public function listerTous()
    {
        $sql = "SELECT id, nom, prenom, email, role, date_creation FROM utilisateurs";
        return $this->connexion->query($sql)->fetch_all(MYSQLI_ASSOC);
    }

    /**
     * Supprime un utilisateur de la base de données.
     * 
     * @param int $id Identifiant de l'utilisateur à supprimer.
     * @return bool True si la suppression est effectuée.
     */
    public function supprimer($id)
    {
        $sql = "DELETE FROM utilisateurs WHERE id = ?";
        $requete = $this->connexion->prepare($sql);
        $requete->bind_param("i", $id);
        return $requete->execute();
    }

    /**
     * Modifie les informations du profil d'un utilisateur.
     * Processus :
     * 1. Vérifie si un nouveau mot de passe est fourni.
     * 2. Si oui, met à jour les informations incluant le nouveau mot de passe hashé.
     * 3. Si non, met à jour uniquement les informations de base (nom, email, photo).
     * 
     * @return bool Résultat de l'exécution de la requête.
     */
    public function modifierProfil($id, $nom, $prenom, $email, $photo, $nouveauMdp = null)
    {
        if ($nouveauMdp) {
            $sql = "UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, photo_profil = ?, mot_de_passe = ? WHERE id = ?";
            $requete = $this->connexion->prepare($sql);
            $hash = password_hash($nouveauMdp, PASSWORD_BCRYPT);
            $requete->bind_param("sssssi", $nom, $prenom, $email, $photo, $hash, $id);
        }
        else {
            $sql = "UPDATE utilisateurs SET nom = ?, prenom = ?, email = ?, photo_profil = ? WHERE id = ?";
            $requete = $this->connexion->prepare($sql);
            $requete->bind_param("ssssi", $nom, $prenom, $email, $photo, $id);
        }
        return $requete->execute();
    }
}
?>
