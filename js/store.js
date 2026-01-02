/* ============================================
   MASCOT STORE PAGE - JAVASCRIPT
         Author: Noraziela Binti Jepsin
         Date: 31 December 2025
         Tested by: 
         Updated by: 

   Description:
   - Handles filter functionality for mascot tiers
   - Shows/hides mascots based on tier selection
   - Manages add to cart interactions
   - Handles mascot card click events
   - Stores user's mascot collection in localStorage
   ============================================ */


/* ============================================
   DOM ELEMENTS
   --------------------------------------------
   Get references to filter checkboxes and mascot cards
   ============================================ */
const filterAll = document.getElementById('filterAll');
const filterBasic = document.getElementById('filterBasic');
const filterStandard = document.getElementById('filterStandard');
const filterPremium = document.getElementById('filterPremium');
const mascotCards = document.querySelectorAll('.mascot-card');


/* ============================================
   FILTER EVENT LISTENERS
   ============================================ */

/**
 * Handle "All" filter checkbox
 * When checked, uncheck all other filters and show all mascots
 */
filterAll.addEventListener('change', function() {
    if (this.checked) {
        filterBasic.checked = false;
        filterStandard.checked = false;
        filterPremium.checked = false;
        showAllMascots();
    }
});

/**
 * Handle individual tier filters (Basic, Standard, Premium)
 * When any tier is checked, uncheck "All" filter
 */
[filterBasic, filterStandard, filterPremium].forEach(filter => {
    filter.addEventListener('change', function() {
        if (this.checked) {
            filterAll.checked = false;
        }
        filterMascots();
    });
});


/* ============================================
   FILTER FUNCTIONS
   ============================================ */

/**
 * Shows all mascot cards regardless of tier
 */
function showAllMascots() {
    mascotCards.forEach(card => {
        card.style.display = 'block';
    });
}

/**
 * Filters mascots based on selected tier checkboxes
 * If no filters are selected, defaults to showing all
 */
function filterMascots() {
    const activeFilters = [];
    
    // Collect all checked tier filters
    if (filterBasic.checked) activeFilters.push('basic');
    if (filterStandard.checked) activeFilters.push('standard');
    if (filterPremium.checked) activeFilters.push('premium');

    // If no filters selected, show all mascots
    if (activeFilters.length === 0) {
        filterAll.checked = true;
        showAllMascots();
        return;
    }

    // Show/hide mascots based on active filters
    mascotCards.forEach(card => {
        const tier = card.getAttribute('data-tier');
        if (activeFilters.includes(tier)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}


/* ============================================
   ADD TO CART FUNCTIONALITY
   --------------------------------------------
   Handles adding mascots to shopping cart
   ============================================ */
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Prevent card click event from firing
        e.stopPropagation();
        
        // Get mascot information
        const card = this.closest('.mascot-card');
        const mascotName = card.querySelector('.mascot-name').textContent;
        const priceText = this.textContent;
        
        // Extract price from button text (e.g., "Buy for RM4.99 🛒" -> "RM4.99")
        const price = priceText.match(/RM\d+\.\d+/)[0];
        
        // Create cart item object
        const cartItem = {
            name: mascotName,
            price: price,
            type: 'mascot',
            tier: card.getAttribute('data-tier'),
            dateAdded: new Date().toISOString()
        };
        
        // Get existing cart from localStorage or create empty array
        let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
        
        // Check if item already in cart
        const existingItem = cart.find(item => item.name === mascotName);
        
        if (existingItem) {
            alert(`${mascotName} is already in your cart! 🛒`);
        } else {
            // Add to cart
            cart.push(cartItem);
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            alert(`${mascotName} added to cart! 🛒\nPrice: ${price}`);
        }
    });
});


/* ============================================
   MASCOT CARD CLICK FUNCTIONALITY
   --------------------------------------------
   Shows detailed information when clicking on a mascot card
   ============================================ */
mascotCards.forEach(card => {
    card.addEventListener('click', function() {
        const name = this.querySelector('.mascot-name').textContent;
        const tier = this.getAttribute('data-tier');
        const isLocked = this.classList.contains('locked');
        const status = this.querySelector('.mascot-status').textContent;
        
        // Create detail message
        let message = `
╔════════════════════════════════╗
  ${name}
╚════════════════════════════════╝

Tier: ${tier.charAt(0).toUpperCase() + tier.slice(1)}
Status: ${status}
${isLocked ? '\n🔒 This mascot is currently locked' : '✅ This mascot is available'}
        `;
        
        alert(message.trim());
    });
});


/* ============================================
   INITIALIZE ON PAGE LOAD
   --------------------------------------------
   Set up initial state when page loads
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
    // Ensure "All" filter is checked by default
    if (!filterBasic.checked && !filterStandard.checked && !filterPremium.checked) {
        filterAll.checked = true;
        showAllMascots();
    }
    
    // Load user's owned mascots from localStorage
    loadOwnedMascots();
});


/* ============================================
   LOAD OWNED MASCOTS
   --------------------------------------------
   Loads user's owned mascots from localStorage
   and updates the UI accordingly
   ============================================ */
function loadOwnedMascots() {
    const ownedMascots = JSON.parse(localStorage.getItem('ownedMascots') || '[]');
    
    mascotCards.forEach(card => {
        const mascotName = card.querySelector('.mascot-name').textContent;
        
        if (ownedMascots.includes(mascotName)) {
            // Remove locked class
            card.classList.remove('locked');
            
            // Update status to show it's owned
            const statusElement = card.querySelector('.mascot-status');
            statusElement.innerHTML = '<span class="unlock-badge">Owned</span>';
            
            // Remove buy button if it exists
            const buyBtn = card.querySelector('.buy-btn');
            if (buyBtn) {
                buyBtn.remove();
            }
        }
    });
}

const filters = {
    all: document.getElementById('filterAll'),
    basic: document.getElementById('filterBasic'),
    standard: document.getElementById('filterStandard'),
    premium: document.getElementById('filterPremium')
};

const cards = document.querySelectorAll('.mascot-card');

function filterMascots() {
    cards.forEach(card => {
        const tier = card.dataset.tier;
        // Show if "All" is checked, or if the specific tier matches
        if (filters.all.checked || filters[tier].checked) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

// Attach event listeners to all checkboxes
Object.values(filters).forEach(checkbox => {
    checkbox.addEventListener('change', filterMascots);
});

document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.filter-checkbox input');
    const cards = document.querySelectorAll('.mascot-card');

    function updateFilter() {
        const activeTiers = Array.from(checkboxes)
            .filter(i => i.checked)
            .map(i => i.id.replace('filter', '').toLowerCase());

        cards.forEach(card => {
            const cardTier = card.getAttribute('data-tier');
            
            // Show if 'All' is checked or if the specific tier is selected
            if (activeTiers.includes('all') || activeTiers.includes(cardTier)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    checkboxes.forEach(box => box.addEventListener('change', updateFilter));
});