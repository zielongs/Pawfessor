/* ===================================================
     MASCOT STORE PAGE - JavaScript
     ---------------------------------------------------
    Author: Noraziela Binti Jepsin
    Date: 31 December 2025
    Tested by: 
    Updated by:

=================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const mascotCards = document.querySelectorAll('.mascot-card');
    const checkboxes = document.querySelectorAll('.filter-checkbox input');

    // ============================================
    // 1. FILTERING LOGIC
    // ============================================
    function updateFilters() {
        const activeTiers = Array.from(checkboxes)
            .filter(i => i.checked)
            .map(i => i.id.replace('filter', '').toLowerCase());

        mascotCards.forEach(card => {
            const cardTier = card.getAttribute('data-tier');
            // Show card if 'All' is selected or if its specific tier matches
            if (activeTiers.includes('all') || activeTiers.includes(cardTier)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    checkboxes.forEach(box => {
        box.addEventListener('change', (e) => {
            if (e.target.id === 'filterAll' && e.target.checked) {
                // Uncheck others if "All" is selected
                checkboxes.forEach(b => { if(b.id !== 'filterAll') b.checked = false; });
            } else if (e.target.checked) {
                // Uncheck "All" if a specific tier is selected
                const allBox = document.getElementById('filterAll');
                if(allBox) allBox.checked = false;
            }
            updateFilters();
        });
    });

    // ============================================
    // 2. INTERACTION LOGIC (Browser Alerts Only)
    // ============================================
    
    // Add to Cart Button Logic
    document.querySelectorAll('.cart-add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // e.stopPropagation() is critical: it stops the "Viewing details" 
            // alert from the card background from appearing at the same time.
            e.stopPropagation(); 
            
            const card = btn.closest('.mascot-card');
            const mascotName = card.querySelector('.mascot-name').textContent;

            // Standard browser alert
            alert("successfully added to cart");

            // Save to localStorage for use in your carts page
            let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
            if (!cart.some(item => item.name === mascotName)) {
                cart.push({ 
                    name: mascotName, 
                    addedAt: new Date().toISOString() 
                });
                localStorage.setItem('shoppingCart', JSON.stringify(cart));
            }
        });
    });

    // Upgrade and Unlock Button Logic
    document.querySelectorAll('.upgrade-btn, .status-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Stops the "Viewing details" alert from triggering
            e.stopPropagation(); 
            
            // If the button says "Equipped", we don't need an alert
            if (btn.classList.contains('equipped')) return;

            const card = btn.closest('.mascot-card');
            const tier = card.getAttribute('data-tier');

            // Specific alerts as requested
            if (tier === 'basic') {
                alert("Not unlocked yet!");
            } else if (tier === 'standard') {
                alert("Upgrade to standard plan or buy separately!");
            } else if (tier === 'premium') {
                alert("Upgrade to premium plan or buy separately!");
            }
        });
    });

    // ============================================
    // 3. CARD BACKGROUND CLICK (View Details)
    // ============================================
    mascotCards.forEach(card => {
        card.addEventListener('click', function() {
            const name = this.querySelector('.mascot-name').textContent;
            alert(`Viewing details for ${name}`);
        });
    });
});