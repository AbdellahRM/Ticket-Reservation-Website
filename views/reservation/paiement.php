<?php include 'views/header.php'; ?>

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card p-4 text-center">
                <h2 class="fw-bold mb-4">Paiement Sécurisé</h2>
                <p>Montant à régler : <span class="h4 fw-bold text-primary"><?php echo number_format($reservation['total'], 2); ?> €</span></p>
                <p class="text-muted mb-4">Événement : <?php echo $reservation['evenement_titre']; ?></p>

                <form action="index.php?action=paiement&id_res=<?php echo $reservation['id']; ?>" method="POST">
                    <div class="mb-3 text-start">
                        <label class="form-label">Numéro de carte</label>
                        <input type="text" class="form-control" placeholder="**** **** **** ****" required>
                    </div>
                    <div class="row mb-4 text-start">
                        <div class="col">
                            <label class="form-label">Expiration</label>
                            <input type="text" class="form-control" placeholder="MM/YY" required>
                        </div>
                        <div class="col">
                            <label class="form-label">CVV</label>
                            <input type="text" class="form-control" placeholder="***" required>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-success btn-lg w-100 py-3 fw-bold">Payer maintenant</button>
                    <p class="mt-3 small text-muted"><i class="bi bi-shield-lock"></i> Simulation de passerelle de paiement sécurisée</p>
                </form>
            </div>
        </div>
    </div>
</div>

<?php include 'views/footer.php'; ?>
