/* ===================================================
   PRODUCTS JAVASCRIPT
   ---------------------------------------------------
   Author: Alyssa Annabelle binti James Pekan
   Date: 01 January 2026
   Tested by:
   Updated by:
   Description:
   Handles interactive behaviour for the products page,
   including filtering, searching, and managing product
   data displayed to the administrator.
=================================================== */

let products = [
  {
    id: 1,
    name: "Free Plan",
    type: "subscription",
    tier: "free",
    price: 0.00,
    billing: "monthly",
    desc: "RM0 per month. for getting started. includes: simple reminder, limited task, basic analytics."
  },
  {
    id: 2,
    name: "Standard Plan",
    type: "subscription",
    tier: "standard",
    price: 5.99,
    billing: "monthly",
    desc: "RM5.99 per month. includes: unlimited task, smart reminders, advanced analytics."
  },
  {
    id: 3,
    name: "Premium Plan",
    type: "subscription",
    tier: "premium",
    price: 7.99,
    billing: "monthly",
    desc: "RM7.99 per month. includes: unlimited task, smart reminders, advanced analytics, premium features."
  },

  { id: 10, name: "Pawfessor Cat",    type: "mascot", tier: "free",     price: 0.00, billing: "one-time", desc: "free mascot unlock." },
  { id: 11, name: "Pawfessor Panda",  type: "mascot", tier: "free",     price: 0.00, billing: "one-time", desc: "free mascot unlock." },
  { id: 12, name: "Pawfessor Bear",   type: "mascot", tier: "free",     price: 0.00, billing: "one-time", desc: "free mascot unlock." },
  { id: 13, name: "Pawfessor Racoon", type: "mascot", tier: "free",     price: 0.00, billing: "one-time", desc: "free mascot unlock." },

  { id: 20, name: "Pawfessor Sheep",  type: "mascot", tier: "standard", price: 1.99, billing: "one-time", desc: "requires standard. buy for RM1.99." },
  { id: 21, name: "Pawfessor Rabbit", type: "mascot", tier: "standard", price: 1.99, billing: "one-time", desc: "requires standard. buy for RM1.99." },
  { id: 22, name: "Pawfessor Fox",    type: "mascot", tier: "standard", price: 1.99, billing: "one-time", desc: "requires standard. buy for RM1.99." },
  { id: 23, name: "Pawfessor Cow",    type: "mascot", tier: "standard", price: 1.99, billing: "one-time", desc: "requires standard. buy for RM1.99." },

  { id: 30, name: "Pawfessor Penguin", type: "mascot", tier: "premium", price: 2.99, billing: "one-time", desc: "requires premium. buy for RM2.99." },
  { id: 31, name: "Pawfessor Axolotl", type: "mascot", tier: "premium", price: 2.99, billing: "one-time", desc: "requires premium. buy for RM2.99." },
  { id: 32, name: "Pawfessor Dragon",  type: "mascot", tier: "premium", price: 2.99, billing: "one-time", desc: "requires premium. buy for RM2.99." },
  { id: 33, name: "Pawfessor Wolf",    type: "mascot", tier: "premium", price: 2.99, billing: "one-time", desc: "requires premium. buy for RM2.99." },
];

let activeFilter = "all";
let mode = "view"; 
let activeId = null;

const listEl = document.getElementById("prod_list");
const emptyEl = document.getElementById("empty_state");
const searchEl = document.getElementById("search");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal_title");

const pName = document.getElementById("p_name");
const pType = document.getElementById("p_type");
const pTier = document.getElementById("p_tier");
const pPrice = document.getElementById("p_price");
const pBilling = document.getElementById("p_billing");
const pDesc = document.getElementById("p_desc");

const btnSave = document.getElementById("btn_save");

document.getElementById("btn_add").addEventListener("click", openAdd);
document.getElementById("add_card").addEventListener("click", openAdd);
document.getElementById("add_card").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openAdd();
});

document.getElementById("btn_close").addEventListener("click", closeModal);
document.getElementById("btn_cancel").addEventListener("click", closeModal);
btnSave.addEventListener("click", saveModal);

searchEl.addEventListener("input", render);

document.addEventListener("click", (e) => {
  const f = e.target.closest("button[data-filter]");
  if (f){
    document.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
    f.classList.add("active");
    activeFilter = f.dataset.filter;
    render();
    return;
  }

  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);

  if (action === "view") openView(id);
  if (action === "edit") openEdit(id);
  if (action === "delete") doDelete(id);
});

