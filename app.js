// Mock user data (replace with actual authentication)
const currentUser = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210'
};

// UC packs data with categories
const ucPacks = [
    { 
        id: 1, 
        name: '1060 UC', 
        amount: 1060, 
        price: 279,
        categories: ['all']
    },
    { 
        id: 2, 
        name: '2000 + 25 UC', 
        amount: 2025, 
        price: 399,
        categories: ['all', 'bonus', 'popular']
    },
    { 
        id: 3, 
        name: '3600 + 60 UC', 
        amount: 3660, 
        price: 799,
        categories: ['all', 'bonus']
    },
    { 
        id: 4, 
        name: '6500 + 300 UC', 
        amount: 6800, 
        price: 1999,
        categories: ['all', 'bonus', 'popular', 'special']
    },
    { 
        id: 5, 
        name: '10000 + 850 UC', 
        amount: 10850, 
        price: 3999,
        categories: ['all', 'bonus', 'special']
    },
    { 
        id: 6, 
        name: '18000 + 2000 UC', 
        amount: 20000, 
        price: 5999,
        categories: ['all', 'bonus', 'special']
    }
];

// Store orders
let orders = [];
let currentFilter = 'all';

// Touch navigation variables
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

// DOM Elements
const dialog = document.querySelector('#purchaseDialog');
const orderForm = document.querySelector('#order-form');
let selectedPack = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initTouchNavigation();
    displayUCPacks();
    displayProfile();
    setupEventListeners();
    displayOrders();
    initializeFilters();
    initializePaymentSection();
});

// Initialize touch navigation
function initTouchNavigation() {
    const content = document.querySelector('.mdl-layout__content');
    
    content.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, false);

    content.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipeGesture();
    }, false);
}

// Handle swipe gestures
function handleSwipeGesture() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const minSwipeDistance = 50;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
            showPreviousPage();
        } else {
            showNextPage();
        }
    }
}

// Show previous/next page functions
function showPreviousPage() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const activeButton = document.querySelector('.filter-btn.active');
    const currentIndex = Array.from(filterButtons).indexOf(activeButton);
    
    if (currentIndex > 0) {
        filterButtons[currentIndex - 1].click();
    }
}

function showNextPage() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const activeButton = document.querySelector('.filter-btn.active');
    const currentIndex = Array.from(filterButtons).indexOf(activeButton);
    
    if (currentIndex < filterButtons.length - 1) {
        filterButtons[currentIndex + 1].click();
    }
}

