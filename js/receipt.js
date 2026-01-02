/* =========================================================
   RECEIPT PAGE SCRIPT
   ---------------------------------------------------------
   Author: Nur 'Aainaa Hamraa binti Hamka
   Date: 01 January 2026
   Description:
   Loads selected plan data from localStorage
   and displays the payment receipt.
========================================================= */

window.onload = function () {
  const plan = localStorage.getItem("selectedPlan");
  const price = localStorage.getItem("selectedPrice");

  if (plan && price) {
    document.getElementById("receipt-plan").innerText = plan;
    document.getElementById("receipt-amount").innerText = "RM" + Number(price).toFixed(2);
  }

  const now = new Date();
  document.getElementById("receipt-date").innerText =
    now.toLocaleDateString() + " " + now.toLocaleTimeString();
};
