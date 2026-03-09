<?php include 'views/header.php'; ?>

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-9">

            <div class="mb-5">
                <a href="index.php?action=mes_evenements" class="text-muted small text-decoration-none">
                    <i class="bi bi-arrow-left me-1"></i>Retour à mes événements
                </a>
                <h1 class="fw-black mt-2 mb-0" style="letter-spacing:-1px;">Créer un événement</h1>
                <p class="text-muted">Remplissez les informations ci-dessous pour publier votre événement.</p>
            </div>

            <form action="index.php?action=creer_evenement" method="POST" enctype="multipart/form-data">
                <!-- Infos générales -->
                <div class="card mb-4">
                    <div class="card-header">
                        <i class="bi bi-info-circle me-2" style="color:var(--primary);"></i>Informations générales
                    </div>
                    <div class="card-body p-4">
                        <div class="mb-4">
                            <label class="form-label">Titre de l'événement *</label>
                            <input type="text" name="titre" class="form-control" placeholder="Ex: Grand Concert de Jazz au Parc" required>
                        </div>
                        <div class="mb-4">
                            <label class="form-label">Description</label>
                            <textarea name="description" class="form-control" rows="5" placeholder="Décrivez votre événement en détail…"></textarea>
                        </div>
                        <div class="row g-3 mb-4">
                            <div class="col-md-6">
                                <label class="form-label"><i class="bi bi-calendar3 me-1"></i>Date et heure de début *</label>
                                <input type="datetime-local" name="date_evenement" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label"><i class="bi bi-calendar-check me-1"></i>Date et heure de fin</label>
                                <input type="datetime-local" name="date_fin" class="form-control">
                            </div>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label"><i class="bi bi-geo-alt me-1"></i>Lieu *</label>
                                <input type="text" name="lieu" class="form-control" placeholder="Adresse ou ville" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label"><i class="bi bi-tag me-1"></i>Catégorie</label>
                                <select name="categorie" class="form-select">
                                    <option value="Concert">🎵 Concert</option>
                                    <option value="Conférence">🎤 Conférence</option>
                                    <option value="Sport">🏆 Sport</option>
                                    <option value="Théâtre">🎭 Théâtre</option>
                                    <option value="Autre">✨ Autre</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Capacité & prix -->
                <div class="card mb-4">
                    <div class="card-header">
                        <i class="bi bi-sliders me-2" style="color:var(--primary);"></i>Détails & capacité
                    </div>
                    <div class="card-body p-4">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label"><i class="bi bi-currency-euro me-1"></i>Prix de base (€) *</label>
                                <input type="number" step="0.01" name="prix_base" class="form-control" value="0.00" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label"><i class="bi bi-people me-1"></i>Capacité totale *</label>
                                <input type="number" name="capacite" class="form-control" placeholder="Nombre de places maximum" required>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Images -->
                <div class="card mb-4">
                    <div class="card-header">
                        <i class="bi bi-images me-2" style="color:var(--primary);"></i>Images illustratrices
                    </div>
                    <div class="card-body p-4">
                        <div class="p-4 text-center rounded-3" style="border:2px dashed var(--border);background:var(--dark-elevated);">
                            <i class="bi bi-cloud-arrow-up" style="font-size:2.5rem;color:var(--text-muted);"></i>
                            <p class="text-muted mt-2 mb-3">Glissez vos images ici, ou cliquez pour choisir</p>
                            <input type="file" name="images[]" class="form-control" accept="image/*" multiple id="imgInput" style="max-width:350px;margin:0 auto;">
                            <p class="text-muted small mt-2 mb-0">JPG, PNG · Taille max 2 Mo chacun · Plusieurs images acceptées</p>
                        </div>
                        <div id="previewContainer" class="d-flex gap-2 flex-wrap mt-3"></div>
                    </div>
                </div>

                <!-- Tickets -->
                <div class="card mb-5">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span><i class="bi bi-ticket-perforated me-2" style="color:var(--primary);"></i>Types de tickets</span>
                        <button type="button" class="btn btn-sm btn-outline-primary" id="addTicketBtn">
                            <i class="bi bi-plus me-1"></i>Ajouter un type
                        </button>
                    </div>
                    <div class="card-body p-4" id="ticketsContainer"></div>
                </div>

                <div class="d-flex gap-3 flex-wrap">
                    <button type="submit" class="btn btn-primary px-5 py-3 fw-bold btn-pulse">
                        <i class="bi bi-check-lg me-2"></i>Créer l'événement
                    </button>
                    <a href="index.php?action=mes_evenements" class="btn btn-outline-secondary px-5 py-3">Annuler</a>
                </div>
            </form>

        </div>
    </div>
</div>

<script>
// Image preview
document.getElementById('imgInput').addEventListener('change', function() {
    const container = document.getElementById('previewContainer');
    container.innerHTML = '';
    [...this.files].forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'img-thumbnail';
            img.style.cssText = 'width:100px;height:80px;object-fit:cover;';
            container.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});

// Tickets
let ticketIndex = 0;
const container = document.getElementById('ticketsContainer');
document.getElementById('addTicketBtn').addEventListener('click', addTicketRow);

function addTicketRow(nom='', prix='', quantite='') {
    const row = document.createElement('div');
    row.className = 'row g-3 mb-3 align-items-end ticket-row';
    row.innerHTML = `
        <div class="col-md-4">
            <label class="form-label">Nom du ticket</label>
            <input type="text" name="tickets[${ticketIndex}][nom]" class="form-control" placeholder="Ex: Standard, VIP" value="${nom}" required>
        </div>
        <div class="col-md-3">
            <label class="form-label">Prix (€)</label>
            <input type="number" step="0.01" name="tickets[${ticketIndex}][prix]" class="form-control" placeholder="0.00" value="${prix}" required>
        </div>
        <div class="col-md-3">
            <label class="form-label">Quantité</label>
            <input type="number" name="tickets[${ticketIndex}][quantite]" class="form-control" placeholder="100" value="${quantite}" required>
        </div>
        <div class="col-md-2">
            <button type="button" class="btn btn-outline-secondary w-100 remove-ticket"><i class="bi bi-trash"></i></button>
        </div>
    `;
    container.appendChild(row);
    ticketIndex++;
}

container.addEventListener('click', e => {
    if (e.target.closest('.remove-ticket')) e.target.closest('.ticket-row').remove();
});

addTicketRow(); // start with one row
</script>

<?php include 'views/footer.php'; ?>
