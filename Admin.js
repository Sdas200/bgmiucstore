// Admin credentials
const ADMIN_EMAIL = 'emogaming003@gmail.com';
const ADMIN_PASSWORD = 'Emo003';

// Initialize state
const state = {
    orders: [],
    users: [],
    packs: [
        { id: 1, amount: 1060, bonus: 0, price: 279 },
        { id: 2, amount: 2000, bonus: 25, price: 399 },
        { id: 3, amount: 3600, bonus: 60, price: 799 },
        { id: 4, amount: 6500, bonus: 300, price: 1999 },
        { id: 5, amount: 10000, bonus: 850, price: 3999 },
        { id: 6, amount: 18000, bonus: 2000, price: 5999 }
    ],
    currentTab: 'dashboard'
};

// Store current UC packs with correct prices from memory
let ucPacks = [
    { id: 1, ucAmount: 1060, bonusUc: 0, price: 279, isPopular: false },
    { id: 2, ucAmount: 2000, bonusUc: 25, price: 399, isPopular: true },
    { id: 3, ucAmount: 3600, bonusUc: 60, price: 799, isPopular: false },
    { id: 4, ucAmount: 6500, bonusUc: 300, price: 1999, isPopular: true },
    { id: 5, ucAmount: 10000, bonusUc: 850, price: 3999, isPopular: false },
    { id: 6, ucAmount: 18000, bonusUc: 2000, price: 5999, isPopular: false }
];

// Store settings
let storeSettings = {
    storeName: 'BGMI UC Store',
    upiId: 'ravan.op@freecharge',
    telegramLink: 'https://t.me/+uM6DXbWPPxYxMjY1',
    qrCodeUrl: 'images/photo_2025-03-14_21-51-07.jpg'
};

// Payment settings
let paymentSettings = {
    upiId: 'ravan.op@freecharge',
    qrCodeUrl: 'images/photo_2025-03-14_21-51-07.jpg',
    videoUrl: '',
    instructions: `1. Scan the QR code or use UPI ID
2. Enter the amount shown
3. Complete the payment
4. Enter UPI Transaction ID
5. Click Submit Payment
6. Wait 5-10 minutes for UC credit`,
    supportMessage: 'For any issues with your order, please contact us on Telegram. We provide 24/7 support and will help resolve your issue quickly.',
    telegramLink: 'https://t.me/+uM6DXbWPPxYxMjY1'
};

// Theme settings
let themeSettings = {
    primaryColor: '#00ffd9',
    accentColor: '#ff0055',
    backgroundColor: '#0a0a20'
};

// Default payment settings
const defaultSettings = {
    upiId: 'ravan.op@freecharge',
    instructions: `1. Scan QR code or use UPI ID to pay the exact amount shown
2. Enter the UPI Transaction ID after payment
3. Your UC will be credited within 5-10 minutes
4. For any issues, contact us on Telegram: https://t.me/+uM6DXbWPPxYxMjY1`,
    qrCodeUrl: '',
    telegramLink: 'https://t.me/+uM6DXbWPPxYxMjY1',
    videoUrl: ''
};

// Default UC packs
const defaultUcPacks = [
    { id: 1, ucAmount: 1060, bonusUc: 0, price: 279 },
    { id: 2, ucAmount: 2000, bonusUc: 25, price: 399 },
    { id: 3, ucAmount: 3600, bonusUc: 60, price: 799 },
    { id: 4, ucAmount: 6500, bonusUc: 300, price: 1999 },
    { id: 5, ucAmount: 10000, bonusUc: 850, price: 3999 },
    { id: 6, ucAmount: 18000, bonusUc: 2000, price: 5999 }
];

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    // Load UC packs
    loadUcPacks();
    
    // Load orders
    loadOrders();
    
    // Load payment settings
    loadPaymentSettings();
    
    // Initialize Material Design Lite
    componentHandler.upgradeDom();
    
    // Add event listeners
    setupEventListeners();
});

// Load UC packs into table
function loadUcPacks() {
    const tbody = document.getElementById('uc-packs-table-body');
    const ucPacks = JSON.parse(localStorage.getItem('ucPacks') || JSON.stringify(defaultUcPacks));
    
    tbody.innerHTML = '';
    ucPacks.forEach(pack => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="mdl-data-table__cell--non-numeric">${pack.ucAmount}</td>
            <td class="mdl-data-table__cell--non-numeric">${pack.bonusUc}</td>
            <td class="mdl-data-table__cell--non-numeric">₹${pack.price}</td>
            <td class="mdl-data-table__cell--non-numeric">
                ${pack.isPopular ? '<i class="material-icons" style="color: var(--primary-color)">star</i>' : ''}
            </td>
            <td class="mdl-data-table__cell--non-numeric">
                <button class="mdl-button mdl-js-button mdl-button--icon edit-pack" data-pack-id="${pack.id}">
                    <i class="material-icons">edit</i>
                </button>
                <button class="mdl-button mdl-js-button mdl-button--icon delete-pack" data-pack-id="${pack.id}">
                    <i class="material-icons">delete</i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
        
        // Add event listeners for edit and delete buttons
        tr.querySelector('.edit-pack').onclick = () => showPackDialog(pack);
        tr.querySelector('.delete-pack').onclick = () => deletePack(pack.id);
    });
}

// Load orders into table with improved error handling
function loadOrders() {
    const tbody = document.getElementById('orders-table-body');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    tbody.innerHTML = '';
    orders.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="mdl-data-table__cell--non-numeric">${order.id}</td>
            <td class="mdl-data-table__cell--non-numeric">${formatDate(order.date)}</td>
            <td class="mdl-data-table__cell--non-numeric">${escapeHtml(order.playerName)}</td>
            <td class="mdl-data-table__cell--non-numeric">${escapeHtml(order.bgmiId)}</td>
            <td class="mdl-data-table__cell--non-numeric">${escapeHtml(order.whatsapp)}</td>
            <td class="mdl-data-table__cell--non-numeric">${order.pack.ucAmount} UC${order.pack.bonusUc ? ` + ${order.pack.bonusUc} Bonus` : ''}</td>
            <td class="mdl-data-table__cell--non-numeric">₹${order.pack.price}</td>
            <td class="mdl-data-table__cell--non-numeric">${escapeHtml(order.transactionId)}</td>
            <td class="mdl-data-table__cell--non-numeric">
                <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
                ${order.statusNotes ? `<i class="material-icons" title="${escapeHtml(order.statusNotes)}">info</i>` : ''}
            </td>
            <td class="mdl-data-table__cell--non-numeric">
                <button class="mdl-button mdl-js-button mdl-button--icon update-status" data-order-id="${order.id}">
                    <i class="material-icons">update</i>
                </button>
                <button class="mdl-button mdl-js-button mdl-button--icon view-details" data-order-id="${order.id}">
                    <i class="material-icons">visibility</i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
        
        // Add event listeners
        tr.querySelector('.update-status').onclick = () => updateOrderStatus(order.id);
        tr.querySelector('.view-details').onclick = () => viewOrderDetails(order);
    });
    
    // Upgrade MDL components
    componentHandler.upgradeDom();
}

// Load payment settings
function loadPaymentSettings() {
    const form = document.getElementById('payment-settings-form');
    const settings = JSON.parse(localStorage.getItem('paymentSettings') || JSON.stringify(defaultSettings));
    
    // Validate Telegram link from memory
    const telegramLink = 'https://t.me/+uM6DXbWPPxYxMjY1';
    if (settings.telegramLink !== telegramLink) {
        settings.telegramLink = telegramLink;
        localStorage.setItem('paymentSettings', JSON.stringify(settings));
    }
    
    form.upiId.value = settings.upiId;
    form.instructions.value = settings.instructions;
    form.telegramLink.value = settings.telegramLink;
    
    // Update QR code preview with error handling
    const preview = document.getElementById('qr-code-preview');
    if (settings.qrCodeUrl) {
        preview.onerror = () => {
            preview.style.display = 'none';
            showSnackbar('Error loading QR code image');
        };
        preview.onload = () => {
            preview.style.display = 'block';
        };
        preview.src = settings.qrCodeUrl;
    } else {
        preview.style.display = 'none';
    }
    
    componentHandler.upgradeDom();
}

