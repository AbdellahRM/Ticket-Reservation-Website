<?php include 'views/header.php'; ?>

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card p-4">
                <h2 class="fw-bold mb-4 text-center">Scan de Tickets</h2>
                
                <?php if (isset($message)): ?>
                    <div class="alert alert-<?php echo $type; ?>"><?php echo $message; ?></div>
                <?php
endif; ?>

                <p class="text-muted text-center mb-4">Utilisez l'ID du ticket pour vérifier sa validité (simulation de scan).</p>

                <form action="index.php?action=scanner_ticket" method="POST">
                    <div class="mb-3">
                        <label class="form-label">Code du ticket (ID unique)</label>
                        <input type="text" name="code_unique" class="form-control form-control-lg" placeholder="TICK-XXXXXXXX" required autofocus>
                    </div>
                    <button type="submit" class="btn btn-primary btn-lg w-100 py-3">Vérifier / Scanner</button>
                </form>
                
                <div class="mt-4 border-top pt-3 text-center">
                    <p class="small text-muted"><i class="bi bi-camera"></i> Dans une application réelle, ceci utiliserait la caméra du smartphone.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include 'views/footer.php'; ?>
