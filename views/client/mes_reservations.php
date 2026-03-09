<?php include 'views/header.php'; ?>

<div class="container mt-4">
    <h1 class="fw-bold mb-4">Mes Réservations</h1>

    <div class="row g-4">
        <?php if (empty($reservations)): ?>
            <div class="col-12 text-center py-5">
                <i class="bi bi-ticket-perforated display-1 text-muted opacity-25"></i>
                <p class="mt-3 lead text-muted">Vous n'avez pas encore effectué de réservation.</p>
                <a href="index.php" class="btn btn-primary">Explorer les événements</a>
            </div>
        <?php
endif; ?>

        <?php foreach ($reservations as $res): ?>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h5 class="fw-bold mb-1"><?php echo $res['evenement_titre']; ?></h5>
                                <p class="text-muted small mb-0"><i class="bi bi-calendar"></i> <?php echo date('d/m/Y H:i', strtotime($res['date_evenement'])); ?></p>
                            </div>
                            <span class="badge <?php echo $res['statut'] === 'payee' ? 'bg-success' : 'bg-warning'; ?>">
                                <?php echo $res['statut'] === 'payee' ? 'Confirmée' : 'En attente'; ?>
                            </span>
                        </div>
                        
                        <div class="border-top pt-3 mt-3 d-flex justify-content-between align-items-center">
                            <div>
                                <span class="text-muted small">Total payé</span><br>
                                <span class="fw-bold fs-5"><?php echo number_format($res['total'], 2); ?> €</span>
                            </div>
                            <?php if ($res['statut'] === 'payee'): ?>
                                <a href="index.php?action=telecharger_ticket&id_res=<?php echo $res['id']; ?>" class="btn btn-outline-primary">
                                    <i class="bi bi-download"></i> Ticket PDF
                                </a>
                            <?php
    else: ?>
                                <a href="index.php?action=paiement&id_res=<?php echo $res['id']; ?>" class="btn btn-primary">Payer</a>
                            <?php
    endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        <?php
endforeach; ?>
    </div>
</div>

<?php include 'views/footer.php'; ?>
