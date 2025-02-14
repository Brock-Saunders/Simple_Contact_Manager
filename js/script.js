const urlBase = 'https://practestah.ahclass.xyz/';
const extension = 'php';

// Popup functionality
const createUserBtn = document.getElementById('createUserBtn');
const createUserPopup = document.getElementById('createUserPopup');
const closeBtn = document.querySelector('.close-btn');
const createUserForm = document.getElementById('createUserForm');

// Open popup
createUserBtn.addEventListener('click', () => {
    createUserPopup.style.display = 'block';
});

// Close popup
closeBtn.addEventListener('click', () => {
    createUserPopup.style.display = 'none';
});

// Close popup when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === createUserPopup) {
        createUserPopup.style.display = 'none';
    }
});

// Handle create user form submission
createUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    let xhr = new XMLHttpRequest();
    let url = urlBase + 'LAMPAPI/Create.' + extension;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            let response = JSON.parse(xhr.responseText);
            
            if (xhr.status === 200) {
                if (response.error) {
                    alert(response.error);
                } else {
                    alert('User created successfully!');
                    createUserPopup.style.display = 'none';
                    createUserForm.reset();
                }
            } else {
                alert('Error creating user. Please try again.');
                console.error(xhr.statusText);
            }
        }
    };

    let jsonPayload = JSON.stringify({
        username: username,
        password: password
    });

    xhr.send(jsonPayload);
});

// Handle login form submission
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let xhr = new XMLHttpRequest();
    let url = urlBase + 'LAMPAPI/Login.' + extension;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            let response = JSON.parse(xhr.responseText);
            
            if (xhr.status === 200) {
                if (response.error) {
                    alert(response.error);
                } else {
                    alert('Login successful!');
                    // Redirect to another page or perform other actions
                }
            } else {
                alert('Error logging in. Please try again.');
                console.error(xhr.statusText);
            }
        }
    };

    let jsonPayload = JSON.stringify({
        username: username,
        password: password
    });

    xhr.send(jsonPayload);
});