// Setup event listeners
function setupEventListeners() {
    // Add pack button
    document.getElementById('add-pack-btn').onclick = () => showPackDialog();
    
    // Pack dialog buttons
    const packDialog = document.getElementById('pack-dialog');
    packDialog.querySelector('.close').onclick = () => packDialog.close();
    packDialog.querySelector('.save-pack').onclick = savePack;
    
    // Payment settings form
    document.getElementById('payment-settings-form').onsubmit = savePaymentSettings;
    
    // QR code upload
    const uploadBtn = document.getElementById('upload-qr-btn');
    const fileInput = document.getElementById('qr-code-file');
    
    uploadBtn.onclick = () => fileInput.click();
    fileInput.onchange = handleQrCodeUpload;
    
    // QR code URL input
    document.getElementById('qr-code-url').addEventListener('input', (e) => {
        const preview = document.getElementById('qr-code-preview');
        const url = e.target.value.trim();
        
        if (url) {
            preview.src = url;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    });
}

// Handle QR code upload
function handleQrCodeUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('qr-code-preview');
            const urlInput = document.getElementById('qr-code-url');
            
            preview.src = event.target.result;
            preview.style.display = 'block';
            urlInput.value = event.target.result;
            
            // Update Material Design Lite
            urlInput.parentElement.classList.add('is-dirty');
        };
        reader.readAsDataURL(file);
    }
}

// Show pack dialog with improved validation
function showPackDialog(pack = null) {
    const dialog = document.getElementById('pack-dialog');
    const form = dialog.querySelector('form');
    
    if (pack) {
        form.querySelector('#pack-id').value = pack.id;
        form.querySelector('#uc-amount').value = pack.ucAmount;
        form.querySelector('#bonus-uc').value = pack.bonusUc;
        form.querySelector('#price').value = pack.price;
        form.querySelector('#is-popular').checked = pack.isPopular;
        dialog.querySelector('.mdl-dialog__title').textContent = 'Edit UC Pack';
    } else {
        form.reset();
        form.querySelector('#pack-id').value = '';
        dialog.querySelector('.mdl-dialog__title').textContent = 'Add UC Pack';
    }
    
    // Add input validation
    form.querySelectorAll('input[type="number"]').forEach(input => {
        input.onchange = () => {
            if (input.value < 0) input.value = 0;
        };
    });
    
    dialog.showModal();
    componentHandler.upgradeDom();
}

// Save pack with improved error handling
function savePack() {
    const dialog = document.getElementById('pack-dialog');
    const form = dialog.querySelector('form');
    
    const packData = {
        id: form.querySelector('#pack-id').value || Date.now(),
        ucAmount: parseInt(form.querySelector('#uc-amount').value),
        bonusUc: parseInt(form.querySelector('#bonus-uc').value) || 0,
        price: parseInt(form.querySelector('#price').value),
        isPopular: form.querySelector('#is-popular').checked
    };
    
    // Validate pack data
    if (!packData.ucAmount || !packData.price) {
        showSnackbar('Please fill in all required fields');
        return;
    }
    
    let packs = JSON.parse(localStorage.getItem('ucPacks') || JSON.stringify(ucPacks));
    
    if (form.querySelector('#pack-id').value) {
        // Update existing pack
        packs = packs.map(p => p.id == packData.id ? packData : p);
    } else {
        // Add new pack
        packs.push(packData);
    }
    
    localStorage.setItem('ucPacks', JSON.stringify(packs));
    loadUcPacks();
    dialog.close();
    showSnackbar('UC Pack saved successfully');
}

// Update order status with improved validation and error handling
function updateOrderStatus(orderId) {
    try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
            showSnackbar('Order not found');
            return;
        }
        
        const dialog = document.createElement('dialog');
        dialog.className = 'mdl-dialog';
        dialog.innerHTML = `
            <h4 class="mdl-dialog__title">Update Order Status</h4>
            <div class="mdl-dialog__content">
                <div class="order-details">
                    <p><strong>Order ID:</strong> ${order.id}</p>
                    <p><strong>Player Name:</strong> ${escapeHtml(order.playerName)}</p>
                    <p><strong>BGMI ID:</strong> ${escapeHtml(order.bgmiId)}</p>
                    <p><strong>UC Amount:</strong> ${order.pack.ucAmount} UC${order.pack.bonusUc ? ` + ${order.pack.bonusUc} Bonus UC` : ''}</p>
                    <p><strong>Current Status:</strong> <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></p>
                </div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <select class="mdl-textfield__input" id="new-status">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                    <label class="mdl-textfield__label" for="new-status">New Status</label>
                </div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <textarea class="mdl-textfield__input" id="status-notes" rows="3">${order.statusNotes || ''}</textarea>
                    <label class="mdl-textfield__label" for="status-notes">Notes (optional)</label>
                </div>
            </div>
            <div class="mdl-dialog__actions">
                <button type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored update">
                    <i class="material-icons">save</i> Update Status
                </button>
                <button type="button" class="mdl-button close">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        componentHandler.upgradeDom();
        
        const closeDialog = () => {
            dialog.close();
            setTimeout(() => dialog.remove(), 300);
        };
        
        dialog.querySelector('.close').onclick = closeDialog;
        
        dialog.querySelector('.update').onclick = () => {
            const newStatus = dialog.querySelector('#new-status').value;
            const notes = dialog.querySelector('#status-notes').value.trim();
            
            if (!newStatus) {
                showSnackbar('Please select a status');
                return;
            }
            
            order.status = newStatus;
            order.statusNotes = notes;
            order.lastUpdated = new Date().toISOString();
            
            try {
                localStorage.setItem('orders', JSON.stringify(orders));
                loadOrders();
                closeDialog();
                showSnackbar('Order status updated successfully');
            } catch (error) {
                console.error('Error saving order:', error);
                showSnackbar('Failed to update order status');
            }
        };
        
        dialog.showModal();
    } catch (error) {
        console.error('Error updating order:', error);
        showSnackbar('An error occurred while updating the order');
    }
}

// View order details
function viewOrderDetails(order) {
    const dialog = document.createElement('dialog');
    dialog.className = 'mdl-dialog';
    dialog.innerHTML = `
        <h4 class="mdl-dialog__title">Order Details</h4>
        <div class="mdl-dialog__content">
            <div class="order-details">
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Date:</strong> ${formatDate(order.date)}</p>
                <p><strong>Player Name:</strong> ${escapeHtml(order.playerName)}</p>
                <p><strong>BGMI ID:</strong> ${escapeHtml(order.bgmiId)}</p>
                <p><strong>WhatsApp:</strong> ${escapeHtml(order.whatsapp)}</p>
                <p><strong>UC Amount:</strong> ${order.pack.ucAmount} UC${order.pack.bonusUc ? ` + ${order.pack.bonusUc} Bonus UC` : ''}</p>
                <p><strong>Price:</strong> ₹${order.pack.price}</p>
                <p><strong>Transaction ID:</strong> ${escapeHtml(order.transactionId)}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></p>
                ${order.statusNotes ? `<p><strong>Notes:</strong> ${escapeHtml(order.statusNotes)}</p>` : ''}
                ${order.lastUpdated ? `<p><strong>Last Updated:</strong> ${formatDate(order.lastUpdated)}</p>` : ''}
            </div>
        </div>
        <div class="mdl-dialog__actions">
            <button type="button" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored update-status" data-order-id="${order.id}">
                <i class="material-icons">update</i> Update Status
            </button>
            <button type="button" class="mdl-button close">Close</button>
        </div>
    `;
    
    document.body.appendChild(dialog);
    componentHandler.upgradeDom();
    
    dialog.querySelector('.close').onclick = () => {
        dialog.close();
        setTimeout(() => dialog.remove(), 300);
    };
    
    dialog.querySelector('.update-status').onclick = () => {
        dialog.close();
        setTimeout(() => {
            dialog.remove();
            updateOrderStatus(order.id);
        }, 300);
    };
    
    dialog.showModal();
}

// Helper function to format date
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Delete pack
function deletePack(packId) {
    if (confirm('Are you sure you want to delete this UC pack?')) {
        const ucPacks = JSON.parse(localStorage.getItem('ucPacks') || JSON.stringify(defaultUcPacks));
        const index = ucPacks.findIndex(pack => pack.id === packId);
        
        if (index !== -1) {
            ucPacks.splice(index, 1);
            localStorage.setItem('ucPacks', JSON.stringify(ucPacks));
            loadUcPacks();
            showSnackbar('UC pack deleted successfully');
        }
    }
}

// Save payment settings
function savePaymentSettings(e) {
    e.preventDefault();
    
    const form = e.target;
    const settings = {
        upiId: form.upiId.value.trim(),
        instructions: form.instructions.value.trim(),
        qrCodeUrl: form.qrCodeUrl.value.trim(),
        telegramLink: form.telegramLink.value.trim()
    };
    
    localStorage.setItem('paymentSettings', JSON.stringify(settings));
    showSnackbar('Payment settings saved successfully');
}

// Show snackbar message
function showSnackbar(message) {
    const snackbar = document.querySelector('.mdl-js-snackbar');
    if (snackbar) {
        snackbar.MaterialSnackbar.showSnackbar({ message });
    }
}

// Dashboard Panel
function initializeDashboard() {
    updateDashboardStats();
    updateRecentOrders();
}

function updateDashboardStats() {
    const stats = calculateStats();
    
    // Update stats in the dashboard
    document.getElementById('total-orders').textContent = stats.totalOrders;
    document.getElementById('total-revenue').textContent = `₹${stats.totalRevenue}`;
    document.getElementById('total-users').textContent = stats.totalUsers;
    document.getElementById('pending-orders').textContent = stats.pendingOrders;
}

function calculateStats() {
    try {
        const totalOrders = state.orders.length;
        const totalRevenue = state.orders
            .filter(order => order.status === 'completed')
            .reduce((sum, order) => sum + order.amount, 0);
        const totalUsers = state.users.length;
        const pendingOrders = state.orders.filter(order => order.status === 'pending').length;
        
        return {
            totalOrders,
            totalRevenue,
            totalUsers,
            pendingOrders
        };
    } catch (error) {
        console.error('Error calculating stats:', error);
        return {
            totalOrders: 0,
            totalRevenue: 0,
            totalUsers: 0,
            pendingOrders: 0
        };
    }
}

function updateRecentOrders() {
    const recentOrdersTable = document.getElementById('recent-orders');
    if (!recentOrdersTable) return;
    
    try {
        const recentOrders = state.orders
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        const tbody = recentOrdersTable.querySelector('tbody');
        tbody.innerHTML = recentOrders.map(order => `
            <tr>
                <td class="mdl-data-table__cell--non-numeric">${order.id}</td>
                <td class="mdl-data-table__cell--non-numeric">${new Date(order.date).toLocaleString()}</td>
                <td class="mdl-data-table__cell--non-numeric">${order.playerName}</td>
                <td class="mdl-data-table__cell--non-numeric">${order.bgmiId}</td>
                <td class="mdl-data-table__cell--non-numeric">${order.whatsapp}</td>
                <td class="mdl-data-table__cell--non-numeric">${order.pack.ucAmount} UC${order.pack.bonusUc ? ` + ${order.pack.bonusUc} Bonus UC` : ''}</td>
                <td class="mdl-data-table__cell--non-numeric">₹${order.pack.price}</td>
                <td class="mdl-data-table__cell--non-numeric">${order.transactionId}</td>
                <td class="mdl-data-table__cell--non-numeric">
                    <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
                </td>
                <td class="mdl-data-table__cell--non-numeric">
                    <button class="mdl-button mdl-js-button mdl-button--icon update-status" data-order-id="${order.id}">
                        <i class="material-icons">update</i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Re-register material design effects
        componentHandler.upgradeElements(recentOrdersTable);
    } catch (error) {
        console.error('Error updating recent orders:', error);
        showSnackbar('Error updating recent orders');
    }
}

