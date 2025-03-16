document.addEventListener('DOMContentLoaded', () => {
    const registerBtn = document.getElementById('registerBtn');
    const usernameInput = document.getElementById('username');
    const bgmiIdInput = document.getElementById('bgmiId');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Check if user is already logged in
    if (localStorage.getItem('userLoggedIn')) {
        window.location.href = 'index.html';
    }

    registerBtn.addEventListener('click', () => {
        // Validate inputs
        if (!validateInputs()) {
            return;
        }

        const username = usernameInput.value;
        const bgmiId = bgmiIdInput.value;
        const phone = phoneInput.value;
        const password = passwordInput.value;

        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if username or phone already exists
        if (users.some(u => u.username === username)) {
            showSnackbar('Username already exists');
            return;
        }
        if (users.some(u => u.phone === phone)) {
            showSnackbar('Phone number already registered');
            return;
        }
        if (users.some(u => u.bgmiId === bgmiId)) {
            showSnackbar('BGMI ID already registered');
            return;
        }

        // Create new user
        const newUser = {
            username,
            bgmiId,
            phone,
            password,
            registeredAt: new Date().toISOString(),
            orders: []
        };

        // Add user to storage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Show success message
        showSnackbar('Registration successful! Redirecting to login...');

        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });

    function validateInputs() {
        // Username validation (3-20 characters, letters, numbers, underscore)
        if (!/^[A-Za-z0-9_]{3,20}$/.test(usernameInput.value)) {
            showSnackbar('Invalid username format');
            return false;
        }

        // BGMI ID validation (10-12 digits)
        if (!/^[0-9]{10,12}$/.test(bgmiIdInput.value)) {
            showSnackbar('Invalid BGMI ID format');
            return false;
        }

        // Phone validation (10 digits)
        if (!/^[0-9]{10}$/.test(phoneInput.value)) {
            showSnackbar('Invalid phone number format');
            return false;
        }

        // Password validation (minimum 6 characters)
        if (passwordInput.value.length < 6) {
            showSnackbar('Password must be at least 6 characters');
            return false;
        }

        // Confirm password
        if (passwordInput.value !== confirmPasswordInput.value) {
            showSnackbar('Passwords do not match');
            return false;
        }

        return true;
    }
});

// Show snackbar message
function showSnackbar(message) {
    const snackbar = document.querySelector('.mdl-js-snackbar');
    snackbar.MaterialSnackbar.showSnackbar({
        message: message,
        timeout: 2000
    });
}
