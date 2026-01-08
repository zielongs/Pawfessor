/* ============================================
   TRANSACTION HISTORY PAGE - JAVASCRIPT
-----------------------------------------------
    Author: Siti Norlie Yana
    Date: 1 January 2026
    Tested by:
    Updated by: Nur 'Aainaa Hamraa binti Hamka
    Description:
        Handles transaction display and filtering, including:
        - Rendering transaction table dynamically
        - Filtering by status (All / Successful / Unsuccessful)
        - Downloading invoices
        - Showing empty state when no transactions
   ============================================ */

/* ============================================
   TRANSACTION HISTORY – FILTER 
============================================ */

document.addEventListener("DOMContentLoaded", () => {

  const rows = document.querySelectorAll(".transactions-table tbody tr");
  const tabs = document.querySelectorAll(".filter-tab");
  const statusSelect = document.querySelector(".status-select");
  const downloadBtn = document.querySelector(".download-btn");

  /* ===============================
     CORE FILTER FUNCTION
  =============================== */
  function applyFilter(filter) {
    rows.forEach(row => {
      const badge = row.querySelector(".status-badge");
      if (!badge) return;

      if (filter === "all") {
        row.style.display = "";
        return;
      }

      if (badge.classList.contains("status-" + filter)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  }

  /* ===============================
     TAB CLICK
  =============================== */
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter;

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      if (statusSelect) statusSelect.value = filter;

      applyFilter(filter);
    });
  });

  /* ===============================
     DROPDOWN CHANGE
  =============================== */
  if (statusSelect) {
    statusSelect.addEventListener("change", () => {
      const filter = statusSelect.value;

      tabs.forEach(tab => {
        tab.classList.toggle("active", tab.dataset.filter === filter);
      });

      applyFilter(filter);
    });
  }

  /* ===============================
     DOWNLOAD INVOICES
  =============================== */
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      window.print();
    });
  }

});
