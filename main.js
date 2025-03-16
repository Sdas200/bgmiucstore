// Store state
let selectedPack = null;

// Payment settings from admin panel
let paymentSettings = {
    upiId: 'ravan.op@freecharge',
    instructions: `1. Choose your preferred UPI app (PhonePe, Google Pay, Paytm, etc.)
2. Scan the QR code above or use UPI ID: ravan.op@freecharge
3. Enter the exact amount shown for your selected pack
4. Add your BGMI ID in UPI payment description/remarks
5. Complete the payment
6. Contact us on Telegram with:
   • Screenshot of payment
   • Your BGMI ID
   • Selected UC pack
7. Your UC will be credited within 5-10 minutes`,
    supportMessage: 'For instant support and quick UC activation, contact us on Telegram',
    telegramLink: 'https://t.me/+uM6DXbWPPxYxMjY1'
};

// UC Pack configurations
const defaultUcPacks = [
    {
        id: 1,
        ucAmount: 1060,
        bonusUc: 0,
        price: 279,
        popular: false
    },
    {
        id: 2,
        ucAmount: 2000,
        bonusUc: 25,
        price: 399,
        popular: true
    },
    {
        id: 3,
        ucAmount: 3600,
        bonusUc: 60,
        price: 799,
        popular: false
    },
    {
        id: 4,
        ucAmount: 6500,
        bonusUc: 300,
        price: 1999,
        popular: true
    },
    {
        id: 5,
        ucAmount: 10000,
        bonusUc: 850,
        price: 3999,
        popular: false
    },
    {
        id: 6,
        ucAmount: 18000,
        bonusUc: 2000,
        price: 5999,
        popular: false
    }
];

// Load UC packs
function loadUcPacks() {
    const savedPacks = localStorage.getItem('ucPacks');
    return savedPacks ? JSON.parse(savedPacks) : defaultUcPacks;
}

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
    const packsContainer = document.getElementById('packs-container');
    const ucPacks = loadUcPacks();
    
    // Clear existing packs
    packsContainer.innerHTML = '';
    
    // Create UC pack cards
    ucPacks.forEach(pack => {
        const card = document.createElement('div');
        card.className = 'mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet';
        
        card.innerHTML = `
            <div class="uc-pack-card mdl-card mdl-shadow--2dp">
                <div class="mdl-card__title">
                    <h2 class="mdl-card__title-text">
                        <span class="uc-amount">${pack.ucAmount} UC</span>
                        ${pack.bonusUc ? `<span class="bonus-uc">+ ${pack.bonusUc} Bonus</span>` : ''}
                    </h2>
                </div>
                <div class="mdl-card__supporting-text">
                    <div class="pack-price">₹${pack.price}</div>
                </div>
                <div class="mdl-card__actions mdl-card--border">
                    <button class="buy-now-btn mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">
                        <i class="material-icons">shopping_cart</i>
                        Buy Now
                    </button>
                </div>
            </div>
        `;
        
        // Add buy button click handler
        const buyBtn = card.querySelector('.buy-now-btn');
        buyBtn.onclick = () => showUserDetailsDialog(pack.id);
        
        packsContainer.appendChild(card);
    });
    
    // Initialize Material Design Lite
    componentHandler.upgradeDom();

    // Add event listener for localStorage changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'ucPacks') {
            // Reload the page to show updated packs
            window.location.reload();
        }
    });

    // Get all buy buttons
    const buyButtons = document.querySelectorAll('.buy-button');
    
    // Add click event to each button
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const packId = parseInt(button.dataset.packId);
            showUserDetailsDialog(packId);
        });
    });

    // Initialize dialogs
    initializeUserDetailsDialog();
    initializePaymentDialog();

    // Show orders button
    const showOrdersBtn = document.getElementById('show-orders');
    const orderHistoryDialog = document.getElementById('order-history-dialog');

    showOrdersBtn.addEventListener('click', () => {
        // Load orders
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const tbody = document.getElementById('user-orders-table-body');
        const noOrdersMsg = document.getElementById('no-orders-message');

        if (orders.length > 0) {
            tbody.innerHTML = '';
            orders.forEach(order => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="mdl-data-table__cell--non-numeric">${new Date(order.date).toLocaleDateString()}</td>
                    <td class="mdl-data-table__cell--non-numeric">${order.pack.ucAmount} UC${order.pack.bonusUc ? ` + ${order.pack.bonusUc} Bonus UC` : ''}</td>
                    <td class="mdl-data-table__cell--non-numeric">₹${order.pack.price}</td>
                    <td class="mdl-data-table__cell--non-numeric">
                        <span class="status-badge status-${order.status}">${order.status}</span>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            tbody.closest('.orders-list').style.display = 'block';
            noOrdersMsg.style.display = 'none';
        } else {
            tbody.closest('.orders-list').style.display = 'none';
            noOrdersMsg.style.display = 'block';
        }

        orderHistoryDialog.showModal();
    });

    // Handle close
    const closeBtn = orderHistoryDialog.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        orderHistoryDialog.close();
    });
});