// Tab Management
function initializeTabs() {
    const tabBar = document.querySelector('.mdl-layout__tab-bar');
    if (!tabBar) return;
    
    // Add click event listeners to tabs
    tabBar.addEventListener('click', (e) => {
        const tab = e.target.closest('.mdl-layout__tab');
        if (!tab) return;
        
        const tabId = tab.getAttribute('href').substring(1);
        switchTab(tabId);
    });
    
    // Show initial tab
    const initialTab = window.location.hash.substring(1) || 'dashboard';
    switchTab(initialTab);
}

function switchTab(tabId) {
    // Update state
    state.currentTab = tabId;
    
    // Hide all sections
    document.querySelectorAll('.mdl-layout__tab-panel').forEach(panel => {
        panel.classList.remove('is-active');
    });
    
    // Show selected section
    const selectedPanel = document.getElementById(tabId);
    if (selectedPanel) {
        selectedPanel.classList.add('is-active');
    }
    
    // Update tab selection
    document.querySelectorAll('.mdl-layout__tab').forEach(tab => {
        tab.classList.remove('is-active');
        if (tab.getAttribute('href') === `#${tabId}`) {
            tab.classList.add('is-active');
        }
    });
    
    // Update URL hash
    window.location.hash = tabId;
    
    // Refresh content based on tab
    refreshTabContent(tabId);
}

function refreshTabContent(tabId) {
    switch (tabId) {
        case 'dashboard':
            updateDashboardStats();
            updateRecentOrders();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
        case 'packs':
            loadPacks();
            break;
    }
}

// Orders Panel
function initializeOrdersPanel() {
    const tbody = document.getElementById('orders-table-body');
    
    // Load and render orders
    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        tbody.innerHTML = '';

        orders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="mdl-data-table__cell--non-numeric">${order.id}</td>
                <td class="mdl-data-table__cell--non-numeric">${new Date(order.date).toLocaleString()}</td>
                <td class="mdl-data-table__cell--non-numeric">${order.playerName}</td>
                <td class="mdl-data-table__cell--non-numeric">${order.bgmiId}</td>
                <td class="mdl-data-table__cell--non-numeric">${order.whatsapp}</td>
                <td class="mdl-data-table__cell--non-numeric">${order.pack.ucAmount} UC${order.pack.bonusUc ? ` + ${order.pack.bonusUc} Bonus UC` : ''}</td>
                <td class="mdl-data-table__cell--non-numeric">₹${order.pack.price}</td>
                <td class="mdl-data-table__cell--non-numeric">${order.transactionId}</td>
                <td class="mdl-data-table__cell--non-numeric">
                    <select class="status-select" data-order-id="${order.id}">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td class="mdl-data-table__cell--non-numeric">
                    <button class="mdl-button mdl-js-button mdl-button--icon whatsapp-btn" 
                            onclick="window.open('https://wa.me/${order.whatsapp}', '_blank')">
                        <i class="material-icons">chat</i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);

            // Handle status change
            const statusSelect = tr.querySelector('.status-select');
            statusSelect.addEventListener('change', () => {
                const orders = JSON.parse(localStorage.getItem('orders') || '[]');
                const orderIndex = orders.findIndex(o => o.id === order.id);
                if (orderIndex !== -1) {
                    orders[orderIndex].status = statusSelect.value;
                    localStorage.setItem('orders', JSON.stringify(orders));
                    showSnackbar('Order status updated');
                }
            });
        });
    }

    // Initial load
    loadOrders();

    // Listen for changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'orders') {
            loadOrders();
        }
    });
}

// Users Panel
function initializeUsersPanel() {
    loadUsers();
}

