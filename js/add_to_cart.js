/* =========================================================
   ADD TO CART – JAVASCRIPT
   ---------------------------------------------------------
   Author: Nur 'Aainaa Hamraa binti Hamka
   Date: 31 December 2025
   Tested by: Siti Norlie Yana 
   Updated by: Siti Norlie Yana
   Description:
   This script handles the interaction logic for the
   Add to Cart page, including:
   - Selecting a subscription plan
   - Updating the selected plan name
   - Dynamically updating the price summary
   - Displaying the total cost in real-time
========================================================= */


let selectedPlan = null;
let selectedPlanPrice = 0;

let mascotCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

const mascotContainer = document.getElementById("mascot-cart");
const orderPriceEl = document.getElementById("order-price");
const totalPriceEl = document.getElementById("total-price");
const cancelPlanBtn = document.getElementById("cancel-plan");

// ================================
// LOAD MASCOTS
// ================================
function loadMascots() {
  mascotContainer.innerHTML = "";

  if (mascotCart.length === 0) {
    mascotContainer.innerHTML = "<p>No mascots added.</p>";
    updateTotal();
    return;
  }

  mascotCart.forEach((name, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="item-info">
        <strong>${name}</strong>
        <span>Mascot</span>
      </div>
      <span class="price">RM2.99</span>
      <button onclick="removeMascot(${index})">❌</button>
    `;
    mascotContainer.appendChild(div);
  });

  updateTotal();
}

// ================================
// REMOVE MASCOT
// ================================
function removeMascot(index) {
  mascotCart.splice(index, 1);
  localStorage.setItem("shoppingCart", JSON.stringify(mascotCart));
  loadMascots();
}

// ================================
// SUBSCRIPTION SELECTION
// ================================
document.querySelectorAll("input[name='plan']").forEach(radio => {
  radio.addEventListener("change", () => {
    selectedPlan = radio.value;
    selectedPlanPrice = parseFloat(radio.dataset.price);

    localStorage.setItem("selectedPlan", selectedPlan);
    localStorage.setItem("selectedPlanPrice", selectedPlanPrice);

    updateTotal();
  });
});

// ================================
// CANCEL SUBSCRIPTION
// ================================
cancelPlanBtn.addEventListener("click", () => {
  document.querySelectorAll("input[name='plan']").forEach(r => r.checked = false);

  selectedPlan = null;
  selectedPlanPrice = 0;

  localStorage.removeItem("selectedPlan");
  localStorage.removeItem("selectedPlanPrice");

  updateTotal();
});

// ================================
// TOTAL CALCULATION
// ================================
function updateTotal() {
  const mascotTotal = mascotCart.length * 2.99;
  const total = mascotTotal + selectedPlanPrice;

  orderPriceEl.innerText = `RM${total.toFixed(2)}`;
  totalPriceEl.innerText = `RM${total.toFixed(2)}`;
}

// INIT
loadMascots();
