    /* ============================================
         PROFILE PAGE - JavaScript
         Author: Noraziela Binti Jepsin
         Date: 31 December 2025
         Tested by:
         Updated by:

         ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    const savedName = localStorage.getItem('userName');
    const nameDisplay = document.getElementById('displayUserName');

    if (savedName && nameDisplay) {
        nameDisplay.textContent = savedName;
    }
});