function loadUsers() {
    const usersTable = document.getElementById('users-table-body');
    if (!usersTable) return;
    
    if (state.users.length === 0) {
        usersTable.innerHTML = '<tr><td colspan="7" class="mdl-data-table__cell--non-numeric">No users found</td></tr>';
        return;
    }
    
    usersTable.innerHTML = state.users.map(user => {
        const userOrders = state.orders.filter(order => order.user === user.name);
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        
        return `
            <tr>
                <td class="mdl-data-table__cell--non-numeric">
                    <div style="display: flex; align-items: center;">
                        <div class="user-avatar">${initials}</div>
                        ${user.name}
                    </div>
                </td>
                <td class="mdl-data-table__cell--non-numeric">${user.email}</td>
                <td class="mdl-data-table__cell--non-numeric">${user.bgmiId}</td>
                <td class="mdl-data-table__cell--non-numeric">${user.whatsappNumber}</td>
                <td class="mdl-data-table__cell--non-numeric">${formatDate(user.joinDate)}</td>
                <td class="mdl-data-table__cell--non-numeric">${userOrders.length}</td>
                <td class="mdl-data-table__cell--non-numeric">
                    <button class="mdl-button mdl-js-button mdl-button--icon action-button view-user-orders" title="View Orders">
                        <i class="material-icons">receipt_long</i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Initialize user action buttons
    document.querySelectorAll('.view-user-orders').forEach(button => {
        button.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const userName = row.querySelector('.user-avatar').nextElementSibling.textContent.trim();
            const userOrders = state.orders.filter(order => order.user === userName);
            showUserOrdersDialog(userName, userOrders);
        });
    });
}

function showUserOrdersDialog(userName, orders) {
    const dialog = document.createElement('dialog');
    dialog.className = 'mdl-dialog';
    
    dialog.innerHTML = `
        <h4 class="mdl-dialog__title">Orders for ${userName}</h4>
        <div class="mdl-dialog__content">
            <table class="mdl-data-table mdl-js-data-table">
                <thead>
                    <tr>
                        <th class="mdl-data-table__cell--non-numeric">Date</th>
                        <th class="mdl-data-table__cell--non-numeric">UC Amount</th>
                        <th>Price</th>
                        <th class="mdl-data-table__cell--non-numeric">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.length ? orders.map(order => `
                        <tr>
                            <td class="mdl-data-table__cell--non-numeric">${formatDate(order.date)}</td>
                            <td class="mdl-data-table__cell--non-numeric">${order.packAmount}</td>
                            <td>${formatCurrency(order.packPrice)}</td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <span class="status-badge ${order.status}">
                                    ${order.status}
                                </span>
                            </td>
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="4" class="mdl-data-table__cell--non-numeric">No orders found</td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>
        <div class="mdl-dialog__actions">
            <button type="button" class="mdl-button close">Close</button>
        </div>
    `;
    
    document.body.appendChild(dialog);
    dialog.querySelector('.close').addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });
    
    dialog.showModal();
}

// UC Packs Panel
function initializePacksPanel() {
    loadPacks();
    initializeAddPackButton();
}

function loadPacks() {
    const packsGrid = document.getElementById('packs-grid');
    if (!packsGrid) return;

    const packs = state.packs;
    
    packsGrid.innerHTML = packs.map(pack => `
        <div class="mdl-card mdl-shadow--2dp pack-card">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text">
                    <i class="material-icons">monetization_on</i>
                    ${pack.amount} UC
                </h2>
            </div>
            <div class="mdl-card__supporting-text">
                <div class="pack-price">${formatCurrency(pack.price)}</div>
                ${pack.bonus ? `
                    <div class="pack-bonus">
                        <i class="material-icons">add_circle</i>
                        +${pack.bonus} Bonus UC
                    </div>
                ` : ''}
            </div>
            <div class="pack-effects">
                <div class="pack-shine"></div>
                <div class="pack-particles"></div>
            </div>
            <div class="mdl-card__actions mdl-card--border">
                <button class="mdl-button mdl-js-button mdl-button--icon edit-pack" data-pack-id="${pack.id}">
                    <i class="material-icons">edit</i>
                </button>
                <button class="mdl-button mdl-js-button mdl-button--icon delete-pack" data-pack-id="${pack.id}">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        </div>
    `).join('');

    // Initialize pack card effects
    document.querySelectorAll('.pack-card').forEach(card => {
        card.addEventListener('mousemove', handlePackCardHover);
        card.addEventListener('mouseleave', handlePackCardLeave);
    });
}

function handlePackCardHover(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on mouse position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    // Apply 3D rotation effect
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    
    // Update shine effect
    const shine = card.querySelector('.pack-shine');
    if (shine) {
        shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)`;
    }
    
    // Update particles
    const particles = card.querySelector('.pack-particles');
    if (particles) {
        particles.style.transform = `translate(${(x - centerX) / 10}px, ${(y - centerY) / 10}px)`;
    }
}

function handlePackCardLeave(e) {
    const card = e.currentTarget;
    card.style.transform = '';
    
    const shine = card.querySelector('.pack-shine');
    if (shine) {
        shine.style.background = '';
    }
    
    const particles = card.querySelector('.pack-particles');
    if (particles) {
        particles.style.transform = '';
    }
}

function initializeAddPackButton() {
    const addButton = document.getElementById('add-pack-button');
    const dialog = document.getElementById('pack-form');
    const form = document.getElementById('add-pack-form');
    
    if (!dialog || !form || !addButton) return;
    
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    
    addButton.addEventListener('click', () => {
        form.reset();
        dialog.showModal();
    });
    
    dialog.querySelector('.close').addEventListener('click', () => {
        dialog.close();
    });
    
    dialog.querySelector('.save').addEventListener('click', () => {
        const amount = parseInt(document.getElementById('pack-amount').value);
        const bonus = parseInt(document.getElementById('pack-bonus').value);
        const price = parseInt(document.getElementById('pack-price').value);

        if (!amount || !price) {
            showSnackbar('Please fill in all required fields');
            return;
        }
        
        const newPack = {
            id: state.packs.length + 1,
            amount,
            bonus: bonus || 0,
            price
        };
        
        state.packs.push(newPack);
        saveToLocalStorage('packs', state.packs);
        
        loadPacks();
        dialog.close();
        showSnackbar('UC Pack added successfully');
    });
}

// Search Panel
function initializeSearchPanel() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
}

function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const results = document.getElementById('search-results');
    
    if (!query) {
        results.innerHTML = '';
        return;
    }
    
    const searchResults = [
        ...searchPacks(query),
        ...searchOrders(query),
        ...searchUsers(query)
    ];
    
    results.innerHTML = searchResults.length ? searchResults.join('') :
        '<div class="search-item">No results found</div>';
}

function searchPacks(query) {
    return state.packs
        .filter(pack => 
            pack.amount.toString().includes(query) ||
            pack.price.toString().includes(query))
        .map(pack => `
            <div class="search-item">
                <div class="search-item-title">
                    <i class="material-icons">inventory_2</i>
                    ${pack.amount} UC
                </div>
                <div class="search-item-subtitle">
                    ${formatCurrency(pack.price)}${pack.bonus ? ` • ${pack.bonus} Bonus UC` : ''}
                </div>
            </div>
        `);
}

function searchOrders(query) {
    return state.orders
        .filter(order => 
            order.user.toLowerCase().includes(query) ||
            order.bgmiId.toLowerCase().includes(query) ||
            order.whatsappNumber.includes(query))
        .map(order => `
            <div class="search-item">
                <div class="search-item-title">
                    <i class="material-icons">shopping_cart</i>
                    Order by ${order.user}
                </div>
                <div class="search-item-subtitle">
                    ${order.packAmount} • ${formatCurrency(order.packPrice)} • ${order.status}
                </div>
            </div>
        `);
}

function searchUsers(query) {
    return state.users
        .filter(user => 
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.bgmiId.toLowerCase().includes(query))
        .map(user => `
            <div class="search-item">
                <div class="search-item-title">
                    <i class="material-icons">person</i>
                    ${user.name}
                </div>
                <div class="search-item-subtitle">
                    ${user.email} • ${user.bgmiId}
                </div>
            </div>
        `);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSnackbar(message) {
    const snackbar = document.querySelector('.mdl-js-snackbar');
    if (snackbar) {
        snackbar.MaterialSnackbar.showSnackbar({ message });
    }
}

function getStatusClass(order) {
    return order.completed ? 'completed' :
           order.cancelled ? 'cancelled' : 'pending';
}

function getStatusText(order) {
    return order.completed ? 'Completed' :
           order.cancelled ? 'Cancelled' : 'Pending';
}

// Helper functions
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

function formatCurrency(amount) {
    try {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    } catch (error) {
        console.error('Error formatting currency:', error);
        return `₹${amount}`;
    }
}

function initializeLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;
    
    logoutBtn.addEventListener('click', () => {
        // Clear session data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        
        // Redirect to login page
        window.location.href = 'login.html';
    });
}

// Data validation functions
function validateOrder(order) {
    return order && 
           typeof order === 'object' && 
           order.id && 
           order.user && 
           order.amount && 
           order.status;
}

function validateUser(user) {
    return user && 
           typeof user === 'object' && 
           user.name && 
           user.email && 
           user.bgmiId;
}

function validatePack(pack) {
    return pack && 
           typeof pack === 'object' && 
           pack.amount && 
           pack.price && 
           Number.isInteger(pack.amount) && 
           Number.isInteger(pack.price);
}

// Error handling wrapper
function safeExecute(operation, fallback = null) {
    try {
        return operation();
    } catch (error) {
        console.error(`Error executing operation:`, error);
        showSnackbar('An error occurred. Please try again.');
        return fallback;
    }
}

// Data persistence
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
        showSnackbar(`Error saving ${key}. Please try again.`);
        return false;
    }
}

function loadFromLocalStorage(key, defaultValue = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error(`Error loading ${key} from localStorage:`, error);
        showSnackbar(`Error loading ${key}. Using default values.`);
        return defaultValue;
    }
}

// Initialize default UC packs if none exist
function initializeDefaultPacks() {
    if (!state.packs || state.packs.length === 0) {
        state.packs = [
            { id: 1, amount: 1060, bonus: 0, price: 279 },
            { id: 2, amount: 2000, bonus: 25, price: 399 },
            { id: 3, amount: 3600, bonus: 60, price: 799 },
            { id: 4, amount: 6500, bonus: 300, price: 1999 },
            { id: 5, amount: 10000, bonus: 850, price: 3999 },
            { id: 6, amount: 18000, bonus: 2000, price: 5999 }
        ];
        saveToLocalStorage('packs', state.packs);
    }
}

// Component upgrade helper
function upgradeComponents() {
    if (typeof componentHandler !== 'undefined') {
        componentHandler.upgradeDom();
    }
}

// Add click handlers for UPI Transaction ID copy buttons
function initializeUPICopyButtons() {
    document.querySelectorAll('.copy-upi').forEach(button => {
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText('ravan.op@freecharge');
                showSnackbar('UPI ID copied to clipboard');
            } catch (error) {
                console.error('Failed to copy UPI ID:', error);
                showSnackbar('Failed to copy UPI ID');
            }
        });
    });
}

// View order details
function viewOrderDetails(order) {
    const dialog = document.createElement('dialog');
    dialog.className = 'mdl-dialog order-details-dialog';
    dialog.innerHTML = `
        <h4 class="mdl-dialog__title">Order Details</h4>
        <div class="mdl-dialog__content">
            <div class="order-info">
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Date:</strong> ${formatDate(order.date)}</p>
                <p><strong>Player Name:</strong> ${escapeHtml(order.playerName)}</p>
                <p><strong>BGMI ID:</strong> ${escapeHtml(order.bgmiId)}</p>
                <p><strong>WhatsApp:</strong> ${escapeHtml(order.whatsapp)}</p>
                <p><strong>UC Amount:</strong> ${order.pack.ucAmount} UC${order.pack.bonusUc ? ` + ${order.pack.bonusUc} Bonus UC` : ''}</p>
                <p><strong>Price:</strong> ₹${order.pack.price}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
            </div>
            <div class="upi-details">
                <h5>UPI Payment Details</h5>
                <p><strong>UPI ID:</strong> ravan.op@freecharge</p>
                <img src="images/photo_2025-03-14_21-51-07.jpg" alt="UPI QR Code" class="upi-qr">
            </div>
        </div>
        <div class="mdl-dialog__actions">
            ${order.status === 'pending' ? `
                <button type="button" class="mdl-button complete">Complete Order</button>
                <button type="button" class="mdl-button cancel">Cancel Order</button>
            ` : ''}
            <button type="button" class="mdl-button close">Close</button>
        </div>
    `;
    
    document.body.appendChild(dialog);
    dialogPolyfill.registerDialog(dialog);
    
    // Add event listeners
    const closeButton = dialog.querySelector('.close');
    closeButton.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });
    
    if (order.status === 'pending') {
        const completeButton = dialog.querySelector('.complete');
        const cancelButton = dialog.querySelector('.cancel');
        
        completeButton.addEventListener('click', () => {
            completeOrder(order.id);
            dialog.close();
            dialog.remove();
        });
        
        cancelButton.addEventListener('click', () => {
            cancelOrder(order.id);
            dialog.close();
            dialog.remove();
        });
    }
    
    dialog.showModal();
}

// Complete an order
function completeOrder(orderId) {
    try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const orderIndex = orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].completed = true;
            orders[orderIndex].completedAt = new Date().toISOString();
            localStorage.setItem('orders', JSON.stringify(orders));
            loadDashboard();
            showSnackbar('Order marked as completed');
        }
    } catch (error) {
        console.error('Error completing order:', error);
        showSnackbar('Error completing order');
    }
}

// Cancel an order
function cancelOrder(orderId) {
    try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const orderIndex = orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].cancelled = true;
            orders[orderIndex].cancelledAt = new Date().toISOString();
            localStorage.setItem('orders', JSON.stringify(orders));
            loadDashboard();
            showSnackbar('Order cancelled');
        }
    } catch (error) {
        console.error('Error cancelling order:', error);
        showSnackbar('Error cancelling order');
    }
}

// Initialize action buttons
function initializeActionButtons() {
    // Add click handlers for view details buttons
    document.querySelectorAll('.view-order').forEach(button => {
        button.addEventListener('click', (e) => {
            const orderId = e.target.closest('tr').getAttribute('data-order-id');
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const order = orders.find(order => order.id === orderId);
            viewOrderDetails(order);
        });
    });
    
    // Add click handlers for complete order buttons
    document.querySelectorAll('.complete-order').forEach(button => {
        button.addEventListener('click', (e) => {
            const orderId = e.target.closest('tr').getAttribute('data-order-id');
            completeOrder(orderId);
        });
    });
    
    // Add click handlers for cancel order buttons
    document.querySelectorAll('.cancel-order').forEach(button => {
        button.addEventListener('click', (e) => {
            const orderId = e.target.closest('tr').getAttribute('data-order-id');
            cancelOrder(orderId);
        });
    });
}

// Load UC packs into the table
function loadUCPacks() {
    const tbody = document.querySelector('.packs-table tbody');
    tbody.innerHTML = '';

    ucPacks.forEach((pack, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pack.ucAmount}</td>
            <td>${pack.bonusUc}</td>
            <td>₹${pack.price}</td>
            <td class="mdl-data-table__cell--non-numeric">
                ${pack.isPopular ? '<i class="material-icons" style="color: var(--primary-color)">star</i>' : ''}
            </td>
            <td class="mdl-data-table__cell--non-numeric">
                <button class="mdl-button mdl-js-button mdl-button--icon action-button edit-pack" data-index="${index}">
                    <i class="material-icons">edit</i>
                </button>
                <button class="mdl-button mdl-js-button mdl-button--icon action-button delete-pack" data-index="${index}">
                    <i class="material-icons">delete</i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);

        // Handle edit button
        tr.querySelector('.edit-pack').addEventListener('click', () => {
            const dialog = document.getElementById('pack-dialog');
            const form = dialog.querySelector('#pack-form');
            
            form.ucAmount.value = pack.ucAmount;
            form.bonusUc.value = pack.bonusUc;
            form.price.value = pack.price;
            
            dialog.querySelector('.mdl-dialog__title').textContent = 'Edit UC Pack';
            dialog.showModal();
            
            const savePackButton = dialog.querySelector('.save-pack');
            savePackButton.onclick = (e) => handlePackSubmit(e, index);
        });

        // Handle delete button
        tr.querySelector('.delete-pack').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this UC pack?')) {
                ucPacks.splice(index, 1);
                localStorage.setItem('ucPacks', JSON.stringify(ucPacks));
                loadUCPacks();
            }
        });
    });

    // Re-register MDL components
    componentHandler.upgradeElements(tbody);
}

// Load store settings
function loadStoreSettings() {
    const form = document.getElementById('store-settings');
    form.storeName.value = storeSettings.storeName;
    form.upiId.value = storeSettings.upiId;
    form.telegramLink.value = storeSettings.telegramLink;

    // Show QR code preview
    const preview = form.querySelector('.preview');
    preview.innerHTML = `<img src="${storeSettings.qrCodeUrl}" alt="UPI QR Code">`;
}

// Handle store settings form submission
function handleStoreSettingsSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const settings = {
        storeName: form.storeName.value,
        upiId: form.upiId.value,
        telegramLink: form.telegramLink.value,
        qrCodeUrl: storeSettings.qrCodeUrl
    };
    
    localStorage.setItem('storeSettings', JSON.stringify(settings));
    showSnackbar('Store settings saved successfully');
}

// Load theme settings
function loadThemeSettings() {
    const form = document.getElementById('theme-settings');
    form.primaryColor.value = themeSettings.primaryColor;
    form.accentColor.value = themeSettings.accentColor;
    form.backgroundColor.value = themeSettings.backgroundColor;
}

// Handle theme settings form submission
function handleThemeSettingsSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    themeSettings = {
        primaryColor: form.primaryColor.value,
        accentColor: form.accentColor.value,
        backgroundColor: form.backgroundColor.value
    };

    // Update CSS variables
    document.documentElement.style.setProperty('--primary-color', themeSettings.primaryColor);
    document.documentElement.style.setProperty('--accent-color', themeSettings.accentColor);
    document.documentElement.style.setProperty('--dark-bg', themeSettings.backgroundColor);

    // Save to localStorage
    localStorage.setItem('themeSettings', JSON.stringify(themeSettings));
    showSnackbar('Theme settings applied successfully');
}

// Setup event listeners
function setupEventListeners() {
    // Add new pack button
    const addPackButton = document.querySelector('.add-pack-button');
    addPackButton.addEventListener('click', () => {
        const dialog = document.getElementById('pack-dialog');
        const form = dialog.querySelector('#pack-form');
        
        form.reset();
        dialog.querySelector('.mdl-dialog__title').textContent = 'Add New UC Pack';
        dialog.showModal();
        
        const savePackButton = dialog.querySelector('.save-pack');
        savePackButton.addEventListener('click', (e) => handlePackSubmit(e));
    });

    // Pack form submission
    const packDialog = document.getElementById('pack-dialog');
    const savePackButton = packDialog.querySelector('.save-pack');
    savePackButton.addEventListener('click', (e) => handlePackSubmit(e));

    // Close pack dialog
    const closePackButton = packDialog.querySelector('.close');
    closePackButton.addEventListener('click', () => packDialog.close());

    // Edit pack buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.edit-pack')) {
            const index = e.target.closest('.edit-pack').dataset.index;
            const pack = ucPacks[index];
            const dialog = document.getElementById('pack-dialog');
            const form = dialog.querySelector('#pack-form');
            
            form.ucAmount.value = pack.ucAmount;
            form.bonusUc.value = pack.bonusUc;
            form.price.value = pack.price;
            
            dialog.querySelector('.mdl-dialog__title').textContent = 'Edit UC Pack';
            dialog.showModal();
            
            const savePackButton = dialog.querySelector('.save-pack');
            savePackButton.onclick = (e) => handlePackSubmit(e, index);
        }
    });

    // Delete pack buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.delete-pack')) {
            const index = e.target.closest('.delete-pack').dataset.index;
            if (confirm('Are you sure you want to delete this UC pack?')) {
                ucPacks.splice(index, 1);
                localStorage.setItem('ucPacks', JSON.stringify(ucPacks));
                loadUCPacks();
            }
        }
    });

    // Store settings form
    const storeSettingsForm = document.getElementById('store-settings');
    storeSettingsForm.addEventListener('submit', handleStoreSettingsSubmit);

    // QR code file input
    const qrCodeInput = document.getElementById('qr-code');
    qrCodeInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                updatePreview(e.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Theme settings form
    const themeSettingsForm = document.getElementById('theme-settings');
    themeSettingsForm.addEventListener('submit', handleThemeSettingsSubmit);

    // Load saved data from localStorage
    const savedPacks = localStorage.getItem('ucPacks');
    if (savedPacks) {
        ucPacks = JSON.parse(savedPacks);
        loadUCPacks();
    }

    const savedSettings = localStorage.getItem('storeSettings');
    if (savedSettings) {
        storeSettings = JSON.parse(savedSettings);
        loadStoreSettings();
    }

    const savedTheme = localStorage.getItem('themeSettings');
    if (savedTheme) {
        themeSettings = JSON.parse(savedTheme);
        loadThemeSettings();
        // Apply theme
        document.documentElement.style.setProperty('--primary-color', themeSettings.primaryColor);
        document.documentElement.style.setProperty('--accent-color', themeSettings.accentColor);
        document.documentElement.style.setProperty('--dark-bg', themeSettings.backgroundColor);
    }
}

// Load payment settings
function loadPaymentSettings() {
    const savedSettings = localStorage.getItem('paymentSettings');
    if (savedSettings) {
        paymentSettings = JSON.parse(savedSettings);
    }

    // Load UPI settings
    const upiForm = document.getElementById('upi-settings');
    if (upiForm) {
        upiForm.upiId.value = paymentSettings.upiId;
        updatePreview(paymentSettings.qrCodeUrl);
    }

    // Load payment instructions
    const instructionsForm = document.getElementById('payment-instructions');
    if (instructionsForm) {
        instructionsForm.instructions.value = paymentSettings.instructions;
    }

    // Load support settings
    const supportForm = document.getElementById('support-settings');
    if (supportForm) {
        supportForm.telegramLink.value = paymentSettings.telegramLink;
        supportForm.supportMessage.value = paymentSettings.supportMessage;
    }
}

// Setup event listeners for payment settings
function setupPaymentEventListeners() {
    // UPI settings form
    const upiForm = document.getElementById('upi-settings');
    if (upiForm) {
        upiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            paymentSettings.upiId = upiForm.upiId.value;
            
            // Handle QR code file upload
            const qrCodeInput = upiForm.qrCode;
            if (qrCodeInput.files && qrCodeInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    paymentSettings.qrCodeUrl = e.target.result;
                    updatePreview(e.target.result);
                    savePaymentSettings();
                };
                reader.readAsDataURL(qrCodeInput.files[0]);
            } else {
                savePaymentSettings();
            }
            
            showSnackbar('UPI settings saved successfully');
        });

        // QR code preview
        const qrCodeInput = upiForm.qrCode;
        qrCodeInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    updatePreview(e.target.result);
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    // Payment instructions form
    const instructionsForm = document.getElementById('payment-instructions');
    if (instructionsForm) {
        instructionsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            paymentSettings.instructions = instructionsForm.instructions.value;
            savePaymentSettings();
            showSnackbar('Payment instructions saved successfully');
        });
    }

    // Support settings form
    const supportForm = document.getElementById('support-settings');
    if (supportForm) {
        supportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            paymentSettings.telegramLink = supportForm.telegramLink.value;
            paymentSettings.supportMessage = supportForm.supportMessage.value;
            savePaymentSettings();
            showSnackbar('Support settings saved successfully');
        });
    }
}

// Save payment settings to localStorage
function savePaymentSettings() {
    localStorage.setItem('paymentSettings', JSON.stringify(paymentSettings));
}

// Helper function to update QR code preview
function updatePreview(src) {
    const preview = document.querySelector('.file-upload .preview');
    preview.innerHTML = `<img src="${src}" alt="UPI QR Code">`;
}

// Helper function to show snackbar
function showSnackbar(message) {
    const snackbarContainer = document.querySelector('.mdl-js-snackbar');
    snackbarContainer.MaterialSnackbar.showSnackbar({ message });
}

// Helper function to format date
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Copy UPI ID to clipboard
function copyUpiId() {
    const upiId = document.getElementById('upi-id').value;
    navigator.clipboard.writeText(upiId).then(() => {
        showSnackbar('UPI ID copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy UPI ID:', err);
        showSnackbar('Failed to copy UPI ID');
    });
}

// Initialize payment settings
function initializePaymentSettings() {
    // Load saved settings or use defaults
    const savedSettings = localStorage.getItem('paymentSettings');
    paymentSettings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;

    // Set initial values
    document.getElementById('upi-id-input').value = paymentSettings.upiId;
    document.getElementById('payment-instructions').value = paymentSettings.instructions;
    document.getElementById('telegram-link').value = paymentSettings.telegramLink;

    // Show current QR code
    const qrPreview = document.getElementById('qr-preview');
    qrPreview.src = paymentSettings.qrCodeUrl;
    qrPreview.style.display = 'block';

    // Show current video if exists
    const videoPreview = document.getElementById('video-preview');
    const deleteVideoBtn = document.getElementById('delete-video');
    if (paymentSettings.videoUrl) {
        videoPreview.src = paymentSettings.videoUrl;
        videoPreview.style.display = 'block';
        deleteVideoBtn.style.display = 'inline-block';
    } else {
        videoPreview.style.display = 'none';
        deleteVideoBtn.style.display = 'none';
    }

    // Handle QR code upload
    const qrUpload = document.getElementById('qr-upload');
    qrUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const qrPreview = document.getElementById('qr-preview');
                    qrPreview.src = e.target.result;
                    qrPreview.style.display = 'block';
                    paymentSettings.qrCodeUrl = e.target.result;
                    savePaymentSettings();
                    showSnackbar('QR code updated successfully');
                };
                reader.readAsDataURL(file);
            } else {
                showSnackbar('Please upload an image file');
            }
        }
    });

    // Handle video upload
    const videoUpload = document.getElementById('video-upload');
    videoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                showSnackbar('Video size must be less than 10MB');
                return;
            }

            if (file.type.startsWith('video/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    videoPreview.src = e.target.result;
                    videoPreview.style.display = 'block';
                    deleteVideoBtn.style.display = 'inline-block';
                    paymentSettings.videoUrl = e.target.result;
                    savePaymentSettings();
                    showSnackbar('Tutorial video updated successfully');
                };
                reader.readAsDataURL(file);
            } else {
                showSnackbar('Please upload a video file');
            }
        }
    });

    // Handle delete video
    deleteVideoBtn.addEventListener('click', () => {
        videoPreview.src = '';
        videoPreview.style.display = 'none';
        deleteVideoBtn.style.display = 'none';
        paymentSettings.videoUrl = '';
        savePaymentSettings();
        showSnackbar('Tutorial video deleted successfully');
    });

    // Handle save settings
    const saveButton = document.getElementById('save-payment-settings');
    saveButton.addEventListener('click', () => {
        paymentSettings.upiId = document.getElementById('upi-id-input').value;
        paymentSettings.instructions = document.getElementById('payment-instructions').value;
        paymentSettings.telegramLink = document.getElementById('telegram-link').value;
        
        savePaymentSettings();
        showSnackbar('Payment settings saved successfully');
    });
}

// Initialize UC packs
function initializeUcPacks() {
    // Load saved packs or use defaults
    const savedPacks = localStorage.getItem('ucPacks');
    const ucPacks = savedPacks ? JSON.parse(savedPacks) : defaultUcPacks;
    
    // Save default packs if none exist
    if (!savedPacks) {
        localStorage.setItem('ucPacks', JSON.stringify(ucPacks));
    }

    // Render UC packs table
    renderUcPacksTable(ucPacks);

    // Handle form submission
    const form = document.getElementById('uc-pack-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const packId = document.getElementById('pack-id-input').value;
        const ucAmount = parseInt(document.getElementById('uc-amount-input').value);
        const bonusUc = parseInt(document.getElementById('bonus-uc-input').value);
        const price = parseInt(document.getElementById('price-input').value);

        if (!ucAmount || !price) {
            showSnackbar('Please fill all required fields');
            return;
        }

        const pack = {
            id: packId ? parseInt(packId) : Math.max(...ucPacks.map(p => p.id), 0) + 1,
            ucAmount,
            bonusUc: bonusUc || 0,
            price
        };

        // Update or add pack
        const packIndex = ucPacks.findIndex(p => p.id === pack.id);
        if (packIndex !== -1) {
            ucPacks[packIndex] = pack;
            showSnackbar('UC pack updated successfully');
        } else {
            ucPacks.push(pack);
            showSnackbar('UC pack added successfully');
        }

        // Save and refresh
        localStorage.setItem('ucPacks', JSON.stringify(ucPacks));
        renderUcPacksTable(ucPacks);
        form.reset();
        document.getElementById('pack-id-input').value = '';
        document.getElementById('cancel-edit').style.display = 'none';
    });

    // Handle cancel edit
    document.getElementById('cancel-edit').addEventListener('click', () => {
        form.reset();
        document.getElementById('pack-id-input').value = '';
        document.getElementById('cancel-edit').style.display = 'none';
    });
}

// Render UC packs table
function renderUcPacksTable(ucPacks) {
    const tbody = document.getElementById('uc-packs-table-body');
    tbody.innerHTML = '';

    ucPacks.forEach(pack => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="mdl-data-table__cell--non-numeric">${pack.id}</td>
            <td class="mdl-data-table__cell--non-numeric">${pack.ucAmount}</td>
            <td class="mdl-data-table__cell--non-numeric">${pack.bonusUc}</td>
            <td class="mdl-data-table__cell--non-numeric">₹${pack.price}</td>
            <td class="mdl-data-table__cell--non-numeric">
                <button class="mdl-button mdl-js-button mdl-button--icon edit-pack" data-pack-id="${pack.id}">
                    <i class="material-icons">edit</i>
                </button>
                <button class="mdl-button mdl-js-button mdl-button--icon delete-pack" data-pack-id="${pack.id}">
                    <i class="material-icons">delete</i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);

        // Handle edit button
        tr.querySelector('.edit-pack').addEventListener('click', () => {
            document.getElementById('pack-id-input').value = pack.id;
            document.getElementById('uc-amount-input').value = pack.ucAmount;
            document.getElementById('bonus-uc-input').value = pack.bonusUc;
            document.getElementById('price-input').value = pack.price;
            document.getElementById('cancel-edit').style.display = 'inline-block';
            // Update MDL textfields
            document.querySelectorAll('.mdl-textfield').forEach(field => {
                field.classList.add('is-dirty');
            });
        });

        // Handle delete button
        tr.querySelector('.delete-pack').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this UC pack?')) {
                const packIndex = ucPacks.findIndex(p => p.id === pack.id);
                if (packIndex !== -1) {
                    ucPacks.splice(packIndex, 1);
                    localStorage.setItem('ucPacks', JSON.stringify(ucPacks));
                    renderUcPacksTable(ucPacks);
                    showSnackbar('UC pack deleted successfully');
                }
            }
        });
    });
}

// Initialize dashboard
function initializeDashboard() {
    updateDashboardStats();
    setInterval(updateDashboardStats, 30000); // Update every 30 seconds
}

// Update dashboard stats
function updateDashboardStats() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalRevenue = orders
        .filter(o => o.status === 'completed')
        .reduce((sum, order) => sum + order.pack.price, 0);

    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('pending-orders').textContent = pendingOrders;
    document.getElementById('completed-orders').textContent = completedOrders;
    document.getElementById('total-revenue').textContent = `₹${totalRevenue}`;

    // Add animation class
    ['total-orders', 'pending-orders', 'completed-orders', 'total-revenue'].forEach(id => {
        const element = document.getElementById(id);
        element.classList.add('stat-updated');
        setTimeout(() => element.classList.remove('stat-updated'), 1000);
    });
}

// Initialize tabs with ripple effect
function initializeTabs() {
    const tabs = document.querySelectorAll('.mdl-layout__tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute('href').substring(1);
            switchTab(targetId);
        });
    });

    // Set initial tab from URL hash or default to dashboard
    const initialTab = window.location.hash.substring(1) || 'dashboard';
    switchTab(initialTab);
}

// Switch tabs with smooth animation
function switchTab(tabId) {
    const tabs = document.querySelectorAll('.mdl-layout__tab');
    const sections = document.querySelectorAll('main > section');

    tabs.forEach(tab => {
        if (tab.getAttribute('href') === `#${tabId}`) {
            tab.classList.add('is-active');
        } else {
            tab.classList.remove('is-active');
        }
    });

    sections.forEach(section => {
        if (section.id === tabId) {
            section.style.display = 'block';
            setTimeout(() => {
                section.classList.add('is-active');
            }, 50);
        } else {
            section.classList.remove('is-active');
            section.style.display = 'none';
        }
    });

    // Update URL hash without scrolling
    window.history.pushState(null, '', `#${tabId}`);
    
    // Refresh content of the active tab
    refreshTabContent(tabId);
}

