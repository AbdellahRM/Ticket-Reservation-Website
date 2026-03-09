<?php include 'views/header.php'; ?>

<div class="min-vh-100 d-flex align-items-center py-5">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-6 col-md-8">
                <div class="text-center mb-4">
                    <a href="index.php" class="text-decoration-none">
                        <h2 class="fw-black mb-1" style="font-size:1.8rem;">
                            <i class="bi bi-stars me-1" style="color:var(--primary);"></i>Event<span style="color:var(--primary);">Z&A</span>
                        </h2>
                    </a>
                    <p class="text-muted small">Créez votre compte et commencez l'aventure.</p>
                </div>

                <div class="card p-4 p-md-5">
                    <?php if (!empty($erreur)): ?>
                        <div class="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                            <i class="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                            <div><?php echo $erreur; ?></div>
                        </div>
                    <?php
endif; ?>

                    <form action="index.php?action=inscription" method="POST">
                        <div class="row g-3 mb-3">
                            <div class="col-md-6">
                                <label class="form-label">Prénom</label>
                                <input type="text" name="prenom" class="form-control" placeholder="Jean" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Nom</label>
                                <input type="text" name="nom" class="form-control" placeholder="Dupont" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label"><i class="bi bi-envelope me-1"></i>Adresse email</label>
                            <input type="email" name="email" class="form-control" placeholder="vous@exemple.com" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label"><i class="bi bi-lock me-1"></i>Mot de passe</label>
                            <input type="password" name="mot_de_passe" class="form-control" placeholder="••••••••" required>
                        </div>
                        <div class="mb-4">
                            <label class="form-label"><i class="bi bi-person-badge me-1"></i>Je suis</label>
                            <div class="row g-3 mt-1">
                                <div class="col-6">
                                    <label class="d-block p-3 text-center rounded-3 cursor-pointer" style="border:1.5px solid var(--border);background:var(--dark-elevated);cursor:pointer;transition:var(--transition);" id="lbl-client">
                                        <input type="radio" name="role" value="client" class="d-none" checked onchange="highlightRole()">
                                        <i class="bi bi-ticket-perforated-fill d-block mb-1" style="font-size:1.4rem;color:var(--primary);"></i>
                                        <span class="small fw-semibold">Client</span>
                                        <p class="mb-0 text-muted" style="font-size:0.72rem;">Pour réserver</p>
                                    </label>
                                </div>
                                <div class="col-6">
                                    <label class="d-block p-3 text-center rounded-3" style="border:1.5px solid var(--border);background:var(--dark-elevated);cursor:pointer;transition:var(--transition);" id="lbl-org">
                                        <input type="radio" name="role" value="organisateur" class="d-none" onchange="highlightRole()">
                                        <i class="bi bi-calendar-plus-fill d-block mb-1" style="font-size:1.4rem;color:var(--accent);"></i>
                                        <span class="small fw-semibold">Organisateur</span>
                                        <p class="mb-0 text-muted" style="font-size:0.72rem;">Pour créer des événements</p>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary w-100 py-3 fw-bold">
                            <i class="bi bi-person-plus me-2"></i>Créer mon compte
                        </button>
                    </form>

                    <p class="text-center text-muted small mt-4 mb-0">
                        Déjà inscrit ? <a href="index.php?action=connexion" class="fw-semibold">Se connecter</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function highlightRole() {
    const clientSelected = document.querySelector('[value="client"]').checked;
    document.getElementById('lbl-client').style.borderColor = clientSelected ? 'var(--primary)' : 'var(--border)';
    document.getElementById('lbl-org').style.borderColor = !clientSelected ? 'var(--accent)' : 'var(--border)';
}
document.addEventListener('DOMContentLoaded', highlightRole);
</script>

<?php include 'views/footer.php'; ?>
