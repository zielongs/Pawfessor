/* =========================================================
   ADD TO CART – JAVASCRIPT
   ---------------------------------------------------------
   Author: Nur 'Aainaa Hamraa binti Hamka
   Date: 31 December 2025
   Tested by:
   Updated by:
   Description:
   This script handles the interaction logic for the
   Add to Cart page, including:
   - Selecting a subscription plan
   - Updating the selected plan name
   - Dynamically updating the price summary
   - Displaying the total cost in real-time

   This script does not connect to a backend system
   and is used for front-end simulation purposes only.
========================================================= */

function selectPlan(planName, price) {
  document.getElementById("summary-title").innerText = planName;
  document.getElementById("order-price").innerText = "RM" + price.toFixed(2);
  document.getElementById("total-price").innerText = "RM" + price.toFixed(2);
}

