<?php include 'views/header.php'; ?>

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-7">

            <!-- Profile header -->
            <div class="card mb-4 text-center p-5" style="background: linear-gradient(135deg, var(--dark-card), var(--dark-elevated)); position:relative; overflow:hidden;">
                <div style="position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:300px;height:300px;
                            background:radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%);pointer-events:none;"></div>
                <div class="position-relative d-inline-block mb-3">
                    <img id="profilePreview"
                         src="public/images/profiles/<?php echo htmlspecialchars($utilisateur['photo_profil'] ?: 'default_profile.png'); ?>"
                         class="rounded-circle border border-3 profile-pic-large"
                         style="border-color:var(--primary)!important;"
                         alt="Photo de profil">
                    <label for="photo_profil" style="position:absolute;bottom:6px;right:6px;background:var(--primary);width:36px;height:36px;
                                border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 16px rgba(108,99,255,0.4);">
                        <i class="bi bi-camera-fill text-white" style="font-size:0.9rem;"></i>
                    </label>
                </div>
                <h3 class="fw-bold mb-1"><?php echo htmlspecialchars($utilisateur['prenom'] . ' ' . $utilisateur['nom']); ?></h3>
                <span class="badge bg-primary px-3 py-2"><?php echo ucfirst($utilisateur['role']); ?></span>
                <p class="text-muted small mt-2 mb-0">Membre depuis <?php echo date('M Y', strtotime($utilisateur['date_creation'])); ?></p>
            </div>

            <?php if (!empty($succes)): ?>
                <div class="alert alert-success d-flex align-items-center gap-2 mb-4">
                    <i class="bi bi-check-circle-fill flex-shrink-0"></i>
                    <div><?php echo $succes; ?></div>
                </div>
            <?php
endif; ?>
            <?php if (!empty($erreur)): ?>
                <div class="alert alert-danger d-flex align-items-center gap-2 mb-4">
                    <i class="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                    <div><?php echo $erreur; ?></div>
                </div>
            <?php
endif; ?>

            <form action="index.php?action=mon_profil" method="POST" enctype="multipart/form-data">
                <input type="file" id="photo_profil" name="photo_profil" class="d-none" accept="image/*">

                <!-- Personal info -->
                <div class="card mb-4">
                    <div class="card-header"><i class="bi bi-person me-2" style="color:var(--primary);"></i>Informations personnelles</div>
                    <div class="card-body p-4">
                        <div class="row g-3 mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Prénom</label>
                                <input type="text" name="prenom" class="form-control" value="<?php echo htmlspecialchars($utilisateur['prenom']); ?>" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Nom</label>
                                <input type="text" name="nom" class="form-control" value="<?php echo htmlspecialchars($utilisateur['nom']); ?>" required>
                            </div>
                        </div>
                        <div>
                            <label class="form-label"><i class="bi bi-envelope me-1"></i>Adresse email</label>
                            <input type="email" name="email" class="form-control" value="<?php echo htmlspecialchars($utilisateur['email']); ?>" required>
                        </div>
                    </div>
                </div>

                <!-- Security -->
                <div class="card mb-5">
                    <div class="card-header"><i class="bi bi-shield-lock me-2" style="color:var(--primary);"></i>Sécurité</div>
                    <div class="card-body p-4">
                        <label class="form-label">Nouveau mot de passe</label>
                        <input type="password" name="mot_de_passe" class="form-control" placeholder="Laissez vide pour ne pas modifier">
                        <p class="form-text mt-2">Minimum 8 caractères recommandé.</p>
                    </div>
                </div>

                <div class="d-flex gap-3 flex-wrap">
                    <button type="submit" class="btn btn-primary px-5 py-3 fw-bold">
                        <i class="bi bi-check-lg me-2"></i>Enregistrer les modifications
                    </button>
                    <a href="index.php?action=accueil" class="btn btn-outline-secondary px-5 py-3">Retour</a>
                </div>
            </form>

        </div>
    </div>
</div>

<script>
document.getElementById('photo_profil').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = e => document.getElementById('profilePreview').src = e.target.result;
        reader.readAsDataURL(this.files[0]);
    }
});
</script>

<?php include 'views/footer.php'; ?>
