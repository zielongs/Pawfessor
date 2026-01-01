/* ============================================
    SUBSCRIPTION PAGE
-----------------------------------------------
    Author: Siti Norlie Yana
    Date: 31 December 2025
    Tested by:
    Updated by:
    Description:
    Handles subscription management and billing
   ============================================ */

// Subscription state
const SubscriptionState = {
    currentPlan: {
        name: 'Standard Plan',
        price: 5.99,
        currency: 'RM',
        billingCycle: 'month',
        nextBillingDate: '12 Oct 2025',
        status: 'active'
    },
    autoRenew: true,
    paymentMethod: {
        type: 'Visa',
        last4: '1234'
    }
};

// Available plans
const AvailablePlans = {
    free: {
        name: 'Free Plan',
        price: 0,
        features: ['Basic task management', '5 tasks limit', 'Standard reminders']
    },
    standard: {
        name: 'Standard Plan',
        price: 5.99,
        features: ['Unlimited tasks', 'Custom reminders', 'Priority support', 'Ad-free experience']
    },
    premium: {
        name: 'Premium Plan',
        price: 15.99,
        features: ['Everything in Standard', 'AI-powered insights', 'Team collaboration', 'Advanced analytics', 'Custom themes']
    }
};

/* ============================================
   DISPLAY FUNCTIONS
   ============================================ */

/**
 * Load and display subscription data
 */
function loadSubscriptionData() {
    // Load from localStorage if available
    const savedSubscription = localStorage.getItem('userSubscription');
    if (savedSubscription) {
        const savedData = JSON.parse(savedSubscription);
        if (savedData.planName) {
            updateSubscriptionDisplay(savedData.planName);
        }
    }
    
    // Update display
    updateCurrentPlanDisplay();
}

/**
 * Update current plan display
 */
function updateCurrentPlanDisplay() {
    // Update plan name
    const planNameEl = document.getElementById('currentPlanName');
    if (planNameEl) {
        planNameEl.textContent = escapeHTML(SubscriptionState.currentPlan.name);
    }
    
    // Update price
    const priceEl = document.getElementById('planPrice');
    if (priceEl) {
        priceEl.textContent = SubscriptionState.currentPlan.currency + 
                              SubscriptionState.currentPlan.price.toFixed(2);
    }
    
    // Update next billing date
    const billingDateEl = document.getElementById('nextBillingDate');
    if (billingDateEl) {
        billingDateEl.textContent = escapeHTML(SubscriptionState.currentPlan.nextBillingDate);
    }
    
    // Update payment method
    const paymentMethodEl = document.getElementById('paymentMethod');
    if (paymentMethodEl) {
        paymentMethodEl.textContent = `${SubscriptionState.paymentMethod.type} **** ${SubscriptionState.paymentMethod.last4}`;
    }
    
    // Update auto-renew toggle
    const autoRenewToggle = document.getElementById('autoRenewToggle');
    const autoRenewLabel = document.getElementById('autoRenewLabel');
    
    if (autoRenewToggle && autoRenewLabel) {
        if (SubscriptionState.autoRenew) {
            autoRenewToggle.classList.add('active');
            autoRenewLabel.textContent = 'ON';
        } else {
            autoRenewToggle.classList.remove('active');
            autoRenewLabel.textContent = 'OFF';
        }
    }
}

/**
 * Update subscription to a new plan
 * @param {string} planKey - Plan key (free, standard, premium)
 */
function updateSubscriptionDisplay(planKey) {
    const plan = AvailablePlans[planKey];
    
    if (plan) {
        SubscriptionState.currentPlan.name = plan.name;
        SubscriptionState.currentPlan.price = plan.price;
        
        // Calculate next billing date (30 days from now)
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 30);
        SubscriptionState.currentPlan.nextBillingDate = nextDate.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        
        // Save to localStorage
        localStorage.setItem('userSubscription', planKey);
        
        updateCurrentPlanDisplay();
    }
}

/* ============================================
   AUTO RENEW TOGGLE
   ============================================ */

/**
 * Toggle auto-renew subscription
 */