// Show user details dialog
function showUserDetailsDialog(packId) {
    const dialog = document.getElementById('user-details-dialog');
    const ucPacks = loadUcPacks();
    selectedPack = ucPacks.find(pack => pack.id === packId);
    
    if (selectedPack) {
        // Update pack details in dialog
        document.getElementById('details-uc-amount').textContent = selectedPack.ucAmount;
        document.getElementById('details-bonus-uc').textContent = selectedPack.bonusUc;
        document.getElementById('details-price').textContent = selectedPack.price;
        
        // Show/hide bonus UC based on amount
        const bonusContainer = document.getElementById('details-bonus-uc-container');
        bonusContainer.style.display = selectedPack.bonusUc > 0 ? 'block' : 'none';
    }

    // Reset form
    const form = document.getElementById('user-details-form');
    form.reset();

    // Show dialog
    dialog.showModal();

    // Handle form submission
    const proceedBtn = dialog.querySelector('.proceed-payment');
    proceedBtn.onclick = function(e) {
        e.preventDefault();
        
        // Get user details
        const playerName = document.getElementById('player-name').value.trim();
        const bgmiId = document.getElementById('bgmi-id').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        
        // Validate
        if (!playerName || !bgmiId || !whatsapp) {
            showSnackbar('Please fill in all fields');
            return;
        }
        
        // Validate BGMI ID format (numeric, 8-10 digits)
        if (!/^\d{8,10}$/.test(bgmiId)) {
            showSnackbar('Please enter a valid BGMI ID (8-10 digits)');
            return;
        }
        
        // Validate WhatsApp number (10 digits)
        if (!/^\d{10}$/.test(whatsapp)) {
            showSnackbar('Please enter a valid 10-digit WhatsApp number');
            return;
        }
        
        // Close dialog
        dialog.close();
        
        // Show payment dialog
        const userDetails = {
            playerName,
            bgmiId,
            whatsapp
        };
        
        showPaymentDialog(selectedPack.id, userDetails);
    };
}

// Initialize user details dialog
function initializeUserDetailsDialog() {
    const dialog = document.getElementById('user-details-dialog');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }

    // Load saved user details
    const savedDetails = localStorage.getItem('userDetails');
    if (savedDetails) {
        const details = JSON.parse(savedDetails);
        document.getElementById('player-name').value = details.playerName || '';
        document.getElementById('bgmi-id').value = details.bgmiId || '';
        document.getElementById('whatsapp').value = details.whatsapp || '';
    }
}

