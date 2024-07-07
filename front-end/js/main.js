// Fonction pour formater les dates
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

// Fonction pour exécuter les scripts injectés (les scripts sont sinon bloqués sur la page index.html par le navigateur, pas le cas sur admin.html)
function executeScripts(element) {
    const scripts = element.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        eval(scripts[i].innerText); // Note: 'eval' est utilisé ici uniquement pour démontrer une vulnérabilité XSS. Ne jamais utiliser 'eval' dans du code sécurisé.
    }
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
                const formattedDateTime = formatDate(prediction.date, prediction.time);

                // Inner HTML vulnérable à XSS
                div.innerHTML = `
                    <div class="prediction">
                        <p>Team 1: ${prediction.team1}</p>
                        <p>Team 2: ${prediction.team2}</p>
                        <p>Prediction: ${prediction.prediction}</p>
                        <p>Date: ${formattedDateTime}</p>
                        <p>Stage: ${prediction.stage}</p>
                    </div>
                `;
                predictionsDiv.appendChild(div);
                executeScripts(div); // Exécute les scripts injectés -- vulnérabilité XSS à ne pas mettre en prod
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
        const userId = sessionStorage.getItem('userId');
        if (userId) {
            fetch(`http://localhost:3000/api/auth/profile/${userId}`)
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
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Utilisateur non connecté',
            });
            console.error('Erreur: Utilisateur non connecté');
        }
    }
};

// Admin Page Access
const adminPageButton = document.getElementById('adminPageButton');
if (adminPageButton) {
    adminPageButton.addEventListener('click', function() {
        window.location.href = 'admin.html';
    });
}