// Refresh tab content
function refreshTabContent(tabId) {
    switch (tabId) {
        case 'dashboard':
            updateDashboardStats();
            break;
        case 'uc-packs':
            loadUcPacks();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'settings':
            loadPaymentSettings();
            break;
    }
}

// Add ripple effect to buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.mdl-button');
    buttons.forEach(button => {
        if (!button.classList.contains('mdl-js-ripple-effect')) {
            button.classList.add('mdl-js-ripple-effect');
            componentHandler.upgradeElement(button);
        }
    });
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initializeDashboard();
    initializeTabs();
    loadUcPacks();
    loadOrders();
    loadPaymentSettings();
    
    // Add ripple effect to all buttons
    addRippleEffect();
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.mdl-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Add click effect to action buttons
    const actionButtons = document.querySelectorAll('.mdl-button--icon');
    actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            button.appendChild(ripple);
            
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            setTimeout(() => ripple.remove(), 1000);
        });
    });
    
    // Initialize Material Design Lite components
    componentHandler.upgradeDom();
});

// Theme and Store Customization
function initializeCustomization() {
    // Load saved settings
    loadThemeSettings();
    loadStoreSettings();
    
    // Initialize form handlers
    document.getElementById('theme-settings-form').addEventListener('submit', saveThemeSettings);
    document.getElementById('store-settings-form').addEventListener('submit', saveStoreSettings);
    document.getElementById('reset-theme').addEventListener('click', resetThemeToDefault);
    
    // Initialize file upload previews
    initializeFileUploads();
    
    // Initialize color pickers
    initializeColorPickers();
}

