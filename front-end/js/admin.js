$(document).ready(function() {
    // Fonction pour échapper les entrées utilisateur
    function escapeHtml(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // Fonction pour charger les prédictions sur la page admin
    function loadPredictions() {
        $.ajax({
            url: 'http://localhost:3000/api/predictions',
            type: 'GET',
            success: function(predictions) {
                let predictionsHtml = '';
                predictions.forEach(prediction => {
                    predictionsHtml += `
                        <div class="col-md-4 mb-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">${escapeHtml(prediction.team1)} vs ${escapeHtml(prediction.team2)}</h5>
                                    <p class="card-text"><strong>Prediction:</strong> ${escapeHtml(prediction.prediction)}</p>
                                    <p class="card-text"><strong>Date:</strong> ${formatDate(prediction.date, prediction.time)}</p>
                                    <p class="card-text"><strong>Stage:</strong> ${escapeHtml(prediction.stage)}</p>
                                </div>
                            </div>
                        </div>
                    `;
                });
                $('#predictions').html(predictionsHtml);
            },
            error: function(error) {
                console.error('Erreur lors du chargement des prédictions:', error);
            }
        });
    }

    // Fonction pour réinitialiser le formulaire
    function resetForm() {
        form = document.getElementById('predictionForm');
        form.reset();
    }

    // Soumission du formulaire de prédiction
    $('#predictionForm').on('submit', function(event) {
        const team1 = $('#team1').val();
        const team2 = $('#team2').val();
        const prediction = $('#prediction').val();
        const date = $('#date').val();
        const time = $('#time').val();
        const stage = $('#stage').val();

        const newPrediction = {
            id: Date.now(),
            team1,
            team2,
            prediction,
            date,
            time,
            stage
        };

        $.ajax({
            url: 'http://localhost:3000/api/predictions',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newPrediction),
            success: function(data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Ajout de prédiction réussi',
                });
                resetForm();
                loadPredictions();
            },
            error: function(error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Une erreur est survenue pendant l\'ajout de prédiction',
                });
                console.error('Erreur:', error);
            }
        });
    });

    loadPredictions();

    // Fonction pour formater la date
    function formatDate(dateString, timeString) {
        const date = new Date(`${dateString}T${timeString}`);
        const formattedDate = new Intl.DateTimeFormat('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
        const formattedTime = new Intl.DateTimeFormat('fr-FR', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        }).format(date);
        return `${formattedDate} à ${formattedTime}`;
    }
});