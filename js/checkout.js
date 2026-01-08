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

========================================================= */

let selectedPayment = "Online Banking";

/* ===============================
   LOAD CHECKOUT DATA
=============================== */
function loadCheckoutData() {

  const plan = localStorage.getItem("selectedPlan");
  const planPrice = parseFloat(localStorage.getItem("selectedPlanPrice")) || 0;
  const mascots = JSON.parse(localStorage.getItem("shoppingCart") || "[]");

  let total = 0;
  let html = "";
  let products = [];

  // PLAN
  if (plan) {
    html += `
      <div class="summary-row">
        <span>${plan}</span>
        <span>RM${planPrice.toFixed(2)}</span>
      </div>`;
    total += planPrice;
    products.push(plan);
  }

  // MASCOTS
  mascots.forEach(name => {
    html += `
      <div class="summary-row">
        <span>${name}</span>
        <span>RM2.99</span>
      </div>`;
    total += 2.99;
    products.push(name);
  });

  if (!html) {
    html = "<p>No items selected</p>";
  }

  document.getElementById("order-list").innerHTML = html;
  document.getElementById("total-price").innerText = `RM${total.toFixed(2)}`;

  // Hidden inputs (FOR RECEIPT & HISTORY)
  document.getElementById("hidden-product").value = products.join(", ");
  document.getElementById("hidden-amount").value = total;
}

/* ===============================
   PAYMENT METHOD SELECTION
=============================== */
document.querySelectorAll(".payment-item, .payment-card").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".payment-item, .payment-card")
      .forEach(i => i.classList.remove("selected"));

    item.classList.add("selected");
    selectedPayment = item.dataset.method;
  });
});

/* ===============================
   ON LOAD
=============================== */
window.onload = () => {
  document.querySelector('[data-method="Online Banking"]').classList.add("selected");
  loadCheckoutData();
};

/* ===============================
   FORM SUBMIT
=============================== */
document.querySelector("form").addEventListener("submit", () => {
  document.getElementById("hidden-payment").value = selectedPayment;
});
