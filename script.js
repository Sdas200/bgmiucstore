// Initialize state with UC pack data
const state = {
    packs: [
        { id: 1, amount: 1060, bonus: 0, price: 279 },
        { id: 2, amount: 2000, bonus: 25, price: 399 },
        { id: 3, amount: 3600, bonus: 60, price: 799, popular: true },
        { id: 4, amount: 6500, bonus: 300, price: 1999 },
        { id: 5, amount: 10000, bonus: 850, price: 3999 },
        { id: 6, amount: 18000, bonus: 2000, price: 5999 }
    ],
    selectedPack: null,
    orderForm: {
        playerName: '',
        bgmiId: '',
        whatsappNumber: ''
    },
    isProcessing: false
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initializePackButtons();
    initializePaymentHandlers();
    initializeFormHandlers();
    initializeLastOrder();
    componentHandler.upgradeDom(); // Re-initialize MDL components
});

// Initialize pack buttons
function initializePackButtons() {
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', () => {
            const packId = parseInt(button.getAttribute('data-pack-id'));
            const selectedPack = state.packs.find(p => p.id === packId);
            if (selectedPack) {
                state.selectedPack = selectedPack;
                saveOrderFormData();
                showPaymentSection(selectedPack);
            }
        });
    });
}

// Save order form data
function saveOrderFormData() {
    const playerName = document.getElementById('player-name');
    const bgmiId = document.getElementById('bgmi-id');
    const whatsapp = document.getElementById('whatsapp');

    if (playerName) state.orderForm.playerName = playerName.value;
    if (bgmiId) state.orderForm.bgmiId = bgmiId.value;
    if (whatsapp) state.orderForm.whatsappNumber = whatsapp.value;
}

// Restore order form data
function restoreOrderFormData() {
    const playerName = document.getElementById('player-name');
    const bgmiId = document.getElementById('bgmi-id');
    const whatsapp = document.getElementById('whatsapp');

    if (playerName) playerName.value = state.orderForm.playerName;
    if (bgmiId) bgmiId.value = state.orderForm.bgmiId;
    if (whatsapp) whatsapp.value = state.orderForm.whatsappNumber;

    // Re-initialize MDL text fields
    document.querySelectorAll('.mdl-textfield').forEach(field => {
        componentHandler.upgradeElement(field);
        if (field.querySelector('.mdl-textfield__input').value) {
            field.classList.add('is-dirty');
        }
    });
}

// Format currency in Indian Rupees
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Show notification
function showSnackbar(message) {
    const snackbar = document.querySelector('.mdl-js-snackbar');
    if (snackbar) {
        snackbar.MaterialSnackbar.showSnackbar({
            message: message,
            timeout: 3000
        });
    }
}

// Initialize payment handlers
function initializePaymentHandlers() {
    // Copy UPI ID handler
    const copyUpiBtn = document.getElementById('copy-upi');
    const upiId = document.getElementById('upi-id');
    
    if (copyUpiBtn && upiId) {
        copyUpiBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(upiId.textContent.trim())
                .then(() => showSnackbar('UPI ID copied to clipboard'))
                .catch(() => showSnackbar('Failed to copy UPI ID'));
        });
    }

    // Back button handler
    const backBtn = document.getElementById('back-to-form');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            document.getElementById('payment-section').style.display = 'none';
            document.getElementById('order-form').style.display = 'block';
            restoreOrderFormData();
        });
    }

    // Submit order handler
    const submitOrderBtn = document.getElementById('submit-order');
    if (submitOrderBtn) {
        submitOrderBtn.addEventListener('click', handleOrderSubmit);
    }
}

// Initialize form handlers
function initializeFormHandlers() {
    const form = document.getElementById('player-details-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm()) {
                saveOrderFormData();
                if (state.selectedPack) {
                    showPaymentSection(state.selectedPack);
                }
            }
        });
    }
}

// Validate form
function validateForm() {
    const playerName = document.getElementById('player-name');
    const bgmiId = document.getElementById('bgmi-id');
    const whatsapp = document.getElementById('whatsapp');

    if (!playerName || !playerName.value.trim()) {
        showSnackbar('Please enter your player name');
        return false;
    }

    if (!bgmiId || !bgmiId.value.trim() || !/^\d+$/.test(bgmiId.value)) {
        showSnackbar('Please enter a valid BGMI ID (numbers only)');
        return false;
    }

    if (!whatsapp || !whatsapp.value.trim() || !/^\d{10}$/.test(whatsapp.value)) {
        showSnackbar('Please enter a valid 10-digit WhatsApp number');
        return false;
    }

    return true;
}

