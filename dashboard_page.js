const items = [
  { id: 1, name: "Pawfessor Sheep", status: "active" },
  { id: 2, name: "Pawfessor Rabbit", status: "active" },
  { id: 3, name: "Pawfessor Fox", status: "active" },
];

function render() {
  const list = document.getElementById("qa_list");
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

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);
  const it = items.find(x => x.id === id);
  if (!it) return;

  if (action === "edit") {
    if (!it.name.includes("(edited)")) it.name += " (edited)";
  } else if (action === "update") {
    it.status = (it.status === "active") ? "paused" : "active";
  }

  render();
});

document.addEventListener("DOMContentLoaded", render);
