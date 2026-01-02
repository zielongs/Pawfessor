    /* ============================================
         PROGRESS DASHBOARD PAGE - JavaScript
         Author: Noraziela Binti Jepsin
         Date: 31 December 2025
         Tested by:
         Updated by:

         ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Select the circle element
    const circle = document.getElementById('prog70');
    
    if (circle) {
        // Match the radius to the 'r' attribute in your HTML SVG (r=40)
        const radius = 40; 
        const circumference = 2 * Math.PI * radius;
        const percentage = 70;

        // Set initial styles for animation
        circle.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
        circle.style.strokeDasharray = circumference;
        
        // Start from empty
        circle.style.strokeDashoffset = circumference;

        // Small timeout to trigger the transition effect after page load
        setTimeout(() => {
            const offset = circumference - (percentage / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }, 100);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Existing Progress Circle Logic ---
    const circle = document.getElementById('prog70');
    if (circle) {
        const radius = 40; 
        const circumference = 2 * Math.PI * radius;
        const percentage = 70;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference - (percentage / 100) * circumference;
    }

    // --- NEW: Clickable Cards Logic ---
    // Select all types of task and item cards
    const cards = document.querySelectorAll('.task-card, .item-card');

    cards.forEach(card => {
        // Change cursor to a hand pointer so users know it's clickable
        card.style.cursor = 'pointer';

        card.addEventListener('click', () => {
            // Redirect to your add-task page
            window.location.href = 'tasks.html';
        });
    });
});