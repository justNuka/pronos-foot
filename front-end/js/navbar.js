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

    if (loginLink && logoutLink && adminPageButton) {
        if (sessionStorage.getItem('loggedIn') === 'true') {
            loginLink.style.display = 'none';
            logoutLink.style.display = 'block';
            
            if (sessionStorage.getItem('role') === 'admin') {
                adminPageButton.style.display = 'block';
            }

            logoutLink.addEventListener('click', function() {
                sessionStorage.clear();
                window.location.href = 'login.html';
            });
        } else {
            loginLink.style.display = 'block';
            logoutLink.style.display = 'none';
            adminPageButton.style.display = 'none';
        }
    }
}