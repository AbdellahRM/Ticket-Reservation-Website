<?php
require_once 'c:/wamp64/www/Deuxieme_Anne/BackEnd/Chakchabani/connexion.php';

echo "--- TOUS LES ÉVÉNEMENTS ---\n";
$res = $connexion->query("SELECT id, id_organisateur, titre, statut FROM evenements");
if ($res) {
    while ($row = $res->fetch_assoc()) {
        echo "ID: " . $row['id'] . " | Org: " . $row['id_organisateur'] . " | Titre: " . $row['titre'] . " | Statut: " . $row['statut'] . "\n";
    }
}
else {
    echo "Erreur: " . $connexion->error;
}

echo "\n--- TOUS LES UTILISATEURS ---\n";
$res = $connexion->query("SELECT id, nom, role FROM utilisateurs");
if ($res) {
    while ($row = $res->fetch_assoc()) {
        echo "ID: " . $row['id'] . " | Nom: " . $row['nom'] . " | Role: " . $row['role'] . "\n";
    }
}
?>
