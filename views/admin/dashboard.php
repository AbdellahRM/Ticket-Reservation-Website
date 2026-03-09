<?php include 'views/header.php'; ?>

<div class="container mt-4">
    <div class="row g-4 mb-4">
        <div class="col-md-4">
            <div class="card bg-primary text-white p-4">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="text-uppercase mb-1 opacity-75">Réservations totales</h6>
                        <h3 class="fw-bold mb-0"><?php echo $stats['total_reservations'] ?? 0; ?></h3>
                    </div>
                    <i class="bi bi-cart-check fs-1"></i>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card bg-success text-white p-4">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="text-uppercase mb-1 opacity-75">Revenu Global</h6>
                        <h3 class="fw-bold mb-0"><?php echo number_format($stats['revenu_total'] ?? 0, 2); ?> €</h3>
                    </div>
                    <i class="bi bi-cash-stack fs-1"></i>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card bg-info text-white p-4">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="text-uppercase mb-1 opacity-75">Utilisateurs actifs</h6>
                        <h3 class="fw-bold mb-0"><?php echo count($utilisateurs); ?></h3>
                    </div>
                    <i class="bi bi-people fs-1"></i>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-8">
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-white py-3 fw-bold">Gestion des Utilisateurs</div>
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Nom complet</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th>Date d'inscription</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($utilisateurs as $user): ?>
                                <tr>
                                    <td><?php echo $user['prenom'] . ' ' . $user['nom']; ?></td>
                                    <td><?php echo $user['email']; ?></td>
                                    <td><span class="badge bg-secondary"><?php echo $user['role']; ?></span></td>
                                    <td><?php echo date('d/m/Y', strtotime($user['date_creation'])); ?></td>
                                    <td>
                                        <a href="index.php?action=admin_supprimer_user&id=<?php echo $user['id']; ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Confirmer la suppression ?')">Supprimer</a>
                                    </td>
                                </tr>
                            <?php
endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            <div class="card shadow-sm">
                <div class="card-header bg-white py-3 fw-bold">Événements Publiés</div>
                <ul class="list-group list-group-flush">
                    <?php foreach ($evenements as $ev): ?>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <div class="fw-bold small"><?php echo $ev['titre']; ?></div>
                                <div class="text-muted smaller"><?php echo $ev['organisateur_nom']; ?></div>
                            </div>
                            <span class="badge bg-primary rounded-pill"><?php echo $ev['categorie']; ?></span>
                        </li>
                    <?php
endforeach; ?>
                </ul>
            </div>
        </div>
    </div>
</div>

<?php include 'views/footer.php'; ?>
