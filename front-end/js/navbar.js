document.addEventListener("DOMContentLoaded", function() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
            setupNavbar();
        });
});

function setupNavbar() {
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const adminPageButton = document.getElementById('adminPageButton');

    fetch('http://localhost:3000/api/auth/check', {
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
        if (data.loggedIn) {
            loginLink.style.display = 'none';
            logoutLink.style.display = 'block';
            
            if (data.role === 'admin') {
                adminPageButton.style.display = 'block';
            }

            logoutLink.addEventListener('click', function() {
                fetch('http://localhost:3000/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include' // Inclure les cookies dans la requête
                })
                .then(response => {
                    if (response.ok) {
                        window.location.href = 'login.html';
                    }
                });
            });
        } else {
            loginLink.style.display = 'block';
            logoutLink.style.display = 'none';
            adminPageButton.style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}