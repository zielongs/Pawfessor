/* ===================================================
   DASHBOARD JAVASCRIPT
   ---------------------------------------------------
   Author: Alyssa Annabelle binti James Pekan
   Date: 01 January 2026
   Tested by:
   Updated by:
   Description:
   Handles dynamic behaviour for the dashboard page,
   including rendering quick actions, updating
   displayed data elements, and mobile sidebar toggle.
=================================================== */

const items = [
  { id: 1, name: "Pawfessor Sheep", status: "active" },
  { id: 2, name: "Pawfessor Rabbit", status: "active" },
  { id: 3, name: "Pawfessor Fox", status: "active" },
];

/* ------------------------------
   Quick Actions renderer
-------------------------------- */

function render() {
  const list = document.getElementById("qa_list");
  if (!list) return;

  list.innerHTML = "";

  items.forEach((it) => {
    const row = document.createElement("div");
    row.className = "qa_row glass " + (it.status === "paused" ? "paused" : "");

    row.innerHTML = `
      <div class="qa_left">
        <strong>${it.name}</strong>
        <small>Status: ${it.status}</small>
      </div>

      <div class="qa_btns">
        <button class="qa_btn glass" data-action="edit" data-id="${it.id}">Edit</button>
        <button class="qa_btn glass primary" data-action="update" data-id="${it.id}">Update</button>
      </div>
    `;

    list.appendChild(row);
  });
}

/* ------------------------------
   Mobile sidebar toggle (global)
-------------------------------- */

function setSidebarOpen(isOpen) {
  document.body.classList.toggle("sidebar_open", isOpen);

  const btn = document.getElementById("dashMenuBtn");
  if (btn) btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

function toggleSidebar() {
  setSidebarOpen(!document.body.classList.contains("sidebar_open"));
}

function initSidebar() {
  const btn = document.getElementById("dashMenuBtn");
  const overlay = document.querySelector(".dash_overlay");
  const sidebar = document.querySelector(".dash_sidebar");

  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleSidebar();
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => setSidebarOpen(false));
  }

  // Close on nav click (mobile)
  if (sidebar) {
    sidebar.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;

      if (window.matchMedia("(max-width: 900px)").matches) {
        setSidebarOpen(false);
      }
    });
  }

  // Esc closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setSidebarOpen(false);
  });

  // On desktop resize, clear "open" state so overlay doesn't stick
  window.addEventListener("resize", () => {
    if (!window.matchMedia("(max-width: 900px)").matches) {
      setSidebarOpen(false);
    }
  });
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);
  const it = items.find((x) => x.id === id);
  if (!it) return;

  if (action === "edit") {
    if (!it.name.includes("(edited)")) it.name += " (edited)";
  } else if (action === "update") {
    it.status = it.status === "active" ? "paused" : "active";
  }

  render();
});

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  render();
});
