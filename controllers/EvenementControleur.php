<?php
require_once 'models/Evenement.php';
require_once 'models/TypeTicket.php';
require_once 'models/EvenementImage.php';

class EvenementControleur
{
    private $modeleEvenement;
    private $modeleTypeTicket;
    private $modeleEvenementImage;
    private $connexion;

    /**
     * Constructeur de EvenementControleur.
     * Initialise les modèles pour les événements, les tickets et les images.
     * 
     * @param mysqli $db Connexion à la base de données.
     */
    public function __construct($db)
    {
        $this->connexion = $db;
        $this->modeleEvenement = new Evenement($db);
        $this->modeleTypeTicket = new TypeTicket($db);
        $this->modeleEvenementImage = new EvenementImage($db);
    }

    /**
     * Affiche la page d'accueil avec la liste des événements publics.
     */
    public function accueil()
    {
        $evenements = $this->modeleEvenement->listerPublics();
        require 'views/accueil.php';
    }

    /**
     * Point de terminaison API retournant la liste des événements publics au format JSON.
     */
    public function liste_api()
    {
        $evenements = $this->modeleEvenement->listerPublics();
        echo json_encode(['success' => true, 'data' => $evenements]);
    }

    /**
     * Affiche les détails d'un événement spécifique.
     * Processus :
     * 1. Récupère l'ID via l'URL.
     * 2. Charge les données de l'événement, les types de tickets et les images associées.
     * 3. Affiche la vue des détails.
     */
    public function details()
    {
        $id = $_GET['id'] ?? null;
        if ($id) {
            $evenement = $this->modeleEvenement->chargerParId($id);
            $typesTickets = $this->modeleTypeTicket->listerParEvenement($id);
            $evenementImages = $this->modeleEvenementImage->listerParEvenement($id);
            require 'views/evenement/details.php';
        }
        else {
            header("Location: index.php?action=accueil");
        }
    }

