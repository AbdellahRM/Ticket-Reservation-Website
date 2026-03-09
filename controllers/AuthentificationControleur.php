<?php
require_once 'models/Utilisateur.php';

class AuthentificationControleur
{
    private $modele;

    /**
     * Constructeur de AuthentificationControleur.
     * @param mysqli $db Connexion à la base de données.
     */
    public function __construct($db)
    {
        $this->modele = new Utilisateur($db);
    }

    /**
     * Gère l'inscription des utilisateurs via le formulaire classique.
     * Processus :
     * 1. Si la requête est en POST, récupère et nettoie les données du formulaire.
     * 2. Appelle le modèle pour enregistrer l'utilisateur.
     * 3. En cas de succès, redirige vers la page de connexion avec un message.
     * 4. En cas d'erreur ou si la méthode est GET, affiche le formulaire d'inscription.
     */
    public function inscription()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $nom = htmlspecialchars($_POST['nom']);
            $prenom = htmlspecialchars($_POST['prenom']);
            $email = htmlspecialchars($_POST['email']);
            $mdp = $_POST['mot_de_passe'];
            $role = $_POST['role'];

            if ($this->modele->inscrire($nom, $prenom, $email, $mdp, $role)) {
                header("Location: index.php?action=connexion&success=inscription");
                exit();
            }
            else {
                $erreur = "Erreur lors de l'inscription. L'email est peut-être déjà utilisé.";
                require 'views/auth/inscription.php';
            }
        }
        else {
            require 'views/auth/inscription.php';
        }
    }

    /**
     * Gère la connexion des utilisateurs hétérogènes (clique sur 'Se connecter').
     * Processus :
     * 1. Récupère les identifiants si fournis en POST.
     * 2. Vérifie les identifiants via le modèle Utilisateur.
     * 3. Si valides, initialise la session avec les informations de l'utilisateur (ID, nom, rôle, etc.).
     * 4. Redirige vers la page d'accueil ou affiche une erreur si les identifiants sont faux.
     */
    public function connexion()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $email = htmlspecialchars($_POST['email']);
            $mdp = $_POST['mot_de_passe'];

            $utilisateur = $this->modele->connecter($email, $mdp);
            if ($utilisateur) {
                $_SESSION['utilisateur_id'] = $utilisateur['id'];
                $_SESSION['nom'] = $utilisateur['nom'];
                $_SESSION['prenom'] = $utilisateur['prenom'];
                $_SESSION['role'] = $utilisateur['role'];
                $_SESSION['photo_profil'] = $utilisateur['photo_profil'] ?? 'default_profile.png';

                header("Location: index.php?action=accueil");
                exit();
            }
            else {
                $erreur = "Email ou mot de passe incorrect.";
                require 'views/auth/connexion.php';
            }
        }
        else {
            require 'views/auth/connexion.php';
        }
    }

    /**
     * Termine la session de l'utilisateur actuel et le redirige.
     */
    public function deconnexion()
    {
        session_destroy();
        header("Location: index.php?action=accueil");
        exit();
    }

    /**
     * Point de terminaison API pour la déconnexion.
     * Détruit la session et retourne une confirmation JSON.
     */
    public function deconnexion_api()
    {
        session_destroy();
        echo json_encode(['success' => true]);
    }

    /**
     * Point de terminaison API servant à vérifier si une session est active.
     * Utile pour maintenir l'état de l'interface frontend (React/Vue).
     * Retourne les détails de l'utilisateur connecté si présent.
     */
    public function check_auth_api()
    {
        if (isset($_SESSION['utilisateur_id'])) {
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $_SESSION['utilisateur_id'],
                    'nom' => $_SESSION['nom'],
                    'prenom' => $_SESSION['prenom'],
                    'email' => $_SESSION['email'] ?? '',
                    'role' => $_SESSION['role'],
                    'photo_profil' => $_SESSION['photo_profil'] ?? 'default_profile.png'
                ]
            ]);
        }
        else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Non autorisé']);
        }
    }

    /**
     * Point de terminaison API pour la connexion (JSON).
     * Reçoit un objet JSON contenant email/mot_de_passe.
     * Retourne les données utilisateur ou une erreur 401.
     */
    public function connexion_api()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $email = htmlspecialchars($data['email'] ?? '');
            $mdp = $data['mot_de_passe'] ?? '';

            $utilisateur = $this->modele->connecter($email, $mdp);
            if ($utilisateur) {
                $_SESSION['utilisateur_id'] = $utilisateur['id'];
                $_SESSION['nom'] = $utilisateur['nom'];
                $_SESSION['prenom'] = $utilisateur['prenom'];
                $_SESSION['email'] = $utilisateur['email'];
                $_SESSION['role'] = $utilisateur['role'];
                $_SESSION['photo_profil'] = $utilisateur['photo_profil'] ?? 'default_profile.png';

                echo json_encode([
                    'success' => true,
                    'user' => [
                        'id' => $utilisateur['id'],
                        'nom' => $utilisateur['nom'],
                        'prenom' => $utilisateur['prenom'],
                        'email' => $utilisateur['email'],
                        'role' => $utilisateur['role'],
                        'photo_profil' => $utilisateur['photo_profil'] ?? 'default_profile.png'
                    ]
                ]);
            }
            else {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Email ou mot de passe incorrect.']);
            }
        }
    }

    /**
     * Point de terminaison API pour l'inscription (JSON).
     */
    public function inscription_api()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $nom = htmlspecialchars($data['nom'] ?? '');
            $prenom = htmlspecialchars($data['prenom'] ?? '');
            $email = htmlspecialchars($data['email'] ?? '');
            $mdp = $data['mot_de_passe'] ?? '';
            $role = $data['role'] ?? 'client';

            if ($this->modele->inscrire($nom, $prenom, $email, $mdp, $role)) {
                echo json_encode(['success' => true]);
            }
            else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'inscription. L\'email est peut-être déjà utilisé.']);
            }
        }
    }

    /**
     * Affiche et gère la mise à jour du profil de l'utilisateur connecté.
     * Processus :
     * 1. Vérifie si l'utilisateur est authentifié.
     * 2. Si POST, traite le téléchargement de la nouvelle photo de profil (si présente).
     * 3. Met à jour les informations (nom, email, mdp optionnel) via le modèle.
     * 4. Met à jour les variables de session pour refléter les changements instantanément.
     * 5. Affiche la vue du profil avec les données rafraîchies.
     */
    public function profil()
    {
        if (!isset($_SESSION['utilisateur_id'])) {
            header("Location: index.php?action=connexion");
            exit();
        }

        $id = $_SESSION['utilisateur_id'];
        $utilisateur = $this->modele->chargerParId($id);

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $nom = htmlspecialchars($_POST['nom']);
            $prenom = htmlspecialchars($_POST['prenom']);
            $email = htmlspecialchars($_POST['email']);
            $nouveauMdp = !empty($_POST['mot_de_passe']) ? $_POST['mot_de_passe'] : null;

            $photo = $utilisateur['photo_profil'] ?? 'default_profile.png';

            if (isset($_FILES['photo_profil']) && $_FILES['photo_profil']['error'] === 0) {
                $nomPhoto = time() . "_" . $_FILES['photo_profil']['name'];
                if (move_uploaded_file($_FILES['photo_profil']['tmp_name'], "public/images/profiles/" . $nomPhoto)) {
                    $photo = $nomPhoto;
                }
            }

            if ($this->modele->modifierProfil($id, $nom, $prenom, $email, $photo, $nouveauMdp)) {
                // Mettre à jour la session
                $_SESSION['nom'] = $nom;
                $_SESSION['prenom'] = $prenom;
                $_SESSION['photo_profil'] = $photo;
                $succes = "Profil mis à jour avec succès.";
                // Recharger les données pour la vue
                $utilisateur = $this->modele->chargerParId($id);
            }
            else {
                $erreur = "Erreur lors de la mise à jour du profil.";
            }
        }

        require 'views/utilisateur/profil.php';
    }
}
?>