function toggleAutoRenew() {
    SubscriptionState.autoRenew = !SubscriptionState.autoRenew;
    
    const autoRenewToggle = document.getElementById('autoRenewToggle');
    const autoRenewLabel = document.getElementById('autoRenewLabel');
    
    if (autoRenewToggle && autoRenewLabel) {
        if (SubscriptionState.autoRenew) {
            autoRenewToggle.classList.add('active');
            autoRenewLabel.textContent = 'ON';
            showToast('Auto-renewal enabled', 'success');
        } else {
            autoRenewToggle.classList.remove('active');
            autoRenewLabel.textContent = 'OFF';
            showToast('Auto-renewal disabled', 'info');
        }
    }
    
    console.log('Auto-renew:', SubscriptionState.autoRenew);
}

/* ============================================
   PAYMENT METHOD
   ============================================ */

/**
 * Edit payment method
 */
function editPaymentMethod() {
    const cardOptions = [
        'Visa **** 1234',
        'Mastercard **** 5678',
        'Visa **** 9012',
        'Online Banking'
    ];
    
    const message = `
Select Payment Method:

1. ${cardOptions[0]}
2. ${cardOptions[1]}
3. ${cardOptions[2]}
4. ${cardOptions[3]}
5. Add New Card

Enter number (1-5):`;
    
    const choice = prompt(message);
    
    if (choice === '5') {
        // Add new card
        const newCard = prompt('Enter new card number (last 4 digits):');
        if (newCard && newCard.length === 4 && !isNaN(newCard)) {
            SubscriptionState.paymentMethod.last4 = validateInput(newCard);
            updateCurrentPlanDisplay();
            showToast('Payment method updated successfully!', 'success');
        } else {
            showToast('Invalid card number', 'error');
        }
    } else if (choice >= '1' && choice <= '4') {
        // Update payment method
        const selected = cardOptions[parseInt(choice) - 1];
        const parts = selected.split('**** ');
        
        if (parts.length === 2) {
            SubscriptionState.paymentMethod.type = parts[0].trim();
            SubscriptionState.paymentMethod.last4 = parts[1];
        } else {
            SubscriptionState.paymentMethod.type = 'Online Banking';
            SubscriptionState.paymentMethod.last4 = '';
        }
        
        updateCurrentPlanDisplay();
        showToast('Payment method updated!', 'success');
    }
}

/* ============================================
   UPGRADE PLAN
   ============================================ */

/**
 * Show upgrade plan options
 */
function showUpgradePlanOptions() {
    const message = `
Choose Your Plan:

1. FREE Plan - RM0/month
   • Basic task management
   • 5 tasks limit
   • Standard reminders

2. STANDARD Plan - RM5.99/month (Current)
   • Unlimited tasks
   • Custom reminders
   • Priority support
   • Ad-free experience

3. PREMIUM Plan - RM15.99/month
   • Everything in Standard
   • AI-powered insights
   • Team collaboration
   • Advanced analytics
   • Custom themes

Enter number (1-3):`;
    
    const choice = prompt(message);
    
    if (choice === '1') {
        downgradeToPlan('free');
    } else if (choice === '2') {
        showToast('You are already on the Standard Plan', 'info');
    } else if (choice === '3') {
        upgradeToPlan('premium');
    }
}

/**
 * Upgrade to a plan
 * @param {string} planKey - Plan to upgrade to
 */
function upgradeToPlan(planKey) {
    const plan = AvailablePlans[planKey];
    
    if (!plan) return;
    
    const confirmMsg = `
Upgrade to ${plan.name}?

Price: RM${plan.price.toFixed(2)}/month

Features:
${plan.features.map(f => '• ' + f).join('\n')}

Click OK to confirm upgrade.`;
    
    if (confirm(confirmMsg)) {
        // Process upgrade
        updateSubscriptionDisplay(planKey);
        
        // Create transaction record
        createTransaction(plan.name, plan.price);
        
        showToast(`Successfully upgraded to ${plan.name}!`, 'success');
        
        console.log('Upgraded to:', planKey);
    }
}

/**
 * Downgrade to a plan
 * @param {string} planKey - Plan to downgrade to
 */
