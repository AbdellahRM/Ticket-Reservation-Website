<?php include 'views/header.php'; ?>

<div class="container py-5">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="index.php?action=accueil">Accueil</a></li>
            <li class="breadcrumb-item active"><?php echo htmlspecialchars($evenement['titre']); ?></li>
        </ol>
    </nav>

    <div class="row g-5">
        <!-- Left column -->
        <div class="col-lg-8">
            <!-- Main image -->
            <div style="border-radius:var(--radius);overflow:hidden;margin-bottom:16px;box-shadow:var(--shadow);">
                <img id="mainImage" src="public/images/<?php echo $evenement['image'] ?: 'default.jpg'; ?>"
                     class="w-100" alt="<?php echo htmlspecialchars($evenement['titre']); ?>"
                     style="height:420px;object-fit:cover;transition:var(--transition);">
            </div>

            <!-- Thumbnails gallery -->
            <?php if (!empty($evenementImages)): ?>
            <div class="d-flex gap-2 mb-4 overflow-auto pb-1">
                <?php foreach ($evenementImages as $img): ?>
                    <img src="public/images/<?php echo htmlspecialchars($img['chemin_image']); ?>"
                         class="img-thumbnail"
                         style="height:80px;width:120px;object-fit:cover;cursor:pointer;flex-shrink:0;"
                         onclick="document.getElementById('mainImage').src=this.src;" alt="Vue">
                <?php
    endforeach; ?>
            </div>
            <?php
endif; ?>

            <!-- Title & meta -->
            <div class="mb-4">
                <span class="badge bg-primary mb-2"><?php echo htmlspecialchars($evenement['categorie']); ?></span>
                <h1 class="fw-black mb-3" style="letter-spacing:-1px;"><?php echo htmlspecialchars($evenement['titre']); ?></h1>
                <div class="d-flex flex-wrap gap-4 text-muted">
                    <span><i class="bi bi-calendar-event me-2" style="color:var(--primary);"></i><?php echo date('d M Y · H:i', strtotime($evenement['date_evenement'])); ?></span>
                    <?php if ($evenement['date_fin']): ?>
                        <span><i class="bi bi-calendar-check me-2" style="color:var(--primary);"></i>Fin : <?php echo date('d M Y · H:i', strtotime($evenement['date_fin'])); ?></span>
                    <?php
endif; ?>
                    <span><i class="bi bi-geo-alt-fill me-2" style="color:var(--accent);"></i><?php echo htmlspecialchars($evenement['lieu']); ?></span>
                    <span><i class="bi bi-people-fill me-2" style="color:var(--success);"></i><?php echo $evenement['capacite']; ?> places</span>
                </div>
            </div>

            <!-- Description -->
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="fw-bold mb-3"><i class="bi bi-file-text me-2" style="color:var(--primary);"></i>Description</h5>
                    <p class="text-muted" style="line-height:1.8;"><?php echo nl2br(htmlspecialchars($evenement['description'])); ?></p>
                </div>
            </div>

            <!-- Organizer -->
            <div class="card">
                <div class="card-body d-flex align-items-center gap-3">
                    <div class="rounded-circle d-flex align-items-center justify-content-center"
                         style="width:50px;height:50px;background:rgba(108,99,255,0.15);flex-shrink:0;">
                        <i class="bi bi-person-fill" style="font-size:1.4rem;color:var(--primary);"></i>
                    </div>
                    <div>
                        <p class="small text-muted mb-0">Organisé par</p>
                        <p class="fw-semibold mb-0"><?php echo htmlspecialchars($evenement['organisateur_prenom'] . ' ' . $evenement['organisateur_nom']); ?></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right column – Booking widget -->
        <div class="col-lg-4">
            <div class="card sticky-top p-0">
                <div class="card-body p-4">
                    <h5 class="fw-bold mb-4">Réserver votre place</h5>

                    <?php if (empty($typesTickets)): ?>
                        <div class="alert alert-info small">Aucun type de ticket disponible pour le moment.</div>
                    <?php
else: ?>
                        <form action="index.php?action=reserver" method="POST">
                            <input type="hidden" name="id_evenement" value="<?php echo $evenement['id']; ?>">

                            <div class="mb-3">
                                <label class="form-label">Type de ticket</label>
                                <select name="id_type_ticket" id="ticketSelect" class="form-select" required onchange="updatePrice()">
                                    <?php foreach ($typesTickets as $type): ?>
                                        <option value="<?php echo $type['id']; ?>"
                                                data-prix="<?php echo $type['prix']; ?>"
                                                data-dispo="<?php echo $type['quantite_disponible']; ?>">
                                            <?php echo htmlspecialchars($type['nom']); ?> — <?php echo number_format($type['prix'], 2); ?> €
                                            (<?php echo $type['quantite_disponible']; ?> restants)
                                        </option>
                                    <?php
    endforeach; ?>
                                </select>
                            </div>

                            <div class="mb-4">
                                <label class="form-label">Quantité</label>
                                <input type="number" name="quantite" id="quantite" class="form-control" value="1" min="1" max="10" oninput="updatePrice()">
                            </div>

                            <div class="price-tag mb-4">
                                Total : <span id="priceDisplay"><?php echo number_format($typesTickets[0]['prix'], 2); ?></span> €
                            </div>

                            <?php if (isset($_SESSION['utilisateur_id'])): ?>
                                <button type="submit" class="btn btn-primary w-100 py-3 fw-bold btn-pulse">
                                    <i class="bi bi-bag-check me-2"></i>Réserver maintenant
                                </button>
                            <?php
    else: ?>
                                <a href="index.php?action=connexion" class="btn btn-primary w-100 py-3 fw-bold btn-pulse">
                                    <i class="bi bi-box-arrow-in-right me-2"></i>Se connecter pour réserver
                                </a>
                            <?php
    endif; ?>

                            <p class="text-center text-muted small mt-3 mb-0">
                                <i class="bi bi-shield-check me-1"></i>Paiement sécurisé · Ticket instantané
                            </p>
                        </form>
                    <?php
endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function updatePrice() {
    const select = document.getElementById('ticketSelect');
    const qty = parseInt(document.getElementById('quantite').value) || 1;
    const prix = parseFloat(select.options[select.selectedIndex].dataset.prix) || 0;
    document.getElementById('priceDisplay').textContent = (prix * qty).toFixed(2);
}
</script>

<?php include 'views/footer.php'; ?>
