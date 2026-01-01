let members = [
  { id: 1, name: "Hana Smith", email: "hana@gmail.com", status: "active" },
  { id: 2, name: "John Doe", email: "john@gmail.com", status: "active" },
  { id: 3, name: "Hugo", email: "hugo@gmail.com", status: "paused" },
  { id: 4, name: "Adam Shamil", email: "adam@gmail.com", status: "active" },
];

let mode = "view"; // view | edit | add
let activeId = null;

const elList = document.getElementById("members_list");
const elEmpty = document.getElementById("empty_state");
const elSearch = document.getElementById("search");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal_title");

const inpName = document.getElementById("m_name");
const inpEmail = document.getElementById("m_email");
const inpStatus = document.getElementById("m_status");

document.getElementById("btn_add").addEventListener("click", () => openAdd());
document.getElementById("btn_close").addEventListener("click", closeModal);
document.getElementById("btn_cancel").addEventListener("click", closeModal);
document.getElementById("btn_save").addEventListener("click", saveModal);

elSearch.addEventListener("input", render);

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);

  if (action === "view") openView(id);
  if (action === "edit") openEdit(id);
  if (action === "delete") doDelete(id);
});

function render(){
  const q = (elSearch.value || "").trim().toLowerCase();

  const filtered = members.filter(m => {
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.status.toLowerCase().includes(q)
    );
  });

  if (filtered.length === 0){
    elList.innerHTML = "";
    elEmpty.style.display = "block";
    return;
  }

  elEmpty.style.display = "none";

  elList.innerHTML = filtered.map(m => `
    <div class="mm_row glass">
      <div class="mm_namewrap">
        <input type="checkbox" aria-label="select ${escapeHtml(m.name)}" />
        <div class="mm_name">${escapeHtml(m.name)}</div>
      </div>

      <button class="mm_btn ghost" data-action="view" data-id="${m.id}">View</button>
      <button class="mm_btn" data-action="edit" data-id="${m.id}">Edit</button>
      <button class="mm_btn danger" data-action="delete" data-id="${m.id}">Delete</button>
    </div>
  `).join("");
}

function openView(id){
  const m = members.find(x => x.id === id);
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

  document.getElementById("btn_save").style.display = "none";

  modal.classList.add("show");
}

function openEdit(id){
  const m = members.find(x => x.id === id);
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

  document.getElementById("btn_save").style.display = "inline-flex";

  modal.classList.add("show");
  inpName.focus();
}

function openAdd(){
  mode = "add";
  activeId = null;

  modalTitle.textContent = "Add Member";
  inpName.value = "";
  inpEmail.value = "";
  inpStatus.value = "active";

  inpName.disabled = false;
  inpEmail.disabled = false;
  inpStatus.disabled = false;

  document.getElementById("btn_save").style.display = "inline-flex";

  modal.classList.add("show");
  inpName.focus();
}

function saveModal(){
  const name = (inpName.value || "").trim();
  const email = (inpEmail.value || "").trim();
  const status = inpStatus.value;

  if (!name) return alert("name is required");
  if (!email) return alert("email is required");

  if (mode === "add"){
    const nextId = members.length ? Math.max(...members.map(x => x.id)) + 1 : 1;
    members.push({ id: nextId, name, email, status });
  }

  if (mode === "edit"){
    const idx = members.findIndex(x => x.id === activeId);
    if (idx >= 0) members[idx] = { ...members[idx], name, email, status };
  }

  closeModal();
  render();
}

function doDelete(id){
  const m = members.find(x => x.id === id);
  if (!m) return;

  const ok = confirm(`delete "${m.name}"?`);
  if (!ok) return;

  members = members.filter(x => x.id !== id);
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