// Show payment section
function showPaymentSection(pack) {
    if (!validateForm()) {
        return;
    }

    const orderForm = document.getElementById('order-form');
    const paymentSection = document.getElementById('payment-section');
    const paymentAmount = document.getElementById('payment-amount');
    const selectedUcAmount = document.getElementById('selected-uc-amount');
    const selectedBonusUc = document.getElementById('selected-bonus-uc');
    
    if (!orderForm || !paymentSection || !paymentAmount) return;

    // Update selected pack info
    if (selectedUcAmount) {
        selectedUcAmount.textContent = `${pack.amount} UC`;
    }
    if (selectedBonusUc && pack.bonus > 0) {
        selectedBonusUc.textContent = `+${pack.bonus} Bonus UC`;
    }

    // Update payment amount
    paymentAmount.textContent = formatCurrency(pack.price);

    // Show payment section
    orderForm.style.display = 'none';
    paymentSection.style.display = 'block';

    // Reset transaction ID field
    const transactionIdField = document.getElementById('upi-transaction-id');
    if (transactionIdField) {
        transactionIdField.value = '';
        transactionIdField.parentElement.classList.remove('is-dirty');
    }

    // Scroll to payment section
    paymentSection.scrollIntoView({ behavior: 'smooth' });
}

// Show loading state
function showLoading(button) {
    if (!button) return;
    button.disabled = true;
    const originalText = button.textContent;
    button.setAttribute('data-original-text', originalText);
    button.innerHTML = '<div class="mdl-spinner mdl-js-spinner is-active"></div>';
    componentHandler.upgradeElement(button.querySelector('.mdl-spinner'));
}

// Hide loading state
function hideLoading(button) {
    if (!button) return;
    button.disabled = false;
    const originalText = button.getAttribute('data-original-text');
    if (originalText) {
        button.textContent = originalText;
    }
}

// Handle order submit
async function handleOrderSubmit() {
    const submitButton = document.getElementById('submit-order');
    const upiTransactionId = document.getElementById('upi-transaction-id');
    
    if (!state.selectedPack) {
        showSnackbar('Please select a UC pack first');
        return;
    }
    
    if (!upiTransactionId || !upiTransactionId.value.trim()) {
        showSnackbar('Please enter UPI Transaction ID');
        return;
    }

    if (state.isProcessing) {
        showSnackbar('Order is being processed, please wait...');
        return;
    }

    try {
        state.isProcessing = true;
        showLoading(submitButton);
        await submitOrder(upiTransactionId.value.trim());
    } catch (error) {
        console.error('Error processing order:', error);
        showSnackbar('Failed to process order. Please try again.');
    } finally {
        state.isProcessing = false;
        hideLoading(submitButton);
    }
}

// Submit order
async function submitOrder(transactionId) {
    const order = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        playerName: state.orderForm.playerName,
        bgmiId: state.orderForm.bgmiId,
        whatsappNumber: state.orderForm.whatsappNumber,
        pack: {
            amount: state.selectedPack.amount,
            bonus: state.selectedPack.bonus,
            price: state.selectedPack.price
        },
        upiTransactionId: transactionId,
        status: 'pending'
    };

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Show success message with order details
        const message = `Order placed successfully!\nOrder ID: ${order.id}\nAmount: ${formatCurrency(order.pack.price)}\nWe will process it shortly.`;
        showSnackbar(message);

        // Reset state and form
        state.selectedPack = null;
        state.orderForm = {
            playerName: '',
            bgmiId: '',
            whatsappNumber: ''
        };

        // Reset form fields
        document.getElementById('player-details-form').reset();
        document.getElementById('upi-transaction-id').value = '';

        // Reset MDL text fields
        document.querySelectorAll('.mdl-textfield').forEach(field => {
            field.classList.remove('is-dirty');
            field.MaterialTextfield.boundUpdateClassesHandler();
        });

        // Hide payment section and show order form
        document.getElementById('payment-section').style.display = 'none';
        document.getElementById('order-form').style.display = 'block';

        // Save order ID to session storage for reference
        sessionStorage.setItem('lastOrderId', order.id);

    } catch (error) {
        console.error('Error saving order:', error);
        throw new Error('Failed to save order');
    }
}

// Initialize last order
function initializeLastOrder() {
    const lastOrderId = sessionStorage.getItem('lastOrderId');
    if (lastOrderId) {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const lastOrder = orders.find(order => order.id === lastOrderId);
            if (lastOrder) {
                showLastOrderStatus(lastOrder);
            }
        } catch (error) {
            console.error('Error loading last order:', error);
        }
    }
}

// Show last order status
function showLastOrderStatus(order) {
    const statusMessage = `Last Order Status:\nOrder ID: ${order.id}\nAmount: ${formatCurrency(order.pack.price)}\nStatus: ${order.status}`;
    showSnackbar(statusMessage);
}

// Initialize login system
function initializeLoginSystem() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            document.getElementById('login-dialog').showModal();
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            document.getElementById('register-dialog').showModal();
        });
    }
}

