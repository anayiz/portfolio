// Données fictives : remplacez-les par vos vraies données (API, Firebase…).
const WILAYAS = [
  { name: "Alger", days: "24 h", fee: 400, note: "Livraison express dans le Grand Alger." },
  { name: "Oran", days: "24 à 48 h", fee: 450, note: "Retrait possible en point relais à Es Sénia." },
  { name: "Blida", days: "24 à 48 h", fee: 450, note: "Livraison à domicile." },
  { name: "Tlemcen", days: "2 à 3 jours", fee: 550, note: "Livraison à domicile." },
  { name: "Constantine", days: "2 à 3 jours", fee: 550, note: "Livraison à domicile." },
  { name: "Annaba", days: "2 à 3 jours", fee: 600, note: "Livraison à domicile." },
  { name: "Sétif", days: "2 à 3 jours", fee: 550, note: "Livraison à domicile." },
  { name: "Béjaïa", days: "2 à 3 jours", fee: 600, note: "Livraison à domicile." },
  { name: "Ghardaïa", days: "3 à 5 jours", fee: 800, note: "Livraison en point relais." },
  { name: "Ouargla", days: "3 à 5 jours", fee: 850, note: "Livraison en point relais." },
  { name: "Tamanrasset", days: "5 à 7 jours", fee: 1200, note: "Livraison en point relais." },
];

const COLORS = { Alimentation: "#f2b705", Artisanat: "#c9d6ff", Maison: "#ffd9c7", Mode: "#cfeede" };
const ICONS = {
  Alimentation: '<svg viewBox="0 0 64 64" fill="none" stroke="#0e1b3d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M32 8c10 8 16 18 16 28a16 16 0 0 1-32 0C16 26 22 16 32 8z"/><path d="M32 22v26"/></svg>',
  Artisanat: '<svg viewBox="0 0 64 64" fill="none" stroke="#0e1b3d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10h20M26 10c0 8-10 12-10 26a16 16 0 0 0 32 0C48 22 38 18 38 10"/></svg>',
  Maison: '<svg viewBox="0 0 64 64" fill="none" stroke="#0e1b3d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 30L32 10l24 20M14 26v28h36V26M26 54V38h12v16"/></svg>',
  Mode: '<svg viewBox="0 0 64 64" fill="none" stroke="#0e1b3d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8l-14 10 6 8 8-4v34h20V22l8 4 6-8L42 8c-2 6-18 6-20 0z"/></svg>',
};

const PRODUCTS = [
  { id: 1, name: "Dattes Deglet Nour, 1 kg", seller: "Palmeraie de Biskra", price: 1200, cat: "Alimentation", region: "Biskra" },
  { id: 2, name: "Huile d'olive de Kabylie, 1 L", seller: "Moulin Ath Yenni", price: 1500, cat: "Alimentation", region: "Tizi Ouzou" },
  { id: 3, name: "Miel de jujubier, 500 g", seller: "Ruchers de Djelfa", price: 2800, cat: "Alimentation", region: "Djelfa" },
  { id: 4, name: "Poterie peinte de Maâtkas", seller: "Atelier Tafsut", price: 3200, cat: "Artisanat", region: "Tizi Ouzou" },
  { id: 5, name: "Tapis de Ghardaïa, 120 × 80 cm", seller: "Coopérative Mzab", price: 14500, cat: "Maison", region: "Ghardaïa" },
  { id: 6, name: "Plateau en cuivre martelé", seller: "Cuivres de Constantine", price: 6900, cat: "Artisanat", region: "Constantine" },
  { id: 7, name: "Burnous en laine", seller: "Tisseurs de Tiaret", price: 18500, cat: "Mode", region: "Tiaret" },
  { id: 8, name: "Sac en cuir, fait main", seller: "Maroquinerie Tlemcen", price: 7400, cat: "Mode", region: "Tlemcen" },
  { id: 9, name: "Service à thé en laiton", seller: "Dinanderie d'Alger", price: 5600, cat: "Maison", region: "Alger" },
  { id: 10, name: "Coussin brodé, motif Aurès", seller: "Brodeuses de Batna", price: 2400, cat: "Maison", region: "Batna" },
  { id: 11, name: "Figues sèches de Béjaïa, 1 kg", seller: "Verger Soummam", price: 900, cat: "Alimentation", region: "Béjaïa" },
  { id: 12, name: "Bijou en argent, motif kabyle", seller: "Bijoutiers d'Ath Yenni", price: 9800, cat: "Mode", region: "Tizi Ouzou" },
];