// Display UC packs in the grid
function displayUCPacks(filter = 'all') {
    const grid = document.querySelector('.uc-packs-grid');
    grid.innerHTML = '';

    const filteredPacks = ucPacks.filter(pack => pack.categories.includes(filter));
    
    filteredPacks.forEach((pack, index) => {
        const card = document.createElement('div');
        card.className = 'uc-pack-card mdl-card mdl-shadow--2dp';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const bonusAmount = pack.amount - parseInt(pack.name.split(' ')[0]);
        const bonusText = bonusAmount > 0 ? `<div class="bonus-tag">+${bonusAmount} Bonus UC</div>` : '';
        
        card.innerHTML = `
            ${bonusText}
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text">${pack.name}</h2>
            </div>
            <div class="mdl-card__supporting-text">
                <div class="uc-details">
                    <img src="https://cdn.battlegrounds.com.br/wp-content/uploads/2023/07/uc-icon.png" alt="UC" class="uc-icon-small">
                    <span class="uc-amount">${pack.amount.toLocaleString()}</span>
                </div>
                <div class="price-tag">₹${pack.price.toLocaleString()}</div>
            </div>
            <div class="mdl-card__actions mdl-card--border">
                <button class="order-button mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                        data-pack-id="${pack.id}">
                    <i class="material-icons">shopping_cart</i>
                    Purchase Now
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    // Add click listeners to order buttons
    document.querySelectorAll('.order-button').forEach(button => {
        button.addEventListener('click', () => {
            selectedPack = ucPacks.find(pack => pack.id === parseInt(button.dataset.packId));
            if (selectedPack) {
                document.querySelector('#ucAmount').textContent = selectedPack.amount.toLocaleString();
                document.querySelector('#ucPrice').textContent = selectedPack.price.toLocaleString();
                dialog.showModal();
            }
        });
    });
}

// Initialize filter buttons
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update current filter and display packs
            currentFilter = button.dataset.filter;
            displayUCPacks(currentFilter);
        });
    });
}

// Display profile
function displayProfile() {
    const profileDetails = document.querySelector('#profile-details');
    if (profileDetails) {
        profileDetails.innerHTML = `
            <p><strong>Name:</strong> ${currentUser.name}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>Phone:</strong> ${currentUser.phone}</p>
        `;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Close dialog button
    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            dialog.close();
            if (orderForm) orderForm.reset();
            selectedPack = null;
        });
    }

    // Search functionality
    const searchInput = document.querySelector('#search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredPacks = ucPacks.filter(pack => 
                pack.name.toLowerCase().includes(searchTerm) ||
                pack.amount.toString().includes(searchTerm) ||
                pack.price.toString().includes(searchTerm)
            );
            displayUCPacks(currentFilter);
        });
    }
}

// Display orders
function displayOrders() {
    const ordersList = document.querySelector('#orders .orders-list');
    if (ordersList) {
        ordersList.innerHTML = '';
        orders.forEach(order => {
            const card = document.createElement('div');
            card.className = 'order-card mdl-card mdl-shadow--2dp';
            card.innerHTML = `
                <div class="mdl-card__title">
                    <h2 class="mdl-card__title-text">
                        <span class="status-dot ${order.status === 'pending' ? 'status-pending' : 'status-completed'}"></span>
                        Order #${order.id}
                    </h2>
                </div>
                <div class="mdl-card__supporting-text">
                    <p><strong>Pack:</strong> ${order.packAmount}</p>
                    <p><strong>Amount:</strong> ${order.packAmount}</p>
                    <p><strong>Price:</strong> ₹${order.packPrice}</p>
                    <p><strong>Player Name:</strong> ${order.playerName}</p>
                    <p><strong>Number:</strong> ${order.number}</p>
                    <p><strong>BGMI ID:</strong> ${order.bgmiId}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                    <p><strong>Date:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
                </div>
                ${order.status === 'pending' ? `
                <div class="mdl-card__actions mdl-card--border">
                    <a href="https://t.me/+uM6DXbWPPxYxMjY1" target="_blank" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                        <i class="material-icons">support_agent</i>
                        Contact Support
                    </a>
                </div>` : ''}
            `;
            ordersList.appendChild(card);
        });
    }
}

// Create test orders with UPI Transaction IDs
const testOrders = [
    {
        playerName: "Rahul Kumar",
        bgmiId: "5123456789",
        whatsappNumber: "9876543210",
        packAmount: "1060 UC",
        packPrice: "279",
        upiTransactionId: "202503151123ABCD4567",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        completed: true,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000).toISOString()
    },
    {
        playerName: "Priya Singh",
        bgmiId: "5234567890",
        whatsappNumber: "9876543211",
        packAmount: "2000 + 25 UC",
        packPrice: "399",
        upiTransactionId: "202503151145EFGH8901",
        timestamp: new Date().toISOString(), // Today
        completed: false,
        cancelled: false
    },
    {
        playerName: "Amit Patel",
        bgmiId: "5345678901",
        whatsappNumber: "9876543212",
        packAmount: "3600 + 60 UC",
        packPrice: "799",
        upiTransactionId: "202503151150IJKL2345",
        timestamp: new Date().toISOString(), // Today
        completed: false,
        cancelled: false
    },
    {
        playerName: "Sneha Gupta",
        bgmiId: "5456789012",
        whatsappNumber: "9876543213",
        packAmount: "6500 + 300 UC",
        packPrice: "1999",
        upiTransactionId: "202503151135MNOP6789",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        completed: true,
        completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 1800000).toISOString()
    },
    {
        playerName: "Raj Sharma",
        bgmiId: "5567890123",
        whatsappNumber: "9876543214",
        packAmount: "10000 + 850 UC",
        packPrice: "3999",
        upiTransactionId: "202503151140QRST0123",
        timestamp: new Date().toISOString(), // Today
        completed: false,
        cancelled: true,
        cancelledAt: new Date().toISOString()
    }
];

// Store test orders
localStorage.setItem('orders', JSON.stringify(testOrders));

// Handle payment method selection
function initializePaymentMethods() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const upiInput = document.querySelector('.upi-input');
    let selectedMethod = 'upi';

    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to selected option
            option.classList.add('active');
            selectedMethod = option.dataset.method;

            // Show/hide UPI input based on selected method
            if (selectedMethod === 'upi') {
                upiInput.style.display = 'block';
            } else {
                upiInput.style.display = 'none';
                // Launch appropriate payment app
                switch(selectedMethod) {
                    case 'googlepay':
                        window.location.href = `gpay://upi/pay?pa=your_merchant_upi@bank&pn=BGMI UC Store&tr=${Date.now()}&am=${selectedPack.price}&cu=INR&mc=5411`;
                        break;
                    case 'phonepe':
                        window.location.href = `phonepe://pay?pa=your_merchant_upi@bank&pn=BGMI UC Store&tr=${Date.now()}&am=${selectedPack.price}&cu=INR&mc=5411`;
                        break;
                    case 'paytm':
                        window.location.href = `paytmmp://pay?pa=your_merchant_upi@bank&pn=BGMI UC Store&tr=${Date.now()}&am=${selectedPack.price}&cu=INR&mc=5411`;
                        break;
                }
            }
        });
    });

    // Handle UPI payment submission
    const purchaseButton = document.querySelector('.purchase');
    purchaseButton.addEventListener('click', () => {
        if (selectedMethod === 'upi') {
            const upiId = document.querySelector('#upi-id').value;
            if (!upiId) {
                showSnackbar('Please enter your UPI ID');
                return;
            }
            if (!isValidUpiId(upiId)) {
                showSnackbar('Please enter a valid UPI ID');
                return;
            }
            // Process UPI payment
            processUpiPayment(upiId);
        }
    });
}