// Initialize QR Scanner
function initializeQRScanner() {
    const video = document.getElementById('qr-scanner');
    const toggleButton = document.getElementById('toggle-scanner');
    const scanResult = document.getElementById('scan-result');
    const scanContent = document.getElementById('scan-content');
    let scanner = null;

    toggleButton.addEventListener('click', () => {
        if (video.style.display === 'none') {
            // Start scanning
            scanner = new Instascan.Scanner({
                video: video,
                mirror: false // Don't mirror the video feed
            });

            scanner.addListener('scan', content => {
                console.log('Scanned content:', content);
                scanContent.textContent = content;
                scanResult.style.display = 'block';
                
                // Stop scanning after successful scan
                scanner.stop();
                video.style.display = 'none';
                toggleButton.innerHTML = '<i class="material-icons">qr_code_scanner</i> Scan Payment Screenshot';
            });

            Instascan.Camera.getCameras()
                .then(cameras => {
                    if (cameras.length > 0) {
                        // Prefer back camera on mobile devices
                        const backCamera = cameras.find(camera => camera.name.toLowerCase().includes('back'));
                        scanner.start(backCamera || cameras[0]);
                        video.style.display = 'block';
                        toggleButton.innerHTML = '<i class="material-icons">close</i> Stop Scanning';
                    } else {
                        console.error('No cameras found.');
                        alert('No cameras found on your device.');
                    }
                })
                .catch(err => {
                    console.error('Error accessing camera:', err);
                    alert('Error accessing camera. Please make sure you have granted camera permissions.');
                });
        } else {
            // Stop scanning
            if (scanner) {
                scanner.stop();
            }
            video.style.display = 'none';
            toggleButton.innerHTML = '<i class="material-icons">qr_code_scanner</i> Scan Payment Screenshot';
        }
    });
}

// Initialize UPI Copy functionality
function initializeUPICopy() {
    const copyButton = document.getElementById('copy-upi');
    const snackbar = document.querySelector('.mdl-js-snackbar');
    
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText('ravan.op@freecharge')
            .then(() => {
                snackbar.MaterialSnackbar.showSnackbar({
                    message: 'UPI ID copied to clipboard!',
                    timeout: 2000
                });
            })
            .catch(err => {
                console.error('Failed to copy UPI ID:', err);
                snackbar.MaterialSnackbar.showSnackbar({
                    message: 'Failed to copy UPI ID. Please try again.',
                    timeout: 2000
                });
            });
    });
}

// Initialize Order Form
function initializeOrderForm() {
    const form = document.getElementById('order-form');
    const dialog = document.getElementById('order-confirmation');
    const closeButton = dialog.querySelector('.close');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const orderData = {
            playerName: document.getElementById('player-name').value,
            whatsappNumber: document.getElementById('whatsapp-number').value,
            bgmiId: document.getElementById('bgmi-id').value,
            packName: document.getElementById('selected-pack-name').textContent,
            packAmount: document.getElementById('selected-pack-amount').textContent,
            packPrice: document.getElementById('selected-pack-price').textContent,
            timestamp: new Date().toLocaleString()
        };
        
        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Show order details in confirmation dialog
        const orderDetails = document.getElementById('order-details');
        orderDetails.innerHTML = `
            <p><strong>Name:</strong> ${orderData.playerName}</p>
            <p><strong>WhatsApp:</strong> ${orderData.whatsappNumber}</p>
            <p><strong>BGMI ID:</strong> ${orderData.bgmiId}</p>
            <p><strong>Pack:</strong> ${orderData.packName}</p>
            <p><strong>Amount:</strong> ₹${orderData.packPrice}</p>
        `;
        
        // Show dialog
        dialog.showModal();
    });
    
    closeButton.addEventListener('click', () => {
        dialog.close();
        // Reset form and go back to UC packs
        form.reset();
        document.querySelector('.payment-section').style.display = 'none';
        document.querySelector('.uc-packs').style.display = 'block';
    });
}

// Handle order submission
const submitOrderBtn = document.getElementById('submit-order');
const upiTransactionId = document.getElementById('upi-transaction-id');

if (submitOrderBtn && upiTransactionId) {
    submitOrderBtn.addEventListener('click', () => {
        if (!upiTransactionId.value) {
            showSnackbar('Please enter UPI Transaction ID');
            return;
        }
        
        // Create order object
        const order = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            user: state.user ? state.user.name : document.getElementById('player-name').value,
            bgmiId: state.user ? state.user.bgmiId : document.getElementById('bgmi-id').value,
            whatsappNumber: state.user ? state.user.whatsappNumber : document.getElementById('whatsapp').value,
            packAmount: state.selectedPack.amount + (state.selectedPack.bonus || 0),
            packPrice: state.selectedPack.price,
            upiTransactionId: upiTransactionId.value,
            status: 'pending'
        };
        
        // Save order
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Show success message
        showSnackbar('Order placed successfully! We will process it shortly.');
        
        // Reset form
        upiTransactionId.value = '';
        state.selectedPack = null;
        
        // Redirect to home
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    });
}
