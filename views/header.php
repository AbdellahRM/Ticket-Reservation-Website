<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EventZ&A — Gestion d'Événements</title>
    <meta name="description" content="Découvrez et réservez les meilleurs événements sur la plateforme EventZ&A.">
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="public/css/style.css">
</head>
<body>

<!-- Global ambient grid -->
<div class="grid-bg"></div>

<nav class="navbar navbar-expand-lg sticky-top">
    <div class="container">
        <a class="navbar-brand" href="index.php">
            <i class="bi bi-stars me-1" style="color:var(--primary);"></i>Event<span class="brand-accent">Z&A</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto ms-3 gap-1">
                <li class="nav-item">
                    <a class="nav-link" href="index.php?action=accueil"><i class="bi bi-house me-1"></i>Accueil</a>
                </li>
            </ul>
            <ul class="navbar-nav ms-auto align-items-center gap-1">
                <?php if (isset($_SESSION['utilisateur_id'])): ?>
                    <li class="nav-item dropdown d-flex align-items-center gap-2">
                        <img src="public/images/profiles/<?php echo $_SESSION['photo_profil'] ?? 'default_profile.png'; ?>"
                             class="rounded-circle border border-2"
                             style="width:34px;height:34px;object-fit:cover;border-color:var(--primary)!important;"
                             alt="Avatar">
                        <a class="nav-link dropdown-toggle fw-semibold" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
                            <?php echo htmlspecialchars($_SESSION['prenom']); ?>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <a class="dropdown-item" href="index.php?action=mon_profil">
                                    <i class="bi bi-person-circle me-2"></i>Mon Profil
                                </a>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <?php if ($_SESSION['role'] === 'organisateur'): ?>
                                <li><a class="dropdown-item" href="index.php?action=mes_evenements"><i class="bi bi-calendar-check me-2"></i>Mes Événements</a></li>
                                <li><a class="dropdown-item" href="index.php?action=creer_evenement"><i class="bi bi-plus-circle me-2"></i>Créer un Événement</a></li>
                            <?php
    elseif ($_SESSION['role'] === 'client'): ?>
                                <li><a class="dropdown-item" href="index.php?action=mes_reservations"><i class="bi bi-ticket-perforated me-2"></i>Mes Réservations</a></li>
                            <?php
    elseif ($_SESSION['role'] === 'administrateur'): ?>
                                <li><a class="dropdown-item" href="index.php?action=admin_dashboard"><i class="bi bi-speedometer2 me-2"></i>Tableau de bord</a></li>
                            <?php
    endif; ?>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="index.php?action=deconnexion"><i class="bi bi-box-arrow-right me-2"></i>Déconnexion</a></li>
                        </ul>
                    </li>
                <?php
else: ?>
                    <li class="nav-item">
                        <a class="nav-link" href="index.php?action=connexion"><i class="bi bi-person me-1"></i>Connexion</a>
                    </li>
                    <li class="nav-item">
                        <a class="btn btn-primary px-4" href="index.php?action=inscription">S'inscrire</a>
                    </li>
                <?php
endif; ?>
            </ul>
        </div>
    </div>
</nav>

<main>
