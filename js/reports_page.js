/* ===================================================
   REPORTS JAVASCRIPT
   ---------------------------------------------------
   Author: Alyssa Annabelle binti James Pekan
   Date: 01 January 2026
   Tested by:
   Updated by:
   Description:
   Handles report-related interactions, including
   loading, filtering, and generating report data
   for display.
=================================================== */

const PRODUCT_CATALOG = [
  /* subscriptions */
  { key:"Free Plan", type:"subscription", price:0.00 },
  { key:"Standard Plan", type:"subscription", price:5.99 },
  { key:"Premium Plan", type:"subscription", price:7.99 },

  /* mascots free */
  { key:"Pawfessor Cat", type:"mascot", price:0.00 },
  { key:"Pawfessor Panda", type:"mascot", price:0.00 },
  { key:"Pawfessor Bear", type:"mascot", price:0.00 },
  { key:"Pawfessor Racoon", type:"mascot", price:0.00 },

  /* mascots standard (RM1.99) */
  { key:"Pawfessor Sheep", type:"mascot", price:1.99 },
  { key:"Pawfessor Rabbit", type:"mascot", price:1.99 },
  { key:"Pawfessor Fox", type:"mascot", price:1.99 },
  { key:"Pawfessor Cow", type:"mascot", price:1.99 },

  /* mascots premium (RM2.99) */
  { key:"Pawfessor Penguin", type:"mascot", price:2.99 },
  { key:"Pawfessor Axolotl", type:"mascot", price:2.99 },
  { key:"Pawfessor Dragon", type:"mascot", price:2.99 },
  { key:"Pawfessor Wolf", type:"mascot", price:2.99 },
];

/* demo transactions */
let transactions = [
  { id: 1, date: "2025-12-05", item: "Pawfessor Sheep", type:"mascot", method:"google pay", total: 1.99 },
  { id: 2, date: "2025-12-08", item: "Standard Plan",  type:"subscription", method:"debit card", total: 5.99 },
  { id: 3, date: "2025-12-12", item: "Pawfessor Dragon",type:"mascot", method:"google pay", total: 2.99 },
  { id: 4, date: "2025-12-21", item: "Premium Plan",   type:"subscription", method:"debit card", total: 7.99 },
];

const elRange = document.getElementById("range_label");
const elPicker = document.getElementById("picker");
const elDays = document.getElementById("days");
const elMonth = document.getElementById("month_label");

const btnPick = document.getElementById("btn_pick");
const btnApply = document.getElementById("btn_apply");
const btnClear = document.getElementById("btn_clear");
const btnPrev = document.getElementById("prev_month");
const btnNext = document.getElementById("next_month");

const selItem = document.getElementById("t_item");
const inpDate = document.getElementById("t_date");
const selMethod = document.getElementById("t_method");
const inpTotal = document.getElementById("t_total");
const elQuick = document.getElementById("quick_prices");

const btnAdd = document.getElementById("btn_add_tx");
const btnReset = document.getElementById("btn_reset");

const elList = document.getElementById("tx_list");
const elEmpty = document.getElementById("tx_empty");
const elCount = document.getElementById("list_count");

const elMascot = document.getElementById("sum_mascot");
const elSub = document.getElementById("sum_sub");
const elTotal = document.getElementById("sum_total");

const btnPdf = document.getElementById("btn_pdf");

let rangeStart = new Date("2025-12-05");
let rangeEnd   = new Date("2025-12-21");

let viewYear = 2025;
let viewMonth = 11; // 0-based; 11 = December

let pickA = null;
let pickB = null;

fillItemSelect();
setupQuickPrices();
setDefaultFormDate();
updateRangeLabel();
renderCalendar();
render();

btnPick.addEventListener("click", () => {
  elPicker.classList.toggle("show");
});

btnPrev.addEventListener("click", () => {
  viewMonth--;
  if (viewMonth < 0){ viewMonth = 11; viewYear--; }
  renderCalendar();
});

btnNext.addEventListener("click", () => {
  viewMonth++;
  if (viewMonth > 11){ viewMonth = 0; viewYear++; }
  renderCalendar();
});

btnClear.addEventListener("click", () => {
  pickA = null;
  pickB = null;
  renderCalendar();
});

btnApply.addEventListener("click", () => {
  if (!pickA) return;
  const a = new Date(pickA);
  const b = pickB ? new Date(pickB) : new Date(pickA);

  rangeStart = (a <= b) ? a : b;
  rangeEnd = (a <= b) ? b : a;

  elPicker.classList.remove("show");
  updateRangeLabel();
  render();
});

selItem.addEventListener("change", () => {
  const p = PRODUCT_CATALOG.find(x => x.key === selItem.value);
  if (p) inpTotal.value = p.price.toFixed(2);
});

btnReset.addEventListener("click", () => {
  setDefaultFormDate();
  selItem.selectedIndex = 0;
  selMethod.value = "google pay";
  const p = PRODUCT_CATALOG.find(x => x.key === selItem.value);
  inpTotal.value = p ? p.price.toFixed(2) : "0.00";
});

btnAdd.addEventListener("click", () => {
  const date = inpDate.value;
  const item = selItem.value;
  const method = selMethod.value;
  const total = Number(inpTotal.value || 0);

  if (!date) return alert("please choose a date");
  if (!item) return alert("please choose an item");
  if (Number.isNaN(total)) return alert("total must be a number");

  const cat = PRODUCT_CATALOG.find(x => x.key === item);
  const type = cat ? cat.type : "unknown";

  const nextId = transactions.length ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
  transactions.push({ id: nextId, date, item, type, method, total });

  render();
});

