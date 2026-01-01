/* ============================================
   TRANSACTION HISTORY PAGE - JAVASCRIPT
-----------------------------------------------
    Author: Siti Norlie Yana
    Date: 1 January 2026
    Tested by:
    Updated by:
    Description:
        Handles transaction display and filtering, including:
        - Rendering transaction table dynamically
        - Filtering by status (All / Successful / Unsuccessful)
        - Downloading invoices
        - Showing empty state when no transactions
        - Persisting and retrieving data from localStorage
   ============================================ */


// Transaction state
const TransactionState = {
    transactions: [],
    filteredTransactions: [],
    currentFilter: 'all',
    dateRange: {
        start: new Date('2024-09-09'),
        end: new Date('2024-09-15')
    }
};

/* ============================================
   TRANSACTION DATA
   ============================================ */

/**
 * Initialize transactions data
 */
function initTransactionsData() {
    // Sample transactions - in a real app, fetch from API/database
    TransactionState.transactions = [
        {
            id: 'ABDC456789356',
            date: new Date('2024-09-09T04:30:00'),
            product: 'Standard Plan',
            paymentType: 'Online Banking',
            amount: 15.98,
            currency: 'RM',
            status: 'successful'
        },
        {
            id: 'ABCD456789356',
            date: new Date('2024-09-08T03:13:00'),
            product: 'Premium Plan',
            paymentType: 'Online Banking',
            amount: 29.99,
            currency: 'RM',
            status: 'successful'
        },
        {
            id: 'JKLM456789356',
            date: new Date('2024-09-07T13:00:00'),
            product: 'Professor Wolf',
            paymentType: 'Debit Card',
            amount: 5.98,
            currency: 'RM',
            status: 'unsuccessful'
        },
        {
            id: 'SWFG456789356',
            date: new Date('2024-09-06T07:00:00'),
            product: 'Professor Dragon',
            paymentType: 'Debit Card',
            amount: 5.99,
            currency: 'RM',
            status: 'successful'
        }
    ];
    
    TransactionState.filteredTransactions = [...TransactionState.transactions];
}

/* ============================================
   RENDER FUNCTIONS
   ============================================ */

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
function formatTransactionDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    return date.toLocaleDateString('en-US', options).replace(',', ', ');
}

/**
 * Render transactions table
 */