function loadThemeSettings() {
    const defaultSettings = {
        primaryColor: '#4285f4',
        secondaryColor: '#34a853',
        backgroundColor: '#f5f5f5',
        enableAnimations: true,
        enable3dEffects: true,
        enableBlurEffects: true,
        cardRadius: '8',
        shadowIntensity: 'medium',
        fontSize: 'medium',
        fontFamily: 'Roboto'
    };
    
    const savedSettings = JSON.parse(localStorage.getItem('themeSettings') || JSON.stringify(defaultSettings));
    
    // Apply saved settings to form
    document.getElementById('primary-color').value = savedSettings.primaryColor;
    document.getElementById('secondary-color').value = savedSettings.secondaryColor;
    document.getElementById('background-color').value = savedSettings.backgroundColor;
    document.getElementById('enable-animations').checked = savedSettings.enableAnimations;
    document.getElementById('enable-3d-effects').checked = savedSettings.enable3dEffects;
    document.getElementById('enable-blur-effects').checked = savedSettings.enableBlurEffects;
    document.getElementById('card-radius').value = savedSettings.cardRadius;
    document.getElementById('shadow-intensity').value = savedSettings.shadowIntensity;
    document.getElementById('font-size').value = savedSettings.fontSize;
    document.getElementById('font-family').value = savedSettings.fontFamily;
    
    // Apply theme to page
    applyTheme(savedSettings);
}

