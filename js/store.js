/* ===================================================
   MASCOT STORE PAGE - JavaScript
   ---------------------------------------------------
   Author: Noraziela Binti Jepsin
   Updated by: ChatGPT
   Description:
   - Filter mascots by tier
   - Equip ONE basic mascot at a time
   - Restrict Standard & Premium mascots by user plan
   - Add mascots to cart (no duplicates)
   - Store data using localStorage (frontend simulation)
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ============================================
     USER PLAN (TEMP – SIMULATES BACKEND)
     Change value for testing:
     FREE | STANDARD | PREMIUM
  ============================================ */
  let userPlan = localStorage.getItem("userPlan") || "STANDARD"; //later buang
  // Example testing:
  // localStorage.setItem("userPlan", "STANDARD");
  // localStorage.setItem("userPlan", "PREMIUM");

  const mascotCards = document.querySelectorAll(".mascot-card");
  const checkboxes = document.querySelectorAll(".filter-checkbox input");

  /* ============================================
     1. FILTERING LOGIC
  ============================================ */
  function updateFilters() {
    const activeTiers = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.id.replace("filter", "").toLowerCase());

    mascotCards.forEach(card => {
      const tier = card.getAttribute("data-tier");
      if (activeTiers.includes("all") || activeTiers.includes(tier)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  checkboxes.forEach(box => {
    box.addEventListener("change", e => {
      if (e.target.id === "filterAll" && e.target.checked) {
        checkboxes.forEach(b => {
          if (b.id !== "filterAll") b.checked = false;
        });
      } else if (e.target.checked) {
        document.getElementById("filterAll").checked = false;
      }
      updateFilters();
    });
  });

  updateFilters();

  /* ============================================
     2. BASIC MASCOT EQUIP LOGIC
     (ONLY ONE CAN BE EQUIPPED)
  ============================================ */

  let equippedMascot =
    localStorage.getItem("equippedMascot") || "Pawfessor Cat";

  function updateEquippedUI() {
    document
      .querySelectorAll('.mascot-card[data-tier="basic"]')
      .forEach(card => {
        const name = card.querySelector(".mascot-name").textContent;
        const btn = card.querySelector(".status-btn");

        if (name === equippedMascot) {
          btn.textContent = "Equipped";
          btn.classList.add("equipped");
          btn.disabled = true;
        } else {
          btn.textContent = "Equip";
          btn.classList.remove("equipped");
          btn.disabled = false;
        }
      });
  }

  document
    .querySelectorAll('.mascot-card[data-tier="basic"] .status-btn')
    .forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const card = btn.closest(".mascot-card");
        const name = card.querySelector(".mascot-name").textContent;

        equippedMascot = name;
        localStorage.setItem("equippedMascot", name);
        updateEquippedUI();
      });
    });

  updateEquippedUI();

  /* ============================================
     3. ADD TO CART WITH PLAN RESTRICTION
  ============================================ */

  document.querySelectorAll(".cart-add-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();

      const card = btn.closest(".mascot-card");
      const name = card.querySelector(".mascot-name").textContent;
      const tier = card.getAttribute("data-tier");

      // PLAN CHECK
      if (tier === "standard" && userPlan === "FREE") {
        alert("Please upgrade to Standard plan to buy this mascot.");
        return;
      }

      if (tier === "premium" && userPlan !== "PREMIUM") {
        alert("Please upgrade to Premium plan to buy this mascot.");
        return;
      }

      // CART STORAGE
      let cart = JSON.parse(localStorage.getItem("shoppingCart") || "[]");

      if (!cart.includes(name)) {
        cart.push(name);
        localStorage.setItem("shoppingCart", JSON.stringify(cart));
        alert("Successfully added to cart");
      } else {
        alert("This mascot is already in your cart");
      }
    });
  });

  /* ============================================
     4. UPGRADE BUTTON REDIRECTION
  ============================================ */

  document.querySelectorAll(".upgrade-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      window.location.href = "pricing.html";
    });
  });

});
