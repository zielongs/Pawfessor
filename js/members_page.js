/* ===================================================
   MEMBERS JAVASCRIPT
   ---------------------------------------------------
   Author: Alyssa Annabelle binti James Pekan
   Date: 01 January 2026
   Tested by:
   Updated by:
   Description:
   Handles interactive behaviour for the members page,
   including loading member data and responding to
   user actions such as edit or delete + mobile sidebar toggle.
=================================================== */

/* ------------------------------
   Data
-------------------------------- */

let members = [
  { id: 1, name: "Hana Smith", email: "hana@gmail.com", status: "active" },
  { id: 2, name: "John Doe", email: "john@gmail.com", status: "active" },
  { id: 3, name: "Hugo", email: "hugo@gmail.com", status: "paused" },
  { id: 4, name: "Adam Shamil", email: "adam@gmail.com", status: "active" },
];

let mode = "view"; // view | edit | add
let activeId = null;

/* ------------------------------
   DOM
-------------------------------- */

const elList = document.getElementById("members_list");
const elEmpty = document.getElementById("empty_state");
const elSearch = document.getElementById("search");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal_title");

const inpName = document.getElementById("m_name");
const inpEmail = document.getElementById("m_email");
const inpStatus = document.getElementById("m_status");

const btnAdd = document.getElementById("btn_add");
const btnClose = document.getElementById("btn_close");
const btnCancel = document.getElementById("btn_cancel");
const btnSave = document.getElementById("btn_save");

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

  if (sidebar) {
    sidebar.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;

      if (window.matchMedia("(max-width: 900px)").matches) {
        setSidebarOpen(false);
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setSidebarOpen(false);
  });

  window.addEventListener("resize", () => {
    if (!window.matchMedia("(max-width: 900px)").matches) {
      setSidebarOpen(false);
    }
  });
}

/* ------------------------------
   Event listeners
-------------------------------- */

if (btnAdd) btnAdd.addEventListener("click", openAdd);
if (btnClose) btnClose.addEventListener("click", closeModal);
if (btnCancel) btnCancel.addEventListener("click", closeModal);
if (btnSave) btnSave.addEventListener("click", saveModal);

if (elSearch) elSearch.addEventListener("input", render);

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);

  if (action === "view") openView(id);
  if (action === "edit") openEdit(id);
  if (action === "delete") doDelete(id);
});

/* ------------------------------
   Render list
-------------------------------- */

function render() {
  if (!elList || !elEmpty) return;

  const q = (elSearch?.value || "").trim().toLowerCase();

  const filtered = members.filter((m) => {
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.status.toLowerCase().includes(q)
    );
  });

  if (filtered.length === 0) {
    elList.innerHTML = "";
    elEmpty.style.display = "block";
    return;
  }

  elEmpty.style.display = "none";

  elList.innerHTML = filtered
    .map(
      (m) => `
    <div class="mm_row glass">
      <div class="mm_namewrap">
        <input type="checkbox" aria-label="select ${escapeHtml(m.name)}" />
        <div class="mm_name">${escapeHtml(m.name)}</div>
      </div>

      <button class="mm_btn ghost" data-action="view" data-id="${m.id}" type="button">View</button>
      <button class="mm_btn" data-action="edit" data-id="${m.id}" type="button">Edit</button>
      <button class="mm_btn danger" data-action="delete" data-id="${m.id}" type="button">Delete</button>
    </div>
  `
    )
    .join("");
}

/* ------------------------------
   Modal flows
-------------------------------- */

function openView(id) {
  const m = members.find((x) => x.id === id);
  if (!m) return;

  mode = "view";
  activeId = id;

  modalTitle.textContent = "Member Details";
  inpName.value = m.name;
  inpEmail.value = m.email;
  inpStatus.value = m.status;

  inpName.disabled = true;
  inpEmail.disabled = true;
  inpStatus.disabled = true;

  if (btnSave) btnSave.style.display = "none";

  modal.classList.add("show");
}

function openEdit(id) {
  const m = members.find((x) => x.id === id);
  if (!m) return;

  mode = "edit";
  activeId = id;

  modalTitle.textContent = "Edit Member";
  inpName.value = m.name;
  inpEmail.value = m.email;
  inpStatus.value = m.status;

  inpName.disabled = false;
  inpEmail.disabled = false;
  inpStatus.disabled = false;

  if (btnSave) btnSave.style.display = "inline-flex";

  modal.classList.add("show");
  inpName.focus();
}

function openAdd() {
  mode = "add";
  activeId = null;

  modalTitle.textContent = "Add Member";
  inpName.value = "";
  inpEmail.value = "";
  inpStatus.value = "active";

  inpName.disabled = false;
  inpEmail.disabled = false;
  inpStatus.disabled = false;

  if (btnSave) btnSave.style.display = "inline-flex";

  modal.classList.add("show");
  inpName.focus();
}

function saveModal() {
  const name = (inpName.value || "").trim();
  const email = (inpEmail.value || "").trim();
  const status = inpStatus.value;

  if (!name) return alert("name is required");
  if (!email) return alert("email is required");

  if (mode === "add") {
    const nextId = members.length ? Math.max(...members.map((x) => x.id)) + 1 : 1;
    members.push({ id: nextId, name, email, status });
  }

  if (mode === "edit") {
    const idx = members.findIndex((x) => x.id === activeId);
    if (idx >= 0) members[idx] = { ...members[idx], name, email, status };
  }

  closeModal();
  render();
}

function doDelete(id) {
  const m = members.find((x) => x.id === id);
  if (!m) return;

  const ok = confirm(`delete "${m.name}"?`);
  if (!ok) return;

  members = members.filter((x) => x.id !== id);
  render();
}

function closeModal() {
  modal.classList.remove("show");
}

/* ------------------------------
   Helpers
-------------------------------- */

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ------------------------------
   Init
-------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
  render();
});
