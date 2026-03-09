<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Ticket - <?php echo $reservation['evenement_titre']; ?></title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #eee; }
        .ticket { background: white; width: 600px; margin: 0 auto; padding: 30px; border-radius: 10px; border-top: 10px solid #4e73df; }
        .header { text-align: center; margin-bottom: 20px; }
        .info { margin-bottom: 30px; }
        .footer { text-align: center; border-top: 1px dashed #ccc; padding-top: 20px; }
        .qr-code { margin: 20px 0; }
        @media print { .btn-print { display: none; } body { background: white; } }
    </style>
</head>
<body>
    <div class="ticket">
        <div class="header">
            <h3>TICKET OFFICIEL</h3>
            <h2><?php echo $reservation['evenement_titre']; ?></h2>
        </div>

        <div class="info">
            <p><strong>Client :</strong> <?php echo $reservation['client_prenom'] . ' ' . $reservation['client_nom']; ?></p>
            <p><strong>Date :</strong> <?php echo date('d/m/Y H:i', strtotime($reservation['date_evenement'])); ?></p>
            <p><strong>Lieu :</strong> <?php echo $reservation['lieu']; ?></p>
            <p><strong>Émis le :</strong> <?php echo date('d/m/Y H:i', strtotime($reservation['date_reservation'])); ?></p>
            <p><strong>Total payé :</strong> <?php echo number_format($reservation['total'], 2); ?> €</p>
        </div>

        <?php foreach ($tickets as $tick): ?>
        <div class="footer">
            <p><strong>Type :</strong> <?php echo $tick['type_nom']; ?></p>
            <p><strong>Code Ticket :</strong> <?php echo $tick['code_unique']; ?></p>
            <div class="qr-code">
                <!-- QR Code via API Google Charts -->
                <img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=<?php echo urlencode($tick['code_unique']); ?>&choe=UTF-8" alt="QR Code">
            </div>
            <p class="small text-muted">Veuillez présenter ce QR Code à l'entrée.</p>
        </div>
        <?php
endforeach; ?>

        <div style="text-align: center;" class="btn-print">
            <button onclick="window.print()" style="padding: 10px 20px; background: #4e73df; color: white; border: none; border-radius: 5px; cursor: pointer;">Imprimer mon ticket</button>
            <p><a href="index.php?action=mes_reservations">Retour à mes réservations</a></p>
        </div>
    </div>
</body>
</html>