document.addEventListener("click", (e) => {
  const del = e.target.closest("button[data-del]");
  if (!del) return;

  const id = Number(del.dataset.del);
  const tx = transactions.find(t => t.id === id);
  if (!tx) return;

  const ok = confirm(`delete transaction: ${tx.item}?`);
  if (!ok) return;

  transactions = transactions.filter(t => t.id !== id);
  render();
});

btnPdf.addEventListener("click", () => {
  // print-to-pdf. user chooses "Save as PDF" in browser dialog.
  window.print();
});

function fillItemSelect(){
  selItem.innerHTML = PRODUCT_CATALOG.map(p => `<option value="${escapeHtml(p.key)}">${escapeHtml(p.key)}</option>`).join("");
  const first = PRODUCT_CATALOG[0];
  inpTotal.value = first ? first.price.toFixed(2) : "0.00";
}

function setupQuickPrices(){
  // show quick buttons for common paid prices
  const prices = Array.from(new Set(PRODUCT_CATALOG.map(p => p.price).filter(x => x > 0))).sort((a,b) => a-b);
  elQuick.innerHTML = prices.map(v => `
    <button class="qbtn" type="button" data-price="${v.toFixed(2)}">RM${v.toFixed(2)}</button>
  `).join("");

  elQuick.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-price]");
    if (!b) return;
    inpTotal.value = b.dataset.price;
  });
}

function setDefaultFormDate(){
  // set to today 
  const today = new Date();
  inpDate.value = toISO(today);
}

function updateRangeLabel(){
  elRange.textContent = `${fmt(rangeStart)} - ${fmt(rangeEnd)}`;
}

function render(){
  const start = stripTime(rangeStart);
  const end = stripTime(rangeEnd);

  const inRange = transactions
    .filter(t => {
      const d = new Date(t.date + "T00:00:00");
      return d >= start && d <= end;
    })
    .sort((a,b) => a.date.localeCompare(b.date));

  elCount.textContent = `${inRange.length} records`;

  if (inRange.length === 0){
    elList.innerHTML = "";
    elEmpty.style.display = "block";
  } else {
    elEmpty.style.display = "none";
    elList.innerHTML = inRange.map(t => `
      <div class="tx_row glass">
        <div>${escapeHtml(prettyDate(t.date))}</div>
        <div>${escapeHtml(t.item)}</div>
        <div>${escapeHtml(t.method)}</div>
        <div class="right"><strong>RM${Number(t.total).toFixed(2)}</strong></div>
        <div class="right">
          <button class="delbtn" type="button" data-del="${t.id}">🗑️</button>
        </div>
      </div>
    `).join("");
  }

  // totals
  const mascotSum = sum(inRange.filter(x => x.type === "mascot").map(x => x.total));
  const subSum = sum(inRange.filter(x => x.type === "subscription").map(x => x.total));
  const totalSum = mascotSum + subSum;

  elMascot.textContent = `RM ${mascotSum.toFixed(2)}`;
  elSub.textContent = `RM ${subSum.toFixed(2)}`;
  elTotal.textContent = `RM ${totalSum.toFixed(2)}`;
}

function renderCalendar(){
  const monthName = new Date(viewYear, viewMonth, 1).toLocaleString("en-US", { month:"long" });
  elMonth.textContent = `${monthName} ${viewYear}`;

  const first = new Date(viewYear, viewMonth, 1);
  const startDay = first.getDay(); 
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevDays = startDay;
  const cells = [];

  const prevMonthLast = new Date(viewYear, viewMonth, 0).getDate();
  for (let i = prevDays; i > 0; i--){
    const d = new Date(viewYear, viewMonth - 1, prevMonthLast - i + 1);
    cells.push(renderDayCell(d, true));
  }

  for (let d = 1; d <= daysInMonth; d++){
    const date = new Date(viewYear, viewMonth, d);
    cells.push(renderDayCell(date, false));
  }

  while (cells.length % 7 !== 0){
    const d = new Date(viewYear, viewMonth + 1, cells.length - (prevDays + daysInMonth) + 1);
    cells.push(renderDayCell(d, true));
  }

  elDays.innerHTML = cells.join("");

  elDays.querySelectorAll("button.day:not(.off)").forEach(btn => {
    btn.addEventListener("click", () => {
      const iso = btn.dataset.iso;

      if (!pickA || (pickA && pickB)){
        pickA = iso;
        pickB = null;
      } else {
        pickB = iso;
      }

      renderCalendar();
    });
  });
}

function renderDayCell(date, off){
  const iso = toISO(date);
  const todayIso = toISO(new Date());

  const selA = pickA === iso;
  const selB = pickB === iso;

  let inRange = false;
  if (pickA && pickB){
    const a = new Date(pickA);
    const b = new Date(pickB);
    const s = (a <= b) ? a : b;
    const e = (a <= b) ? b : a;
    inRange = date >= stripTime(s) && date <= stripTime(e);
  }

  const classes = [
    "day",
    off ? "off" : "",
    (selA || selB) ? "sel" : "",
    inRange && !(selA || selB) ? "in" : "",
    iso === todayIso ? "today" : ""
  ].filter(Boolean).join(" ");

  return `<button class="${classes}" type="button" ${off ? "disabled" : ""} data-iso="${iso}">${date.getDate()}</button>`;
}

function sum(arr){ return arr.reduce((a,b) => a + Number(b || 0), 0); }

function stripTime(d){
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function toISO(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

function fmt(d){
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function prettyDate(iso){
  const [y,m,d] = iso.split("-").map(Number);
  const dt = new Date(y, m-1, d);
  return fmt(dt);
}

function escapeHtml(s){
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