function render(){
  const q = (searchEl.value || "").trim().toLowerCase();

  let filtered = products.slice();

  if (activeFilter !== "all"){
    filtered = filtered.filter(p => p.type === activeFilter);
  }

  if (q){
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.tier.toLowerCase().includes(q) ||
      String(p.price).includes(q)
    );
  }

  if (filtered.length === 0){
    listEl.innerHTML = "";
    emptyEl.style.display = "block";
    return;
  }

  emptyEl.style.display = "none";

  listEl.innerHTML = filtered.map(p => {
    const typeBadge = p.type === "subscription"
      ? "<span class='badge sub'>subscription</span>"
      : "<span class='badge masc'>mascot</span>";

    const tierBadge = `<span class="badge ${p.tier}">${escapeHtml(p.tier)}</span>`;

    const priceText = p.price === 0 ? "RM0" : `RM${Number(p.price).toFixed(2)}`;

    return `
      <div class="prod_row glass">
        <div class="prod_namewrap">
          <input type="checkbox" aria-label="select ${escapeHtml(p.name)}" />
          <div class="prod_name">${escapeHtml(p.name)}</div>
        </div>

        <div>${typeBadge}</div>
        <div>${tierBadge}</div>
        <div class="right"><strong>${priceText}</strong>${p.billing === "monthly" ? "<span class='muted'> /mo</span>" : ""}</div>

        <div class="actions">
          <button class="act_btn ghost" data-action="view" data-id="${p.id}">View</button>
          <button class="act_btn" data-action="edit" data-id="${p.id}">Update</button>
          <button class="trash_btn" data-action="delete" data-id="${p.id}" title="Delete">🗑️</button>
        </div>
      </div>
    `;
  }).join("");
}

function openView(id){
  const p = products.find(x => x.id === id);
  if (!p) return;

  mode = "view";
  activeId = id;

  modalTitle.textContent = "Product Details";
  fillModal(p);

  setEditable(false);
  btnSave.style.display = "none";

  modal.classList.add("show");
}

function openEdit(id){
  const p = products.find(x => x.id === id);
  if (!p) return;

  mode = "edit";
  activeId = id;

  modalTitle.textContent = "Update Product";
  fillModal(p);

  setEditable(true);
  btnSave.style.display = "inline-flex";

  modal.classList.add("show");
  pName.focus();
}

function openAdd(){
  mode = "add";
  activeId = null;

  modalTitle.textContent = "Add New Product";
  fillModal({
    name: "",
    type: "mascot",
    tier: "free",
    price: 0,
    billing: "one-time",
    desc: ""
  });

  setEditable(true);
  btnSave.style.display = "inline-flex";

  modal.classList.add("show");
  pName.focus();
}

function fillModal(p){
  pName.value = p.name ?? "";
  pType.value = p.type ?? "mascot";
  pTier.value = p.tier ?? "free";
  pPrice.value = (p.price ?? 0);
  pBilling.value = p.billing ?? "one-time";
  pDesc.value = p.desc ?? "";
}

function setEditable(yes){
  pName.disabled = !yes;
  pType.disabled = !yes;
  pTier.disabled = !yes;
  pPrice.disabled = !yes;
  pBilling.disabled = !yes;
  pDesc.disabled = !yes;
}

function saveModal(){
  const name = (pName.value || "").trim();
  const type = pType.value;
  const tier = pTier.value;
  const price = Number(pPrice.value || 0);
  const billing = pBilling.value;
  const desc = (pDesc.value || "").trim();

  if (!name) return alert("product name is required");

  if (mode === "add"){
    const nextId = products.length ? Math.max(...products.map(x => x.id)) + 1 : 1;
    products.push({ id: nextId, name, type, tier, price, billing, desc });
  }

  if (mode === "edit"){
    const idx = products.findIndex(x => x.id === activeId);
    if (idx >= 0) products[idx] = { ...products[idx], name, type, tier, price, billing, desc };
  }

  closeModal();
  render();
}

function doDelete(id){
  const p = products.find(x => x.id === id);
  if (!p) return;

  const ok = confirm(`delete "${p.name}"?`);
  if (!ok) return;

  products = products.filter(x => x.id !== id);
  render();
}

function closeModal(){
  modal.classList.remove("show");
}

function escapeHtml(s){
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

render();