// Show payment dialog
function showPaymentDialog(packId, userDetails) {
    const dialog = document.getElementById('payment-dialog');
    const ucPacks = loadUcPacks();
    const selectedPack = ucPacks.find(pack => pack.id === packId);
    
    if (selectedPack) {
        // Update payment details
        document.getElementById('payment-uc-amount').textContent = selectedPack.ucAmount;
        document.getElementById('payment-bonus-uc').textContent = selectedPack.bonusUc;
        document.getElementById('payment-price').textContent = selectedPack.price;
        document.getElementById('payment-amount').textContent = selectedPack.price;
        
        // Show/hide bonus UC
        const bonusContainer = document.getElementById('payment-bonus-uc-container');
        bonusContainer.style.display = selectedPack.bonusUc > 0 ? 'block' : 'none';

        // Generate QR code with amount and BGMI ID
        const qrData = `upi://pay?pa=${paymentSettings.upiId}&pn=EMO%20Gaming&am=${selectedPack.price}&cu=INR&tn=BGMI ${userDetails.bgmiId} UC Pack - ${selectedPack.ucAmount} UC&mc=gaming`;
        
        // Update QR code
        document.getElementById('upi-qr').src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;
        
        // Update UPI ID
        document.getElementById('upi-id').textContent = paymentSettings.upiId;
        
        // Store order details
        const order = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            pack: selectedPack,
            userDetails: userDetails,
            status: 'pending'
        };
        
        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Show payment instructions with user's BGMI ID
        const instructions = paymentSettings.instructions.replace('your BGMI ID', `BGMI ID: ${userDetails.bgmiId}`);
        document.getElementById('payment-instructions').innerHTML = instructions;
        
        // Update support message
        if (document.getElementById('support-message')) {
            document.getElementById('support-message').textContent = paymentSettings.supportMessage;
        }
    }

    // Handle close button
    const closeButton = dialog.querySelector('.close-dialog');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            dialog.close();
        });
    }

    // Show dialog
    dialog.showModal();
}

// Initialize payment dialog
function initializePaymentDialog() {
    const dialog = document.getElementById('payment-dialog');
    
    if (!dialog) {
        console.error('Payment dialog not found');
        return;
    }

    // Close dialog
    const closeButton = dialog.querySelector('.close-dialog');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            dialog.close();
        });
    }
}

