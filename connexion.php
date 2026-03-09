<?php
/**
 * Fichier de connexion à la base de données via mysqli.
 */

$host = 'localhost';
$user = 'root';
$pass = ''; // Par défaut sur WAMP/XAMPP
$dbname = 'event_managment';

// Activation du rapport d'erreurs pour mysqli
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // Tentative de connexion
    $connexion = new mysqli($host, $user, $pass, $dbname);

    // Définition du jeu de caractères
    $connexion->set_charset("utf8mb4");

}
catch (mysqli_sql_exception $e) {
    // En cas d'erreur de connexion
    die("Erreur de connexion à la base de données : " . $e->getMessage());
}
?>
