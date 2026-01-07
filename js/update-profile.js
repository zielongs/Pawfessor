    /* ============================================
         UPDATE PROFILE PAGE - JavaScript
         Author: Noraziela Binti Jepsin
         Date: 31 December 2025S
         Updated by:

         ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // --- 1. LOAD SAVED DATA INTO INPUTS ---
    const savedName = localStorage.getItem('userName');
    const savedPhone = localStorage.getItem('userPhone');
    const savedGender = localStorage.getItem('userGender');
    const savedDOB = localStorage.getItem('userDOB');

    // Fill Name
    if (savedName) {
        document.querySelector('.user-id').textContent = savedName; // Updates the header text
        const nameParts = savedName.split(' ');
        document.getElementById('firstNameInput').value = nameParts[0] || '';
        document.getElementById('lastNameInput').value = nameParts.slice(1).join(' ') || '';
    }

    // Fill Phone
    if (savedPhone) {
        document.querySelector('.phone-input-field').value = savedPhone;
    }

    // Fill Gender Select
    if (savedGender) {
        document.querySelector('.select-input').value = savedGender;
    }

    // Fill Date of Birth
    if (savedDOB) {
        const dateInput = document.querySelector('input[placeholder*="date"]');
        dateInput.value = savedDOB;
        dateInput.type = 'date'; // Changes from text to date if data exists
    }

    // --- 2. SAVE ALL DATA ON SUBMIT ---
    const updateForm = document.getElementById('updateProfileForm');
    updateForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect all values
        const first = document.getElementById('firstNameInput').value;
        const last = document.getElementById('lastNameInput').value;
        const phone = document.querySelector('.phone-input-field').value;
        const gender = document.querySelector('.select-input').value;
        const dob = document.querySelector('input[placeholder*="date"]').value;

        // Save everything to LocalStorage
        if (first || last) {
            localStorage.setItem('userName', (first + " " + last).trim());
        }
        localStorage.setItem('userPhone', phone);
        localStorage.setItem('userGender', gender);
        localStorage.setItem('userDOB', dob);

        // Redirect to profile page
        window.location.href = 'profiles.html';
    });
});