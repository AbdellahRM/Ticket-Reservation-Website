<?php include 'views/header.php'; ?>

<div class="min-vh-100 d-flex align-items-center py-5">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="text-center mb-4">
                    <a href="index.php" class="text-decoration-none">
                        <h2 class="fw-black mb-1" style="font-size:1.8rem;">
                            <i class="bi bi-stars me-1" style="color:var(--primary);"></i>Event<span style="color:var(--primary);">Z&A</span>
                        </h2>
                    </a>
                    <p class="text-muted small">Bon retour ! Connectez-vous à votre compte.</p>
                </div>

                <div class="card p-4 p-md-5">
                    <?php if (!empty($erreur)): ?>
                        <div class="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                            <i class="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                            <div><?php echo htmlspecialchars($erreur); ?></div>
                        </div>
                    <?php
endif; ?>
                    <?php if (isset($_GET['success'])): ?>
                        <div class="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
                            <i class="bi bi-check-circle-fill flex-shrink-0"></i>
                            <div>Inscription réussie ! Vous pouvez vous connecter.</div>
                        </div>
                    <?php
endif; ?>

                    <form action="index.php?action=connexion" method="POST">
                        <div class="mb-4">
                            <label class="form-label" for="email"><i class="bi bi-envelope me-1"></i>Adresse email</label>
                            <input type="email" name="email" id="email" class="form-control" placeholder="vous@exemple.com" required>
                        </div>
                        <div class="mb-5">
                            <label class="form-label" for="mot_de_passe"><i class="bi bi-lock me-1"></i>Mot de passe</label>
                            <input type="password" name="mot_de_passe" id="mot_de_passe" class="form-control" placeholder="••••••••" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100 py-3 fw-bold">
                            <i class="bi bi-box-arrow-in-right me-2"></i>Se connecter
                        </button>
                    </form>

                    <p class="text-center text-muted small mt-4 mb-0">
                        Pas encore de compte ?
                        <a href="index.php?action=inscription" class="fw-semibold">Créer un compte</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include 'views/footer.php'; ?>
