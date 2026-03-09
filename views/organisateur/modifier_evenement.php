<?php include 'views/header.php'; ?>

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-9">

            <div class="mb-5">
                <a href="index.php?action=mes_evenements" class="text-muted small text-decoration-none">
                    <i class="bi bi-arrow-left me-1"></i>Retour à mes événements
                </a>
                <h1 class="fw-black mt-2 mb-0" style="letter-spacing:-1px;">Modifier l'événement</h1>
                <p class="text-muted"><?php echo htmlspecialchars($evenement['titre']); ?></p>
            </div>

            <form action="index.php?action=modifier_evenement&id=<?php echo $evenement['id']; ?>" method="POST" enctype="multipart/form-data">

                <!-- Infos générales -->
                <div class="card mb-4">
                    <div class="card-header"><i class="bi bi-info-circle me-2" style="color:var(--primary);"></i>Informations générales</div>
                    <div class="card-body p-4">
                        <div class="mb-4">
                            <label class="form-label">Titre *</label>
                            <input type="text" name="titre" class="form-control" value="<?php echo htmlspecialchars($evenement['titre']); ?>" required>
                        </div>
                        <div class="mb-4">
                            <label class="form-label">Description</label>
                            <textarea name="description" class="form-control" rows="5"><?php echo htmlspecialchars($evenement['description']); ?></textarea>
                        </div>
                        <div class="row g-3 mb-4">
                            <div class="col-md-6">
                                <label class="form-label"><i class="bi bi-calendar3 me-1"></i>Date et heure de début *</label>
                                <input type="datetime-local" name="date_evenement" class="form-control" value="<?php echo date('Y-m-d\TH:i', strtotime($evenement['date_evenement'])); ?>" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label"><i class="bi bi-calendar-check me-1"></i>Date et heure de fin</label>
                                <input type="datetime-local" name="date_fin" class="form-control" value="<?php echo $evenement['date_fin'] ? date('Y-m-d\TH:i', strtotime($evenement['date_fin'])) : ''; ?>">
                            </div>
                        </div>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label"><i class="bi bi-geo-alt me-1"></i>Lieu *</label>
                                <input type="text" name="lieu" class="form-control" value="<?php echo htmlspecialchars($evenement['lieu']); ?>" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label"><i class="bi bi-tag me-1"></i>Catégorie</label>
                                <select name="categorie" class="form-select">
                                    <option value="Concert" <?php echo $evenement['categorie'] == 'Concert' ? 'selected' : ''; ?>>🎵 Concert</option>
                                    <option value="Conférence" <?php echo $evenement['categorie'] == 'Conférence' ? 'selected' : ''; ?>>🎤 Conférence</option>
                                    <option value="Sport" <?php echo $evenement['categorie'] == 'Sport' ? 'selected' : ''; ?>>🏆 Sport</option>
                                    <option value="Théâtre" <?php echo $evenement['categorie'] == 'Théâtre' ? 'selected' : ''; ?>>🎭 Théâtre</option>
                                    <option value="Autre" <?php echo $evenement['categorie'] == 'Autre' ? 'selected' : ''; ?>>✨ Autre</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Capacité -->
                <div class="card mb-4">
                    <div class="card-header"><i class="bi bi-sliders me-2" style="color:var(--primary);"></i>Détails & capacité</div>
                    <div class="card-body p-4">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Prix de base (€) *</label>
                                <input type="number" step="0.01" name="prix_base" class="form-control" value="<?php echo $evenement['prix_base']; ?>" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Capacité totale *</label>
                                <input type="number" name="capacite" class="form-control" value="<?php echo $evenement['capacite']; ?>" required>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Images -->
                <div class="card mb-4">
                    <div class="card-header"><i class="bi bi-images me-2" style="color:var(--primary);"></i>Ajouter de nouvelles images (optionnel)</div>
                    <div class="card-body p-4">
                        <input type="file" name="images[]" class="form-control" accept="image/*" multiple>
                        <p class="form-text mt-2">Laissez vide pour conserver les images actuelles.</p>
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
                    <button type="submit" class="btn btn-primary px-5 py-3 fw-bold">
                        <i class="bi bi-check-lg me-2"></i>Mettre à jour l'événement
                    </button>
                    <a href="index.php?action=mes_evenements" class="btn btn-outline-secondary px-5 py-3">Annuler</a>
                </div>
            </form>

        </div>
    </div>
</div>

<script>
let ticketIndex = 0;
const container = document.getElementById('ticketsContainer');
document.getElementById('addTicketBtn').addEventListener('click', () => addTicketRow());

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
            <input type="number" step="0.01" name="tickets[${ticketIndex}][prix]" class="form-control" value="${prix}" required>
        </div>
        <div class="col-md-3">
            <label class="form-label">Quantité</label>
            <input type="number" name="tickets[${ticketIndex}][quantite]" class="form-control" value="${quantite}" required>
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

const existingTickets = <?php echo json_encode($typesTickets); ?>;
if (existingTickets && existingTickets.length > 0) {
    existingTickets.forEach(t => addTicketRow(t.nom, t.prix, t.quantite_disponible));
} else {
    addTicketRow();
}
</script>

<?php include 'views/footer.php'; ?>
