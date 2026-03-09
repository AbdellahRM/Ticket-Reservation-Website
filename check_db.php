<?php
require_once 'c:/wamp64/www/Deuxieme_Anne/BackEnd/Chakchabani/connexion.php';

$res = $connexion->query("SELECT id, titre, statut FROM evenements");
if ($res) {
    echo "ID | Titre | Statut\n";
    echo "--------------------\n";
    while ($row = $res->fetch_assoc()) {
        echo $row['id'] . " | " . $row['titre'] . " | " . $row['statut'] . "\n";
    }
}
else {
    echo "Erreur lors de la requête : " . $connexion->error . "\n";
}
$res = $connexion->query("SELECT id, nom, prenom, role FROM utilisateurs");
if ($res) {
    echo "\nID | Nom | Prenom | Role\n";
    echo "------------------------\n";
    while ($row = $res->fetch_assoc()) {
        echo $row['id'] . " | " . $row['nom'] . " | " . $row['prenom'] . " | " . $row['role'] . "\n";
    }
}
