    /* ============================================
         WEEKLY VIEW PAGE - JavaScript
         Author: Noraziela Binti Jepsin
         Date: 31 December 2025
         Tested by:
         Updated by:

         ============================================ */

let currentDate = new Date(2025, 11, 21); // Starting at Dec 21, 2025 

function updateCalendar() {
    const monthDisplay = document.querySelector('.month-display');
    const dayNumbers = document.querySelectorAll('.day-number');
    
    // 1. Update the Month/Year Header
    const options = { month: 'long', year: 'numeric' };
    monthDisplay.textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

    // 2. Calculate the start of the week (Sunday)
    let startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    // 3. Update the day numbers 
    dayNumbers.forEach((slot, index) => {
        let day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + index);
        slot.textContent = day.getDate();
    });
}

// Event Listeners for your Buttons
document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.querySelector('.nav-arrows .arrow-btn:first-child');
    const nextBtn = document.querySelector('.nav-arrows .arrow-btn:last-child');
    const todayBtn = document.querySelector('.today-btn');

    prevBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        updateCalendar();
    });

    nextBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        updateCalendar();
    });

    todayBtn.addEventListener('click', () => {
        currentDate = new Date(); // Go to actual today
        updateCalendar();
    });

    updateCalendar(); // Initialize on load
});

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('.calendar-table tbody');

    tableBody.addEventListener('click', (e) => {
        // 1. Check if the user clicked an actual task (pill)
        const taskPill = e.target.closest('.event');
        
        if (taskPill) {
            // Redirect to the existing task details page
            window.location.href = 'tasks.html';
            return; // Stop the function here
        }

        // 2. Check if the user clicked a blank calendar cell
        const emptyCell = e.target.closest('.calendar-cell');
        
        if (emptyCell) {
            // Redirect to the add task page
            window.location.href = 'add-task.html';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const viewSelect = document.getElementById('viewSelect');

    viewSelect.addEventListener('change', (e) => {
        const selectedValue = e.target.value;

        if (selectedValue === 'month' || selectedValue === 'year') {
            // 1. Alert the user
            alert("✨ Premium Feature: Upgrade to Pawfessor Premium to access Month and Year views!");
            
            // 2. Reset the selector back to 'week'
            viewSelect.value = 'week';
            
            // 3. Optional: Redirect to a subscription page
            // window.location.href = 'subscriptions.html';
        }
    });

    // Existing click logic for cells
    const tableBody = document.querySelector('.calendar-table tbody');
    tableBody.addEventListener('click', (e) => {
        const taskPill = e.target.closest('.event');
        if (taskPill) {
            window.location.href = 'tasks.html';
            return;
        }

        const emptyCell = e.target.closest('.calendar-cell');
        if (emptyCell) {
            window.location.href = 'add-task.html';
        }
    });
});