function applyTheme(settings) {
    const root = document.documentElement;
    
    // Apply colors
    root.style.setProperty('--primary-color', settings.primaryColor);
    root.style.setProperty('--secondary-color', settings.secondaryColor);
    root.style.setProperty('--background-color', settings.backgroundColor);
    
    // Apply effects
    document.body.classList.toggle('disable-animations', !settings.enableAnimations);
    document.body.classList.toggle('disable-3d-effects', !settings.enable3dEffects);
    document.body.classList.toggle('disable-blur-effects', !settings.enableBlurEffects);
    
    // Apply layout settings
    root.style.setProperty('--card-radius', `${settings.cardRadius}px`);
    
    // Apply shadow intensity
    const shadowIntensities = {
        light: '0 4px 8px rgba(0,0,0,0.1)',
        medium: '0 8px 16px rgba(0,0,0,0.1)',
        heavy: '0 12px 24px rgba(0,0,0,0.15)'
    };
    root.style.setProperty('--card-shadow', shadowIntensities[settings.shadowIntensity]);
    
    // Apply typography
    const fontSizes = {
        small: '14px',
        medium: '16px',
        large: '18px'
    };
    root.style.setProperty('--base-font-size', fontSizes[settings.fontSize]);
    root.style.setProperty('--font-family', settings.fontFamily);
    
    // Load font if not Roboto
    if (settings.fontFamily !== 'Roboto') {
        loadGoogleFont(settings.fontFamily);
    }
}