function downgradeToPlan(planKey) {
    const plan = AvailablePlans[planKey];
    
    if (!plan) return;
    
    const confirmMsg = `
Downgrade to ${plan.name}?

You will lose access to:
• Custom reminders
• Priority support
• Premium features

Your subscription will change at the end of current billing period.

Click OK to confirm downgrade.`;
    
    if (confirm(confirmMsg)) {
        updateSubscriptionDisplay(planKey);
        showToast(`Subscription will change to ${plan.name} on next billing date`, 'info');
        
        console.log('Downgraded to:', planKey);
    }
}

/* ============================================
   CANCEL SUBSCRIPTION
   ============================================ */

/**
 * Cancel subscription
 */
function cancelSubscription() {
    const confirmMsg = `
Are you sure you want to cancel your subscription?

You will lose access to:
• Unlimited tasks
• Custom reminders
• Priority support
• All premium features

Your subscription will remain active until: ${SubscriptionState.currentPlan.nextBillingDate}

Type "CANCEL" to confirm:`;
    
    const confirmation = prompt(confirmMsg);
    
    if (confirmation && confirmation.toUpperCase() === 'CANCEL') {
        // Process cancellation
        SubscriptionState.currentPlan.status = 'cancelled';
        SubscriptionState.autoRenew = false;
        
        updateCurrentPlanDisplay();
        
        showToast('Subscription cancelled. You can reactivate anytime before the end of billing period.', 'info');
        
        // Update localStorage
        updateSubscriptionDisplay('free');
        
        console.log('Subscription cancelled');
        
        // Show reactivation option
        setTimeout(() => {
            if (confirm('Would you like to reactivate your subscription?')) {
                reactivateSubscription();
            }
        }, 2000);
    } else {
        showToast('Cancellation aborted', 'info');
    }
}

/**
 * Reactivate subscription
 */
function reactivateSubscription() {
    SubscriptionState.currentPlan.status = 'active';
    SubscriptionState.autoRenew = true;
    
    updateCurrentPlanDisplay();
    showToast('Subscription reactivated!', 'success');
    
    console.log('Subscription reactivated');
}

/* ============================================
   TRANSACTION HELPER
   ============================================ */

/**
 * Create a transaction record
 * @param {string} product - Product name
 * @param {number} amount - Transaction amount
 */
function createTransaction(product, amount) {
    // Get existing transactions
    let transactions = [];
    const stored = localStorage.getItem('transactions');
    
    if (stored) {
        try {
            transactions = JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing transactions:', e);
        }
    }
    
    // Create new transaction
    const transaction = {
        id: 'SUB' + Date.now(),
        date: new Date(),
        product: product,
        paymentType: SubscriptionState.paymentMethod.type,
        amount: amount,
        currency: 'RM',
        status: 'successful'
    };
    
    // Add to transactions
    transactions.unshift(transaction);
    
    // Save to localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    console.log('Transaction created:', transaction);
}

/* ============================================
   EVENT LISTENERS
   ============================================ */

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Auto-renew toggle
    const autoRenewToggle = document.getElementById('autoRenewToggle');
    if (autoRenewToggle) {
        autoRenewToggle.addEventListener('click', toggleAutoRenew);
    }
    
    // Edit payment method
    const editPaymentBtn = document.getElementById('editPaymentBtn');
    if (editPaymentBtn) {
        editPaymentBtn.addEventListener('click', editPaymentMethod);
    }
    
    // Upgrade plan button
    const upgradePlanBtn = document.getElementById('upgradePlanBtn');
    if (upgradePlanBtn) {
        upgradePlanBtn.addEventListener('click', showUpgradePlanOptions);
    }
    
    // Cancel subscription button
    const cancelSubscriptionBtn = document.getElementById('cancelSubscriptionBtn');
    if (cancelSubscriptionBtn) {
        cancelSubscriptionBtn.addEventListener('click', cancelSubscription);
    }
}

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initialize subscriptions page
 */
function initSubscriptionsPage() {
    console.log('Initializing Subscriptions page...');
    
    // Load subscription data
    loadSubscriptionData();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('Subscriptions page initialized successfully');
}

/* ============================================
   PAGE LOAD
   ============================================ */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'subscriptions.html') {
        initSubscriptionsPage();
    }
});