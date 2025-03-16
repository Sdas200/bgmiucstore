document.addEventListener('DOMContentLoaded', () => {
    const adminLoginItem = document.getElementById('admin-login');
    const adminLoginDialog = document.getElementById('admin-login-dialog');
    const adminLoginForm = document.getElementById('admin-login-form');
    const loginButton = document.getElementById('admin-login-btn');
    const closeButton = adminLoginDialog.querySelector('.close-dialog');
    const loginError = document.getElementById('login-error');

    if (!adminLoginDialog.showModal) {
        dialogPolyfill.registerDialog(adminLoginDialog);
    }

    adminLoginItem.addEventListener('click', () => {
        adminLoginDialog.showModal();
        adminLoginForm.reset();
        loginError.textContent = '';
    });

    loginButton.addEventListener('click', () => {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        // Admin credentials check
        if ((username === 'admin' && password === 'admin123') || 
            (username === 'emogaming003@gmail.com' && password === 'Emo@0003')) {
            window.location.href = 'admin.html';
        } else {
            loginError.textContent = 'Invalid username or password';
        }
    });

    closeButton.addEventListener('click', () => {
        adminLoginDialog.close();
    });

    // Close dialog if clicked outside
    adminLoginDialog.addEventListener('click', (event) => {
        if (event.target === adminLoginDialog) {
            adminLoginDialog.close();
        }
    });
});