function renderTransactions() {
    const tbody = document.getElementById('transactionsBody');
    const emptyState = document.getElementById('emptyState');
    
    if (!tbody) return;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Check if there are transactions to display
    if (TransactionState.filteredTransactions.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Render each transaction
    TransactionState.filteredTransactions.forEach((transaction, index) => {
        const row = createTransactionRow(transaction, index);
        tbody.appendChild(row);
    });
}

/**
 * Create a transaction row
 * @param {Object} transaction - Transaction data
 * @param {number} index - Row index
 * @returns {HTMLElement} - Table row element
 */
function createTransactionRow(transaction, index) {
    const row = document.createElement('tr');
    
    // Ref ID
    const refIdCell = document.createElement('td');
    refIdCell.className = 'ref-id';
    refIdCell.textContent = escapeHTML(transaction.id);
    row.appendChild(refIdCell);
    
    // Transaction Date
    const dateCell = document.createElement('td');
    dateCell.textContent = formatTransactionDate(transaction.date);
    row.appendChild(dateCell);
    
    // Product
    const productCell = document.createElement('td');
    productCell.textContent = escapeHTML(transaction.product);
    row.appendChild(productCell);
    
    // Payment Type
    const paymentCell = document.createElement('td');
    paymentCell.textContent = escapeHTML(transaction.paymentType);
    row.appendChild(paymentCell);
    
    // Amount
    const amountCell = document.createElement('td');
    amountCell.textContent = transaction.currency + transaction.amount.toFixed(2);
    row.appendChild(amountCell);
    
    // Status
    const statusCell = document.createElement('td');
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge status-${transaction.status}`;
    statusBadge.textContent = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);
    statusCell.appendChild(statusBadge);
    row.appendChild(statusCell);
    
    // Actions
    const actionsCell = document.createElement('td');
    const actionsMenu = createActionsMenu(transaction.id, index);
    actionsCell.appendChild(actionsMenu);
    row.appendChild(actionsCell);
    
    return row;
}

/**
 * Create actions menu
 * @param {string} transactionId - Transaction ID
 * @param {number} index - Transaction index
 * @returns {HTMLElement} - Actions menu element
 */
function createActionsMenu(transactionId, index) {
    const menuContainer = document.createElement('div');
    menuContainer.className = 'actions-menu';
    
    const btn = document.createElement('button');
    btn.className = 'actions-btn';
    btn.textContent = '⋮';
    btn.onclick = (e) => {
        e.stopPropagation();
        toggleActionsDropdown(index);
    };
    
    const dropdown = document.createElement('div');
    dropdown.className = 'actions-dropdown';
    dropdown.id = `dropdown-${index}`;
    
    const viewItem = document.createElement('div');
    viewItem.className = 'dropdown-item';
    viewItem.textContent = 'View Details';
    viewItem.onclick = () => viewTransactionDetails(transactionId);
    
    const downloadItem = document.createElement('div');
    downloadItem.className = 'dropdown-item';
    downloadItem.textContent = 'Download Invoice';
    downloadItem.onclick = () => downloadInvoice(transactionId);
    
    const reportItem = document.createElement('div');
    reportItem.className = 'dropdown-item';
    reportItem.textContent = 'Report Issue';
    reportItem.onclick = () => reportIssue(transactionId);
    
    dropdown.appendChild(viewItem);
    dropdown.appendChild(downloadItem);
    dropdown.appendChild(reportItem);
    
    menuContainer.appendChild(btn);
    menuContainer.appendChild(dropdown);
    
    return menuContainer;
}

/* ============================================
   FILTERING
   ============================================ */

/**
 * Apply filters to transactions
 */
function applyFilters() {
    let filtered = [...TransactionState.transactions];
    
    // Filter by status
    if (TransactionState.currentFilter !== 'all') {
        filtered = filtered.filter(t => t.status === TransactionState.currentFilter);
    }
    
    // Filter by date range (if needed)
    // filtered = filtered.filter(t => 
    //     t.date >= TransactionState.dateRange.start && 
    //     t.date <= TransactionState.dateRange.end
    // );
    
    TransactionState.filteredTransactions = filtered;
    renderTransactions();
}

/**
 * Handle filter tab click
 * @param {string} filter - Filter type
 */
function handleFilterClick(filter) {
    TransactionState.currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.filter === filter) {
            tab.classList.add('active');
        }
    });
    
    // Update select dropdown
    const statusSelect = document.getElementById('statusFilter');
    if (statusSelect) {
        statusSelect.value = filter;
    }
    
    applyFilters();
}

/**
 * Handle status dropdown change
 * @param {string} status - Selected status
 */
function handleStatusChange(status) {
    handleFilterClick(status);
}

/* ============================================
   ACTIONS
   ============================================ */

/**
 * Toggle actions dropdown
 * @param {number} index - Dropdown index
 */
function toggleActionsDropdown(index) {
    // Close all other dropdowns
    document.querySelectorAll('.actions-dropdown').forEach((dropdown, i) => {
        if (i !== index) {
            dropdown.classList.remove('show');
        }
    });
    
    // Toggle current dropdown
    const dropdown = document.getElementById(`dropdown-${index}`);
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

/**
 * View transaction details
 * @param {string} transactionId - Transaction ID
 */
function viewTransactionDetails(transactionId) {
    const transaction = TransactionState.transactions.find(t => t.id === transactionId);
    
    if (transaction) {
        const message = `Transaction Details
        ━━━━━━━━━━━━━━━━━━━━ 
        Ref ID: ${transaction.id}
        Date: ${formatTransactionDate(transaction.date)}
        Product: ${transaction.product}
        Payment: ${transaction.paymentType}
        Amount: ${transaction.currency}${transaction.amount.toFixed(2)}
        Status: ${transaction.status.toUpperCase()}
        `;
        alert(message);
    }
    
    closeAllDropdowns();
}

/**
 * Download invoice for a transaction
 * @param {string} transactionId - Transaction ID
 */
function downloadInvoice(transactionId) {
    const transaction = TransactionState.transactions.find(t => t.id === transactionId);
    
    if (transaction) {
        showToast(`Downloading invoice for ${transaction.id}...`, 'info');
        
        // In a real app, this would generate and download a PDF
        console.log('Downloading invoice:', transactionId);
    }
    
    closeAllDropdowns();
}

/**
 * Report an issue with a transaction
 * @param {string} transactionId - Transaction ID
 */
function reportIssue(transactionId) {
    const issue = prompt(`Report an issue with transaction ${transactionId}:\n\nPlease describe the problem:`);
    
    if (issue) {
        showToast('Issue reported successfully. We will contact you soon.', 'success');
        console.log('Issue reported for:', transactionId, issue);
    }
    
    closeAllDropdowns();
}

/**
 * Download all invoices
 */
function downloadAllInvoices() {
    showToast('Preparing invoices for download...', 'info');
    
    // In a real app, this would generate a ZIP file of all invoices
    setTimeout(() => {
        showToast('Invoices downloaded successfully!', 'success');
    }, 1500);
    
    console.log('Downloading all invoices for date range:', 
        TransactionState.dateRange.start, 
        'to', 
        TransactionState.dateRange.end
    );
}

/**
 * Close all action dropdowns
 */
function closeAllDropdowns() {
    document.querySelectorAll('.actions-dropdown').forEach(dropdown => {
        dropdown.classList.remove('show');
    });
}

/* ============================================
   DATE RANGE
   ============================================ */

/**
 * Update date range display
 */
function updateDateRangeDisplay() {
    const dateRangeText = document.getElementById('dateRangeText');
    
    if (dateRangeText) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const startStr = TransactionState.dateRange.start.toLocaleDateString('en-US', options);
        const endStr = TransactionState.dateRange.end.toLocaleDateString('en-US', options);
        
        dateRangeText.textContent = `${startStr} - ${endStr}`;
    }
}

/**
 * Change date range (for future implementation)
 */
function changeDateRange() {
    // In a real app, this would open a date picker
    alert('Date range picker would open here. Feature coming soon!');
}

/* ============================================
   EVENT LISTENERS
   ============================================ */

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            handleFilterClick(tab.dataset.filter);
        });
    });
    
    // Status dropdown
    const statusSelect = document.getElementById('statusFilter');
    if (statusSelect) {
        statusSelect.addEventListener('change', (e) => {
            handleStatusChange(e.target.value);
        });
    }
    
    // Download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadAllInvoices);
    }
    
    // Date range (for future implementation)
    const dateRange = document.querySelector('.date-range');
    if (dateRange) {
        dateRange.style.cursor = 'pointer';
        dateRange.addEventListener('click', changeDateRange);
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.actions-menu')) {
            closeAllDropdowns();
        }
    });
}

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initialize transaction history page
 */
function initTransactionHistoryPage() {
    console.log('Initializing Transaction History page...');
    
    // Load transactions data
    initTransactionsData();
    
    // Update date range display
    updateDateRangeDisplay();
    
    // Setup event listeners
    setupEventListeners();
    
    // Render transactions
    renderTransactions();
    
    console.log('Transaction History page initialized successfully');
}

/* ============================================
   PAGE LOAD
   ============================================ */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'transaction-history.html') {
        initTransactionHistoryPage();
    }
});