// Données fictives : remplacez-les par vos données (API, Firebase…).
const $ = (s) => document.querySelector(s);
const fmt = (n) => Math.round(n).toLocaleString("fr-FR").replace(/ /g, " ") + " DA";

/* ---- Ventes (séries générées de façon déterministe) ---- */
function series(n, base, step) {
  return Array.from({ length: n }, (_, i) => Math.round(base + Math.sin(i * 1.3) * step + Math.cos(i * 0.55) * step * 0.7 + i * step * 0.08));
}
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = ["Nov", "Déc", "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct"];
const PERIODS = {
  7: { data: series(7, 24000, 7000), labels: DAYS, orders: 31, prevOrders: 27, prev: 0.86, text: "7 derniers jours" },
  30: { data: series(30, 22000, 6500), labels: Array.from({ length: 30 }, (_, i) => String(i + 1)), orders: 118, prevOrders: 126, prev: 1.04, text: "30 derniers jours" },
  12: { data: series(12, 520000, 90000), labels: MONTHS, orders: 1390, prevOrders: 1120, prev: 0.8, text: "12 derniers mois" },
};
let period = 7;

function drawChart() {
  const p = PERIODS[period];
  const W = Math.max(520, $("#chartBox").clientWidth), H = 280, m = { l: 56, r: 12, t: 12, b: 28 };
  const max = Math.max(...p.data) * 1.15;
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const bw = iw / p.data.length;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  let s = `<svg viewBox="0 0 ${W} ${H}">`;
  s = "";
  ticks.forEach((t) => {
    const y = m.t + ih - (t / max) * ih;
    s += `<line x1="${m.l}" x2="${W - m.r}" y1="${y}" y2="${y}" stroke="#e7ebf4"/><text x="${m.l - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#5b6785">${t >= 1000 ? Math.round(t / 1000) + " k" : 0}</text>`;
  });
  p.data.forEach((v, i) => {
    const h = (v / max) * ih;
    const x = m.l + i * bw + bw * 0.15;
    const y = m.t + ih - h;
    s += `<rect class="bar" data-i="${i}" x="${x}" y="${y}" width="${bw * 0.7}" height="${h}" rx="4" fill="${i === p.data.length - 1 ? "#f2b705" : "#1d3fbf"}"/>`;
    const skip = p.data.length > 12 ? 3 : 1;
    if (i % skip === 0) s += `<text x="${x + bw * 0.35}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#5b6785">${p.labels[i]}</text>`;
  });
  const svg = $("#chartSvg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.width = W + "px";
  svg.innerHTML = s;
  const total = p.data.reduce((a, b) => a + b, 0);
  $("#chartDesc").textContent = `Ventes sur les ${p.text} : ${fmt(total)} au total.`;

  // KPIs
  const prevPct = Math.round((1 / p.prev - 1) * 100);
  $("#kSales").textContent = fmt(total);
  setDelta($("#kSalesDelta"), prevPct, "vs période précédente");
  $("#kOrders").textContent = p.orders.toLocaleString("fr-FR");
  setDelta($("#kOrdersDelta"), Math.round((p.orders / p.prevOrders - 1) * 100), "vs période précédente");
  $("#kAvg").textContent = fmt(total / p.orders);
  $("#subtitle").textContent = `Voici l'activité de votre boutique sur les ${p.text}.`;
}
function setDelta(el, pct, suffix) {
  el.className = pct >= 0 ? "up" : "down";
  el.textContent = `${pct >= 0 ? "+" : ""}${pct} % ${suffix}`;
}

const box = $("#chartBox"), tip = $("#tip");
$("#chartSvg").addEventListener("mousemove", (e) => {
  const r = e.target.closest(".bar");
  if (!r) return (tip.hidden = true);
  const p = PERIODS[period], i = +r.dataset.i;
  tip.innerHTML = `<b>${fmt(p.data[i])}</b>${p.labels[i]}`;
  const rb = r.getBoundingClientRect(), bb = box.getBoundingClientRect();
  tip.style.left = rb.left - bb.left + rb.width / 2 + "px";
  tip.style.top = rb.top - bb.top + "px";
  tip.hidden = false;
});
$("#chartSvg").addEventListener("mouseleave", () => (tip.hidden = true));
$("#seg").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  period = +b.dataset.p;
  $("#seg").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
  drawChart();
});

/* ---- Commandes ---- */
const ORDERS = [
  { id: "#1048", client: "Amine B.", wilaya: "Oran", amount: 7400, status: "Nouvelle" },
  { id: "#1047", client: "Lina K.", wilaya: "Alger", amount: 3200, status: "Nouvelle" },
  { id: "#1046", client: "Yacine M.", wilaya: "Constantine", amount: 14500, status: "Nouvelle" },
  { id: "#1045", client: "Sara H.", wilaya: "Tlemcen", amount: 2400, status: "Expédiée" },
  { id: "#1044", client: "Karim D.", wilaya: "Sétif", amount: 9800, status: "Expédiée" },
  { id: "#1043", client: "Nadia R.", wilaya: "Béjaïa", amount: 5600, status: "Livrée" },
  { id: "#1042", client: "Omar T.", wilaya: "Ghardaïa", amount: 18500, status: "Livrée" },
  { id: "#1041", client: "Meriem A.", wilaya: "Annaba", amount: 1200, status: "Livrée" },
];
let statusFilter = "Toutes";
const NEXT = { Nouvelle: "Expédiée", Expédiée: "Livrée" };
const ACTION = { Nouvelle: "Marquer comme expédiée", Expédiée: "Marquer comme livrée" };

function renderOrders() {
  const list = ORDERS.filter((o) => statusFilter === "Toutes" || o.status === statusFilter);
  $("#empty").hidden = list.length > 0;
  $("#rows").innerHTML = list
    .map(
      (o) => `<tr>
        <td class="id">${o.id}</td><td>${o.client}</td><td>${o.wilaya}</td>
        <td class="num">${fmt(o.amount)}</td>
        <td><span class="badge ${o.status}">${o.status}</span></td>
        <td>${NEXT[o.status] ? `<button class="act" data-id="${o.id}">${ACTION[o.status]}</button>` : ""}</td>
      </tr>`
    )
    .join("");
  $("#kToShip").textContent = ORDERS.filter((o) => o.status === "Nouvelle").length;
}
$("#rows").addEventListener("click", (e) => {
  const b = e.target.closest(".act");
  if (!b) return;
  const o = ORDERS.find((x) => x.id === b.dataset.id);
  o.status = NEXT[o.status];
  renderOrders();
  toast(`Commande ${o.id} : ${o.status.toLowerCase()}`);
});
$("#filter").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  statusFilter = b.dataset.s;
  $("#filter").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
  renderOrders();
});
$("#addProduct").addEventListener("click", () => toast("Le formulaire d'ajout de produit reste à connecter."));

let t;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(t);
  t = setTimeout(() => el.classList.remove("show"), 2200);
}

let rz;
window.addEventListener("resize", () => {
  clearTimeout(rz);
  rz = setTimeout(drawChart, 150);
});

drawChart();
renderOrders();