const fmt = (n) => n.toLocaleString("fr-FR").replace(/ /g, " ") + " DA";
const $ = (s) => document.querySelector(s);
let cart = {};
let category = "Tout";
let query = "";

/* ---- delivery estimator ---- */
const sel = $("#wilaya");
WILAYAS.forEach((w, i) => sel.add(new Option(w.name, i)));
sel.value = 1; // Oran par défaut
function updateEstimate() {
  const w = WILAYAS[sel.value];
  $("#estDays").textContent = w.days;
  $("#estFee").textContent = fmt(w.fee);
  $("#estNote").textContent = w.note;
}
sel.addEventListener("change", updateEstimate);
updateEstimate();

/* ---- catalog ---- */
const cats = ["Tout", ...new Set(PRODUCTS.map((p) => p.cat))];
const chips = $("#chips");
cats.forEach((c) => {
  const b = document.createElement("button");
  b.className = "chip";
  b.textContent = c;
  b.setAttribute("aria-pressed", c === category);
  b.addEventListener("click", () => {
    category = c;
    chips.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", x === b));
    renderGrid();
  });
  chips.appendChild(b);
});

function renderGrid() {
  const q = query.trim().toLowerCase();
  const list = PRODUCTS.filter(
    (p) => (category === "Tout" || p.cat === category) && (!q || (p.name + p.seller + p.region).toLowerCase().includes(q))
  );
  $("#empty").hidden = list.length > 0;
  $("#grid").innerHTML = list
    .map(
      (p) => `<li class="card">
        <div class="thumb" style="background:${COLORS[p.cat]}">${ICONS[p.cat]}<span class="region">${p.region}</span></div>
        <div class="card-body">
          <h3>${p.name}</h3>
          <span class="seller">${p.seller}</span>
          <div class="card-foot">
            <span class="price">${fmt(p.price)}</span>
            <button class="add" data-id="${p.id}" aria-label="Ajouter ${p.name} au panier">Ajouter</button>
          </div>
        </div></li>`
    )
    .join("");
}
$("#grid").addEventListener("click", (e) => {
  const b = e.target.closest(".add");
  if (!b) return;
  const id = +b.dataset.id;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  toast("Ajouté au panier");
});
$("#searchForm").addEventListener("submit", (e) => e.preventDefault());
$("#q").addEventListener("input", (e) => {
  query = e.target.value;
  renderGrid();
});

/* ---- cart ---- */
function renderCart() {
  const ids = Object.keys(cart);
  const count = ids.reduce((s, id) => s + cart[id], 0);
  let total = 0;
  $("#cartCount").textContent = count;
  $("#lines").innerHTML = ids
    .map((id) => {
      const p = PRODUCTS.find((x) => x.id === +id);
      total += p.price * cart[id];
      return `<li class="line"><b>${p.name}</b><button data-rm="${id}">Retirer</button><small>${cart[id]} × ${fmt(p.price)}</small></li>`;
    })
    .join("");
  $("#cartEmpty").hidden = ids.length > 0;
  $("#total").textContent = fmt(total);
  $("#order").disabled = ids.length === 0;
}
$("#lines").addEventListener("click", (e) => {
  const id = e.target.dataset.rm;
  if (!id) return;
  delete cart[id];
  renderCart();
});
function setDrawer(open) {
  const d = $("#drawer");
  if (open) {
    d.hidden = false;
    requestAnimationFrame(() => d.classList.add("open"));
  } else {
    d.classList.remove("open");
    setTimeout(() => (d.hidden = true), 250);
  }
  $("#cartBtn").setAttribute("aria-expanded", open);
}
$("#cartBtn").addEventListener("click", () => setDrawer(true));
$("#closeCart").addEventListener("click", () => setDrawer(false));
document.addEventListener("keydown", (e) => e.key === "Escape" && setDrawer(false));
$("#order").addEventListener("click", () => {
  cart = {};
  renderCart();
  setDrawer(false);
  toast("Commande envoyée. Vous payez à la livraison.");
});

let t;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(t);
  t = setTimeout(() => el.classList.remove("show"), 2200);
}

renderGrid();
renderCart();
