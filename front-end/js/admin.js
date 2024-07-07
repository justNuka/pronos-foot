$(document).ready(function() {
    // Fonction pour charger les prédictions sur la page admin
    function loadPredictions() {
        $.ajax({
            url: 'http://localhost:3000/api/predictions',
            type: 'GET',
            success: function(predictions) {
                let predictionsHtml = '';
                predictions.forEach(prediction => {
                    predictionsHtml += `
                        <div class="prediction">
                            <p>Team 1: ${prediction.team1}</p>
                            <p>Team 2: ${prediction.team2}</p>
                            <p>Prediction: ${prediction.prediction}</p>
                            <p>Date: ${formatDate(prediction.date, prediction.time)}</p>
                            <p>Stage: ${prediction.stage}</p>
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
});

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