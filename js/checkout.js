/* =========================================================
   CHECKOUT PAGE – JAVASCRIPT
   ---------------------------------------------------------
   Author: Nur 'Aainaa Hamraa binti Hamka
   Date: 1 January 2026
   Tested by: Siti Norlie Yana
   Updated by: Siti Norlie Yana
   Description:
   This script handles the functionality of the Checkout
   page, including:
   - Retrieving the selected plan from localStorage
   - Displaying the selected plan details (name & price)
   - Updating the order summary dynamically
   - Preparing the checkout data before payment

   This script is for front-end simulation only and does
   not perform real payment processing or backend calls.
========================================================= */

window.onload = function () {
  const plan = localStorage.getItem("selectedPlan");
  const price = localStorage.getItem("selectedPrice");

  const planName = document.getElementById("plan-name");
  const planPrice = document.getElementById("plan-price");
  const totalPrice = document.getElementById("total-price");
  const planIcon = document.getElementById("plan-icon");

  if (plan && price) {
    planName.innerText = plan;
    planPrice.innerText = "RM" + parseFloat(price).toFixed(2);
    totalPrice.innerText = "RM" + parseFloat(price).toFixed(2);

    // Change icon based on plan
    if (plan.includes("Premium")) {
      planIcon.src = "images/Plans/premium.png";
    } else if (plan.includes("Standard")) {
      planIcon.src = "images/Plans/standard.png";
    } else if (plan.includes("Dragon")) {
      planIcon.src = "images/Mascots/pawfessor_dragon.png";
    }
  }
};

