// Login Functionality
document.getElementById('loginButton').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        // console.log('Response data:', data); // Debugging log
        if (data.message === 'Login successful') {
            sessionStorage.setItem('role', data.role);
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('loggedIn', true);
            sessionStorage.setItem('userId', data.id);
            window.location.href = 'index.html';
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Connexion échouée',
                text: 'Username ou password incorrect',
            });
            // console.error('Connexion échouée:', data.message);
        }
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error.message || 'Une erreur est survenue pendant la connexion',
        });
        // console.error('Erreur:', error);
    });
});