function loadGoogleFont(fontFamily) {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@300;400;500;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

function saveThemeSettings(e) {
    e.preventDefault();
    
    const settings = {
        primaryColor: document.getElementById('primary-color').value,
        secondaryColor: document.getElementById('secondary-color').value,
        backgroundColor: document.getElementById('background-color').value,
        enableAnimations: document.getElementById('enable-animations').checked,
        enable3dEffects: document.getElementById('enable-3d-effects').checked,
        enableBlurEffects: document.getElementById('enable-blur-effects').checked,
        cardRadius: document.getElementById('card-radius').value,
        shadowIntensity: document.getElementById('shadow-intensity').value,
        fontSize: document.getElementById('font-size').value,
        fontFamily: document.getElementById('font-family').value
    };
    
    localStorage.setItem('themeSettings', JSON.stringify(settings));
    applyTheme(settings);
    
    showSnackbar('Theme settings saved successfully');
}

function resetThemeToDefault() {
    localStorage.removeItem('themeSettings');
    loadThemeSettings();
    showSnackbar('Theme reset to default');
}

function loadStoreSettings() {
    const defaultSettings = {
        storeName: 'BGMI UC Shop',
        storeDescription: '',
        contactEmail: '',
        telegramGroup: 'https://t.me/+uM6DXbWPPxYxMjY1',
        whatsapp: '',
        logo: null
    };
    
    const savedSettings = JSON.parse(localStorage.getItem('storeSettings') || JSON.stringify(defaultSettings));
    
    // Apply saved settings to form
    document.getElementById('store-name').value = savedSettings.storeName;
    document.getElementById('store-description').value = savedSettings.storeDescription;
    document.getElementById('contact-email').value = savedSettings.contactEmail;
    document.getElementById('telegram-group').value = savedSettings.telegramGroup;
    document.getElementById('whatsapp').value = savedSettings.whatsapp;
    
    // Display saved logo if exists
    if (savedSettings.logo) {
        document.getElementById('logo-preview').innerHTML = `<img src="${savedSettings.logo}" alt="Store Logo">`;
    }
}

function saveStoreSettings(e) {
    e.preventDefault();
    
    const settings = {
        storeName: document.getElementById('store-name').value,
        storeDescription: document.getElementById('store-description').value,
        contactEmail: document.getElementById('contact-email').value,
        telegramGroup: document.getElementById('telegram-group').value,
        whatsapp: document.getElementById('whatsapp').value,
        logo: document.getElementById('logo-preview').querySelector('img')?.src || null
    };
    
    localStorage.setItem('storeSettings', JSON.stringify(settings));
    applyStoreSettings(settings);
    
    showSnackbar('Store settings saved successfully');
}

function applyStoreSettings(settings) {
    // Update store name in header
    document.querySelector('.mdl-layout-title').textContent = settings.storeName;
    
    // Update telegram link
    const telegramLink = document.querySelector('a[title="Support Group"]');
    if (telegramLink) {
        telegramLink.href = settings.telegramGroup;
    }
}

function initializeFileUploads() {
    // QR Code upload
    const qrInput = document.getElementById('qr-code');
    const qrPreview = document.getElementById('qr-preview');
    
    qrInput.addEventListener('change', function(e) {
        handleImageUpload(e, qrPreview);
    });
    
    // Logo upload
    const logoInput = document.getElementById('store-logo');
    const logoPreview = document.getElementById('logo-preview');
    
    logoInput.addEventListener('change', function(e) {
        handleImageUpload(e, logoPreview);
    });
}

function handleImageUpload(e, previewElement) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewElement.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="mdl-button mdl-js-button mdl-button--icon" onclick="removeImage(this.parentElement)">
                    <i class="material-icons">close</i>
                </button>
            `;
        };
        reader.readAsDataURL(file);
    }
}

function removeImage(previewElement) {
    previewElement.innerHTML = '';
    // Clear the file input
    const inputId = previewElement.id.replace('-preview', '');
    document.getElementById(inputId).value = '';
}

function initializeColorPickers() {
    const colorPickers = document.querySelectorAll('.color-picker');
    colorPickers.forEach(picker => {
        picker.addEventListener('input', function(e) {
            // Preview color change in real-time
            const property = `--${e.target.id.replace('-', '-')}`;
            document.documentElement.style.setProperty(property, e.target.value);
        });
    });
}

// Initialize customization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCustomization();
});
