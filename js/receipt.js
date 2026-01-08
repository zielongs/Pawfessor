/* =========================================================
   RECEIPT PAGE SCRIPT
   ---------------------------------------------------------
   Author: Nur 'Aainaa Hamraa binti Hamka
   Date: 01 January 2026
   Description:
   Loads selected plan data from localStorage
   and displays the payment receipt.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const printBtn = document.querySelector(".share-btn");

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

});

