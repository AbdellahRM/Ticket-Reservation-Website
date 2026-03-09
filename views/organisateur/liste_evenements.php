<?php include 'views/header.php'; ?>

<div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
            <p class="text-primary fw-semibold small text-uppercase mb-1">Organisateur</p>
            <h1 class="fw-black mb-0" style="letter-spacing:-1px;">Mes Événements</h1>
        </div>
        <a href="index.php?action=creer_evenement" class="btn btn-primary px-4">
            <i class="bi bi-plus-circle me-2"></i>Créer un événement
        </a>
    </div>

    <div class="card">
        <div class="table-responsive">
            <table class="table table-hover mb-0">
                <thead>
                    <tr>
                        <th>Événement</th>
                        <th>Date</th>
                        <th>Lieu</th>
                        <th>Capacité</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($evenements)): ?>
                        <tr>
                            <td colspan="6" class="text-center py-5">
                                <i class="bi bi-calendar-x" style="font-size:3rem;color:var(--text-muted);"></i>
                                <p class="text-muted mt-3 mb-0">Vous n'avez pas encore créé d'événement.</p>
                                <a href="index.php?action=creer_evenement" class="btn btn-primary mt-3">Créer mon premier événement</a>
                            </td>
                        </tr>
                    <?php
endif; ?>
                    <?php foreach ($evenements as $ev): ?>
                        <tr>
                            <td>
                                <div class="fw-semibold"><?php echo htmlspecialchars($ev['titre']); ?></div>
                                <small class="text-muted"><?php echo htmlspecialchars($ev['categorie']); ?></small>
                            </td>
                            <td class="text-muted small"><?php echo date('d M Y', strtotime($ev['date_evenement'])); ?></td>
                            <td class="text-muted small"><?php echo htmlspecialchars($ev['lieu']); ?></td>
                            <td>
                                <span class="badge bg-secondary"><?php echo $ev['capacite']; ?> places</span>
                            </td>
                            <td>
                                <?php if ($ev['statut'] === 'publie'): ?>
                                    <span class="badge bg-success"><i class="bi bi-check-circle me-1"></i>Publié</span>
                                <?php
    elseif ($ev['statut'] === 'termine'): ?>
                                    <span class="badge bg-secondary"><i class="bi bi-archive me-1"></i>Terminé</span>
                                <?php
    else: ?>
                                    <span class="badge bg-warning"><i class="bi bi-pencil me-1"></i>Brouillon</span>
                                <?php
    endif; ?>
                            </td>
                            <td>
                                <div class="d-flex gap-2">
                                    <a href="index.php?action=details&id=<?php echo $ev['id']; ?>" class="btn btn-sm btn-outline-secondary" title="Voir">
                                        <i class="bi bi-eye"></i>
                                    </a>
                                    <a href="index.php?action=modifier_evenement&id=<?php echo $ev['id']; ?>" class="btn btn-sm btn-outline-primary" title="Modifier">
                                        <i class="bi bi-pencil-square"></i>
                                    </a>
                                    <?php if ($ev['statut'] !== 'publie'): ?>
                                        <a href="index.php?action=publier_evenement&id=<?php echo $ev['id']; ?>" class="btn btn-sm btn-outline-success" title="Publier">
                                            <i class="bi bi-send"></i>
                                        </a>
                                    <?php
    endif; ?>
                                </div>
                            </td>
                        </tr>
                    <?php
endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php include 'views/footer.php'; ?>