    /**
     * Point de terminaison API retournant les détails complets d'un événement.
     */
    public function details_api()
    {
        $id = $_GET['id'] ?? null;
        if ($id) {
            $evenement = $this->modeleEvenement->chargerParId($id);
            $typesTickets = $this->modeleTypeTicket->listerParEvenement($id);
            $evenementImages = $this->modeleEvenementImage->listerParEvenement($id);
            echo json_encode([
                'success' => true,
                'data' => [
                    'evenement' => $evenement,
                    'typesTickets' => $typesTickets,
                    'images' => $evenementImages
                ]
            ]);
        }
        else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Événement non trouvé']);
        }
    }

    /**
     * Affiche la liste des événements créés par l'organisateur connecté.
     */
    public function mesEvenements()
    {
        if (!isset($_SESSION['utilisateur_id']) || $_SESSION['role'] !== 'organisateur') {
            header("Location: index.php?action=connexion");
            exit();
        }
        $evenements = $this->modeleEvenement->listerParOrganisateur($_SESSION['utilisateur_id']);
        require 'views/organisateur/liste_evenements.php';
    }

    /**
     * Gère la création d'un nouvel événement par un organisateur.
     * Processus complexe :
     * 1. Valide l'identité et le rôle de l'organisateur.
     * 2. Si POST, crée d'abord l'entrée de base dans la table 'evenements'.
     * 3. Traite les téléchargements d'images multiples (upload physique et insertion en base).
     * 4. Définit l'image principale de l'événement si nécessaire.
     * 5. Crée les différents types de tickets (VIP, Standard...) asssociés à cet événement.
     * 6. Redirige vers la liste des événements de l'organisateur.
     */
    public function creer()
    {
        if (!isset($_SESSION['utilisateur_id']) || $_SESSION['role'] !== 'organisateur') {
            header("Location: index.php?action=connexion");
            exit();
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $titre = htmlspecialchars($_POST['titre']);
            $desc = htmlspecialchars($_POST['description']);
            $date_ev = $_POST['date_evenement'];
            $date_fin = $_POST['date_fin'];
            $lieu = htmlspecialchars($_POST['lieu']);
            $cat = htmlspecialchars($_POST['categorie']);
            $prix = $_POST['prix_base'];
            $cap = $_POST['capacite'];

            // Gestion image principale (facultative - par defaut)
            $imagePrincipale = "default.jpg";

            $idEvenementCree = $this->modeleEvenement->creer($_SESSION['utilisateur_id'], $titre, $desc, $date_ev, $date_fin, $lieu, $cat, $prix, $cap, $imagePrincipale);

            if ($idEvenementCree) {
                // Gestion images multiples
                if (isset($_FILES['images']) && !empty($_FILES['images']['name'][0])) {
                    foreach ($_FILES['images']['name'] as $key => $name) {
                        if ($_FILES['images']['error'][$key] === 0) {
                            $nomImage = time() . "_" . $key . "_" . $name;
                            if (move_uploaded_file($_FILES['images']['tmp_name'][$key], "public/images/" . $nomImage)) {
                                $this->modeleEvenementImage->ajouter($idEvenementCree, $nomImage);
                                // Définir la première image comme principale si elle est toujours 'default.jpg'
                                if ($imagePrincipale === "default.jpg") {
                                    $imagePrincipale = $nomImage;
                                    $this->modeleEvenement->modifier($idEvenementCree, $titre, $desc, $date_ev, $date_fin, $lieu, $cat, $prix, $cap, $nomImage);
                                }
                            }
                        }
                    }
                }
                elseif (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
                    // Fallback pour upload simple si présent
                    $nomImage = time() . "_" . $_FILES['image']['name'];
                    if (move_uploaded_file($_FILES['image']['tmp_name'], "public/images/" . $nomImage)) {
                        $this->modeleEvenementImage->ajouter($idEvenementCree, $nomImage);
                        $this->modeleEvenement->modifier($idEvenementCree, $titre, $desc, $date_ev, $date_fin, $lieu, $cat, $prix, $cap, $nomImage);
                    }
                }

                // Gestion tickets dynamiques
                if (isset($_POST['tickets']) && is_array($_POST['tickets'])) {
                    foreach ($_POST['tickets'] as $ticket) {
                        $nomTicket = htmlspecialchars($ticket['nom']);
                        $prixTicket = floatval($ticket['prix'] ?? 0);
                        $quantiteTicket = intval($ticket['quantite'] ?? 0);
                        if (!empty($nomTicket) && $prixTicket >= 0 && $quantiteTicket > 0) {
                            $this->modeleTypeTicket->creer($idEvenementCree, $nomTicket, $prixTicket, $quantiteTicket);
                        }
                    }
                }

                header("Location: index.php?action=mes_evenements");
                exit();
            }
        }
        require 'views/organisateur/creer_evenement.php';
    }
    /**
     * Gère la modification d'un événement existant.
     * Processus :
     * 1. Vérifie l'appartenance de l'événement à l'organisateur pour la sécurité.
     * 2. Si POST, met à jour les détails principaux.
     * 3. Gère le remplacement ou l'ajout d'une nouvelle image principale.
     * 4. Actualise les catégories de tickets (en supprimant et recréant pour éviter les conflits).
     * 5. Redirige vers la liste des événements.
     */
    public function modifier()
    {
        if (!isset($_SESSION['utilisateur_id']) || $_SESSION['role'] !== 'organisateur') {
            header("Location: index.php?action=connexion");
            exit();
        }

        $id = $_GET['id'] ?? null;
        if (!$id) {
            header("Location: index.php?action=mes_evenements");
            exit();
        }

        $evenement = $this->modeleEvenement->chargerParId($id);

        // Sécurité: vérifier si l'événement appartient à l'organisateur connecté
        if ($evenement['id_organisateur'] != $_SESSION['utilisateur_id']) {
            header("Location: index.php?action=mes_evenements");
            exit();
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $titre = htmlspecialchars($_POST['titre']);
            $desc = htmlspecialchars($_POST['description']);
            $date_ev = $_POST['date_evenement'];
            $date_fin = $_POST['date_fin'];
            $lieu = htmlspecialchars($_POST['lieu']);
            $cat = htmlspecialchars($_POST['categorie']);
            $prix = $_POST['prix_base'];
            $cap = $_POST['capacite'];

            // L'image principale reste la même par défaut
            $imagePrincipale = $evenement['image'];

            // On update l'événement avec les nouvelles infos et l'image actuelle (qui peut être modifiée après)
            if ($this->modeleEvenement->modifier($id, $titre, $desc, $date_ev, $date_fin, $lieu, $cat, $prix, $cap, $imagePrincipale)) {

                // Mettre à jour l'image principale ou ajouter des images supplémentaires
                if (isset($_FILES['images']) && !empty($_FILES['images']['name'][0])) {
                    foreach ($_FILES['images']['name'] as $key => $name) {
                        if ($_FILES['images']['error'][$key] === 0) {
                            $nomImage = time() . "_" . $key . "_" . $name;
                            if (move_uploaded_file($_FILES['images']['tmp_name'][$key], "public/images/" . $nomImage)) {
                                $this->modeleEvenementImage->ajouter($id, $nomImage);
                                // Si l'ancienne image était 'default.jpg', on met à jour l'image principale
                                if ($imagePrincipale === "default.jpg") {
                                    $imagePrincipale = $nomImage;
                                    $this->modeleEvenement->modifier($id, $titre, $desc, $date_ev, $date_fin, $lieu, $cat, $prix, $cap, $nomImage);
                                }
                            }
                        }
                    }
                }
                elseif (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
                    // Fallback pour upload simple
                    $nomImage = time() . "_" . $_FILES['image']['name'];
                    if (move_uploaded_file($_FILES['image']['tmp_name'], "public/images/" . $nomImage)) {
                        $this->modeleEvenementImage->ajouter($id, $nomImage);
                        $this->modeleEvenement->modifier($id, $titre, $desc, $date_ev, $date_fin, $lieu, $cat, $prix, $cap, $nomImage);
                    }
                }

                // Gérer les tickets: suppression puis re-création pour simplifier
                $this->modeleTypeTicket->supprimerParEvenement($id);
                if (isset($_POST['tickets']) && is_array($_POST['tickets'])) {
                    foreach ($_POST['tickets'] as $ticket) {
                        $nomTicket = htmlspecialchars($ticket['nom']);
                        $prixTicket = floatval($ticket['prix'] ?? 0);
                        // On considère ici la quantité comme totale dispo, ou reset s'ils modifient
                        $quantiteTicket = intval($ticket['quantite'] ?? 0);
                        if (!empty($nomTicket) && $prixTicket >= 0 && $quantiteTicket > 0) {
                            $this->modeleTypeTicket->creer($id, $nomTicket, $prixTicket, $quantiteTicket);
                        }
                    }
                }

                header("Location: index.php?action=mes_evenements");
                exit();
            }
        }

        // Chargement des données pour la vue GET
        $typesTickets = $this->modeleTypeTicket->listerParEvenement($id);
        require 'views/organisateur/modifier_evenement.php';
    }
    /**
     * Point de terminaison API retournant les statistiques de performance des événements de l'organisateur.
     */
    public function stats_organisateur_api()
    {
        if (!isset($_SESSION['utilisateur_id']) || $_SESSION['role'] !== 'organisateur') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Accès interdit']);
            return;
        }

        $stats = $this->modeleEvenement->getStatsPourOrganisateur($_SESSION['utilisateur_id']);
        echo json_encode([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Point de terminaison API retournant la liste des événements appartenant à l'organisateur.
     */
    public function mes_evenements_api()
    {
        if (!isset($_SESSION['utilisateur_id']) || $_SESSION['role'] !== 'organisateur') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Accès interdit']);
            return;
        }

        $evenements = $this->modeleEvenement->listerParOrganisateur($_SESSION['utilisateur_id']);
        echo json_encode([
            'success' => true,
            'data' => $evenements
        ]);
    }
}
?>