// Validate UPI ID format
function isValidUpiId(upiId) {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/;
    return upiRegex.test(upiId);
}

// Process UPI payment
function processUpiPayment(upiId) {
    // Get user details
    const playerName = document.querySelector('#player-name').value.trim();
    const playerNumber = document.querySelector('#player-number').value.trim();
    const bgmiId = document.querySelector('#bgmi-id').value.trim();

    // Validate user details
    if (!playerName) {
        showSnackbar('Please enter your full name');
        return;
    }
    if (!playerNumber || !/^[0-9]{10}$/.test(playerNumber)) {
        showSnackbar('Please enter a valid 10-digit WhatsApp number');
        return;
    }
    if (!bgmiId || !/^[0-9]{8,12}$/.test(bgmiId)) {
        showSnackbar('Please enter a valid BGMI Character ID');
        return;
    }

    const amount = selectedPack.price;
    const orderId = `BGMI${Date.now()}`;
    
    // Create UPI payment URL
    const upiUrl = `upi://pay?pa=${upiId}&pn=BGMI UC Store&tr=${orderId}&am=${amount}&cu=INR&mc=5411`;
    
    // Create order in system
    const order = {
        id: orderId,
        pack: selectedPack,
        amount: amount,
        playerName: playerName,
        playerNumber: playerNumber,
        bgmiId: bgmiId,
        upiId: upiId,
        status: 'pending',
        timestamp: new Date().toISOString()
    };
    
    // Add order to orders array
    orders.push(order);
    
    // Save order details to localStorage
    localStorage.setItem('lastOrder', JSON.stringify(order));
    
    // Open UPI payment
    window.location.href = upiUrl;
    
    // Close dialog
    dialog.close();
    
    // Show success message
    showSnackbar('Payment initiated. Please complete the payment in your UPI app.');
}