// Copy UPI ID to clipboard
function copyUpiId() {
    const upiId = paymentSettings.upiId;
    navigator.clipboard.writeText(upiId)
        .then(() => {
            // Show success feedback
            const copyButton = document.querySelector('.upi-details button');
            const icon = copyButton.querySelector('i');
            
            // Change icon to check and add success class
            icon.textContent = 'check';
            copyButton.classList.add('copy-success');
            
            // Show snackbar
            showSnackbar('UPI ID copied: ' + upiId);
            
            // Reset after 2 seconds
            setTimeout(() => {
                icon.textContent = 'content_copy';
                copyButton.classList.remove('copy-success');
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy UPI ID:', err);
            showSnackbar('Failed to copy UPI ID. Please try again.');
        });
}

// Handle UTR submission
function submitUTR() {
    const utrNumber = document.getElementById('utr-number').value.trim();
    
    // Validate UTR number
    if (!utrNumber) {
        showSnackbar('Please enter your UTR number');
        return;
    }
    
    // Basic format validation (alphanumeric, typically 12-22 characters)
    if (!/^[a-zA-Z0-9]{8,22}$/.test(utrNumber)) {
        showSnackbar('Please enter a valid UTR number (8-22 alphanumeric characters)');
        return;
    }
    
    // Get current order from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    if (orders.length === 0) {
        showSnackbar('No active order found');
        return;
    }
    
    // Update the most recent order
    const currentOrder = orders[orders.length - 1];
    currentOrder.utrNumber = utrNumber;
    currentOrder.status = 'submitted';
    currentOrder.submissionTime = new Date().toISOString();
    
    // Save updated orders
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Show success UI
    const utrForm = document.querySelector('.utr-form');
    utrForm.classList.add('submitted');
    
    // Change button text and icon
    const submitButton = document.getElementById('submit-utr');
    submitButton.innerHTML = '<i class="material-icons">done_all</i> UTR Submitted';
    
    // Show success message
    showSnackbar('UTR submitted successfully! Your UC will be credited soon.');
    
    // Show order success dialog
    showOrderSuccess(currentOrder);
}

// Show order success message
function showOrderSuccess(order) {
    // Create or get order confirmation dialog
    let dialog = document.getElementById('order-confirmation');
    
    // If dialog doesn't exist, create it
    if (!dialog) {
        dialog = document.createElement('dialog');
        dialog.id = 'order-confirmation';
        dialog.className = 'mdl-dialog order-confirmation';
        
        dialog.innerHTML = `
            <h4 class="mdl-dialog__title">Order Confirmed!</h4>
            <div class="mdl-dialog__content">
                <div class="success-icon">
                    <i class="material-icons">check_circle</i>
                </div>
                <div class="order-details">
                    <div class="detail-item">
                        <span>Order ID:</span>
                        <span id="success-order-id"></span>
                    </div>
                    <div class="detail-item">
                        <span>BGMI ID:</span>
                        <span id="success-bgmi-id"></span>
                    </div>
                    <div class="detail-item">
                        <span>Amount Paid:</span>
                        <span id="success-amount"></span>
                    </div>
                    <div class="detail-item">
                        <span>UC Package:</span>
                        <span id="success-uc-amount"></span>
                    </div>
                    <div class="detail-item">
                        <span>UTR Number:</span>
                        <span id="success-utr"></span>
                    </div>
                    <div class="detail-item">
                        <span>Status:</span>
                        <span id="success-status" class="status-processing">Processing</span>
                    </div>
                </div>
                <div class="success-message">
                    <p>Your payment has been received and is being verified. Your UC will be credited to your account within 5-10 minutes.</p>
                    <p>For any assistance, please contact us on Telegram.</p>
                    <a href="${paymentSettings.telegramLink}" target="_blank" rel="noopener noreferrer" 
                       class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect telegram-button">
                        <i class="material-icons">support_agent</i>
                        Contact Support
                    </a>
                </div>
            </div>
            <div class="mdl-dialog__actions">
                <button type="button" class="mdl-button close-dialog">Close</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Register dialog polyfill if needed
        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
    }
    
    // Generate order ID if not exists
    const orderId = order.id || 'ORD' + Date.now().toString().slice(-6);
    
    // Set success message details
    document.getElementById('success-order-id').textContent = orderId;
    document.getElementById('success-bgmi-id').textContent = order.userDetails.bgmiId;
    document.getElementById('success-amount').textContent = '₹' + order.pack.price;
    document.getElementById('success-uc-amount').textContent = `${order.pack.ucAmount} UC + ${order.pack.bonusUc} Bonus UC`;
    document.getElementById('success-utr').textContent = order.utrNumber;
    
    // Show dialog
    dialog.showModal();
    
    // Close button
    const closeButton = dialog.querySelector('.close-dialog');
    closeButton.onclick = () => {
        dialog.close();
        
        // Close payment dialog
        const paymentDialog = document.getElementById('payment-dialog');
        if (paymentDialog) {
            paymentDialog.close();
        }
    };
}

// Show snackbar message
function showSnackbar(message) {
    const snackbarContainer = document.querySelector('.mdl-js-snackbar');
    if (snackbarContainer) {
        snackbarContainer.MaterialSnackbar.showSnackbar({
            message: message,
            timeout: 3000
        });
    } else {
        alert(message);
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Initialize payment dialog
    initializePaymentDialog();
    
    // Initialize all MDL components
    componentHandler.upgradeAllRegistered();
    
    // Add event listener for UTR submission
    const submitButton = document.getElementById('submit-utr');
    if (submitButton) {
        submitButton.addEventListener('click', submitUTR);
    }
    
    // Load and display UC packs
    displayUcPacks();
});

// Show orders dialog
function showOrdersDialog() {
    const dialog = document.getElementById('order-history-dialog');
    
    // Load orders
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const tbody = document.getElementById('user-orders-table-body');
    const noOrdersMsg = document.getElementById('no-orders-message');

    if (orders.length > 0) {
        tbody.innerHTML = '';
        orders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="mdl-data-table__cell--non-numeric">${new Date(order.date).toLocaleDateString()}</td>
                <td class="mdl-data-table__cell--non-numeric">${order.pack.ucAmount} UC${order.pack.bonusUc ? ` + ${order.pack.bonusUc} Bonus UC` : ''}</td>
                <td class="mdl-data-table__cell--non-numeric">₹${order.pack.price}</td>
                <td class="mdl-data-table__cell--non-numeric">
                    <span class="status-badge status-${order.status}">${order.status}</span>
                </td>
            `;
            tbody.appendChild(tr);
        });
        tbody.closest('.orders-list').style.display = 'block';
        noOrdersMsg.style.display = 'none';
    } else {
        tbody.closest('.orders-list').style.display = 'none';
        noOrdersMsg.style.display = 'block';
    }

    dialog.showModal();

    // Handle close
    const closeBtn = dialog.querySelector('.close');
    closeBtn.onclick = () => {
        dialog.close();
    };
}
