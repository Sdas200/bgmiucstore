// Admin credentials (from memory)
const ADMIN_EMAIL = 'emogaming003@gmail.com';
const ADMIN_PASSWORD = 'Emo003';

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Check if user is already logged in
    if (localStorage.getItem('userLoggedIn')) {
        window.location.href = 'index.html';
    }
    if (localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'admin.html';
    }

    // Add test user for demonstration
    const testUser = {
        username: "testuser",
        phone: "9876543210",
        bgmiId: "1234567890",
        password: "test123",
        registeredAt: new Date().toISOString(),
        orders: []
    };

    // Store test user in localStorage if no users exist
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([testUser]));
    }

    // Regular user login
    loginBtn.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        // Get stored users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => (u.username === username || u.phone === username) && u.password === password);

        if (user) {
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'index.html';
        } else {
            showSnackbar('Invalid username or password');
        }
    });

    // Admin login
    adminLoginBtn.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'admin.html';
        } else {
            showSnackbar('Invalid admin credentials');
        }
    });

    // Handle Enter key
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });
});

// Show snackbar message
function showSnackbar(message) {
    const snackbar = document.querySelector('.mdl-js-snackbar');
    snackbar.MaterialSnackbar.showSnackbar({
        message: message,
        timeout: 2000
    });
}