// Handle order submission
function handleOrderSubmit(event) {
    event.preventDefault();
    
    const playerName = document.getElementById('playerName').value;
    const bgmiId = document.getElementById('bgmiId').value;
    const whatsappNumber = document.getElementById('whatsappNumber').value;
    const upiTransactionId = document.getElementById('upiTransactionId').value;
    const selectedPack = getSelectedPack();
    
    if (!playerName || !bgmiId || !whatsappNumber || !upiTransactionId || !selectedPack) {
        showSnackbar('Please fill in all required fields');
        return;
    }

    // Validate UPI Transaction ID
    if (upiTransactionId.length < 12) {
        showSnackbar('Please enter a valid UPI Transaction ID (at least 12 characters)');
        return;
    }

    const order = {
        playerName,
        bgmiId,
        whatsappNumber,
        upiTransactionId,
        packAmount: selectedPack.name,
        packPrice: selectedPack.price.toString(),
        timestamp: new Date().toISOString(),
        completed: false,
        cancelled: false
    };

    // Get existing orders
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Show success message
    showSnackbar('Order placed successfully! We will process it shortly.');
    
    // Reset form
    document.getElementById('order-form').reset();
    resetPackSelection();
}

// Show snackbar message
function showSnackbar(message) {
    const snackbarContainer = document.querySelector('#snackbar');
    const data = {
        message: message,
        timeout: 3000
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

// Initialize payment methods when dialog opens
dialog.addEventListener('show', initializePaymentMethods);

// Add event listener to order form submission
document.getElementById('order-form').addEventListener('submit', handleOrderSubmit);

// Copy text fallback function
async function copyTextToClipboard(text) {
    // Try using the modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.log('Clipboard API failed, trying fallback...', err);
        }
    }

    // Fallback for non-secure contexts or when Clipboard API fails
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Prevent scrolling to bottom
        textArea.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 2em;
            height: 2em;
            padding: 0;
            border: none;
            outline: none;
            boxShadow: none;
            background: transparent;
        `;

        document.body.appendChild(textArea);
        
        if (navigator.userAgent.match(/ipad|iphone/i)) {
            // iOS workaround
            const range = document.createRange();
            range.selectNodeContents(textArea);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            textArea.setSelectionRange(0, 999999);
        } else {
            textArea.select();
        }

        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
    } catch (err) {
        console.error('Fallback clipboard copy failed:', err);
        return false;
    }
}

// Initialize payment section
function initializePaymentSection() {
    const copyUpiBtn = document.getElementById('copy-upi');
    const downloadQrBtn = document.getElementById('download-qr');
    const selectedAmountSpan = document.querySelector('.selected-amount');
    
    // Update selected amount when pack is selected
    document.querySelectorAll('input[name="uc-pack"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const price = e.target.getAttribute('data-price');
            selectedAmountSpan.textContent = price;
        });
    });

    // Copy UPI ID with improved fallback
    if (copyUpiBtn) {
        copyUpiBtn.addEventListener('click', async () => {
            const upiId = document.querySelector('.upi-value').textContent;
            const success = await copyTextToClipboard(upiId);
            
            if (success) {
                showCopySuccess(copyUpiBtn);
            } else {
                showSnackbar('Could not copy automatically. UPI ID: ' + upiId);
                // Highlight the UPI ID for manual copying
                const upiValue = document.querySelector('.upi-value');
                upiValue.style.background = 'rgba(63, 81, 181, 0.2)';
                setTimeout(() => {
                    upiValue.style.background = '';
                }, 2000);
            }
        });
    }

    // Download QR code
    if (downloadQrBtn) {
        downloadQrBtn.addEventListener('click', () => {
            const qrImage = document.querySelector('.qr-code');
            const link = document.createElement('a');
            link.download = 'bgmi-uc-store-upi-qr.svg';
            link.href = qrImage.src;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showSnackbar('QR code downloaded successfully!');
        });
    }
}

// Show copy success animation
function showCopySuccess(button) {
    const icon = button.querySelector('i');
    button.classList.add('copied');
    icon.textContent = 'check';
    showSnackbar('UPI ID copied to clipboard!');
    
    setTimeout(() => {
        button.classList.remove('copied');
        icon.textContent = 'content_copy';
    }, 2000);
}
