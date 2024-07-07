// Fonction pour formater les dates
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString, timeString) {
    const date = new Date(`${dateString}T${timeString}`);

    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);

    const dateParts = formattedDate.split(' ');
    dateParts[1] = capitalizeFirstLetter(dateParts[1]);

    const capitalizedDate = dateParts.join(' ');

    const formattedTime = new Intl.DateTimeFormat('fr-FR', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    }).format(date);

    return `${capitalizedDate} à ${formattedTime}`;
}

// Charge les prédictions depuis l'API et les affiche sur la page d'accueil
function loadPredictions() {
    fetch('http://localhost:3000/api/predictions')
        .then(response => response.json())
        .then(predictions => {
            const predictionsDiv = document.getElementById('predictions');
            predictionsDiv.innerHTML = '';
            predictions.forEach(prediction => {
                const div = document.createElement('div');
                div.className = 'col-md-4 mb-4';
                const formattedDateTime = formatDate(prediction.date, prediction.time);

                div.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${escapeHtml(prediction.team1)} vs ${escapeHtml(prediction.team2)}</h5>
                            <p class="card-text"><strong>Prediction:</strong> ${escapeHtml(prediction.prediction)}</p>
                            <p class="card-text"><strong>Date:</strong> ${formattedDateTime}</p>
                            <p class="card-text"><strong>Stage:</strong> ${escapeHtml(prediction.stage)}</p>
                        </div>
                    </div>
                `;
                predictionsDiv.appendChild(div);
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Une erreur est survenue lors de la récupération des prédictions. Veuillez réessayer plus tard.',
            });
            console.error('Erreur lors du fetch : ', error);
        });
}

window.onload = function() {
    const path = window.location.pathname;
    if (path.endsWith('index.html')) {
        loadPredictions();
    }
    if (path.endsWith('profile.html')) {
        fetch('http://localhost:3000/api/auth/profile', {
            method: 'GET',
            credentials: 'include' // Inclure les cookies dans la requête
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('email').textContent = data.email;
            document.getElementById('role').textContent = data.role;
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur est survenue lors de la récupération du profil',
            });
            console.error('Erreur lors de la récupération du profil:', error);
        });
    }
};

// Admin Page Access
const adminPageButton = document.getElementById('adminPageButton');
if (adminPageButton) {
    adminPageButton.addEventListener('click', function() {
        window.location.href = 'admin.html';
    });
}