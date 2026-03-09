<?php include 'header.php'; ?>

<section class="hero-section">
    <div class="container position-relative">
        <div class="hero-badge">
            <i class="bi bi-lightning-charge-fill"></i>
            La plateforme #1 d'événements
        </div>
        <h1>Découvrez des<br>événements<br><em style="font-style:normal;color:var(--primary);">incroyables</em></h1>
        <p class="lead">Réservez vos places en quelques clics. Des concerts aux conférences, trouvez votre prochaine aventure.</p>
        <?php if (!isset($_SESSION['utilisateur_id'])): ?>
            <div class="d-flex gap-3 justify-content-center flex-wrap">
                <a href="index.php?action=inscription" class="btn btn-primary btn-lg px-5 btn-pulse">
                    <i class="bi bi-rocket-takeoff me-2"></i>Commencer maintenant
                </a>
                <a href="#evenements" class="btn btn-light btn-lg px-5">
                    <i class="bi bi-grid me-2"></i>Voir les événements
                </a>
            </div>
        <?php
else: ?>
            <a href="#evenements" class="btn btn-primary btn-lg px-5 btn-pulse">
                <i class="bi bi-search me-2"></i>Explorer les événements
            </a>
        <?php
endif; ?>
    </div>
</section>

<div class="container py-5" id="evenements">
    <div class="d-flex justify-content-between align-items-end mb-5">
        <div>
            <p class="text-primary fw-semibold mb-1 small text-uppercase letter-spacing-1">À l'affiche</p>
            <h2 class="section-title mb-0">Événements <span style="color:var(--primary);">à la une</span></h2>
        </div>
        <div class="dropdown">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i class="bi bi-funnel me-1"></i> Catégories
            </button>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#"><i class="bi bi-music-note me-2"></i>Concerts</a></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-people me-2"></i>Conférences</a></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-trophy me-2"></i>Sports</a></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-masks-theater me-2"></i>Théâtre</a></li>
            </ul>
        </div>
    </div>

    <?php if (empty($evenements)): ?>
        <div class="text-center py-5">
            <i class="bi bi-calendar-x" style="font-size:4rem;color:var(--text-muted);"></i>
            <h4 class="mt-3 text-muted">Aucun événement disponible pour le moment.</h4>
            <p class="text-muted small">Revenez bientôt pour découvrir de nouveaux événements.</p>
        </div>
    <?php
else: ?>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <?php foreach ($evenements as $ev): ?>
                <div class="col">
                    <div class="card event-card h-100">
                        <div style="overflow:hidden;">
                            <img src="public/images/<?php echo $ev['image'] ?: 'default.jpg'; ?>"
                                 class="card-img-top"
                                 alt="<?php echo htmlspecialchars($ev['titre']); ?>">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex gap-2 mb-3">
                                <span class="badge bg-primary"><?php echo htmlspecialchars($ev['categorie']); ?></span>
                            </div>
                            <h5 class="card-title fw-bold mb-2"><?php echo htmlspecialchars($ev['titre']); ?></h5>
                            <p class="text-muted small mb-3">
                                <i class="bi bi-geo-alt me-1"></i><?php echo htmlspecialchars($ev['lieu']); ?><br>
                                <i class="bi bi-calendar3 me-1"></i><?php echo date('d M Y · H:i', strtotime($ev['date_evenement'])); ?>
                            </p>
                            <div class="d-flex justify-content-between align-items-center mt-auto pt-3" style="border-top:1px solid var(--border);">
                                <div>
                                    <p class="mb-0 small text-muted">À partir de</p>
                                    <span class="fw-bold" style="font-size:1.1rem;color:var(--primary);"><?php echo number_format($ev['prix_base'], 2); ?> €</span>
                                </div>
                                <a href="index.php?action=details&id=<?php echo $ev['id']; ?>" class="btn btn-outline-primary btn-sm px-3">
                                    Voir <i class="bi bi-arrow-right ms-1"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            <?php
    endforeach; ?>
        </div>
    <?php
endif; ?>
</div>

<?php include 'footer.php'; ?>
