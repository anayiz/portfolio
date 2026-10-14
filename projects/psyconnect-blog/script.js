// Articles d'exemple : remplacez-les par les vôtres.
const MOODS = [
  { id: "stresse", label: "Stressé·e", color: "#ffd9d0", msg: "Le stress est une réaction normale. Voici des idées simples pour redescendre." },
  { id: "anxieux", label: "Anxieux·se", color: "#b9b4f0", msg: "Vous n'êtes pas seul·e. Ces articles expliquent l'anxiété et donnent des repères concrets." },
  { id: "fatigue", label: "Fatigué·e", color: "#bfe8d8", msg: "Le repos fait partie de la santé mentale. Voici comment mieux récupérer." },
  { id: "triste", label: "Triste", color: "#d6e4ff", msg: "La tristesse a besoin de place. Ces lectures peuvent vous accompagner doucement." },
  { id: "bien", label: "Plutôt bien", color: "#fff1b8", msg: "Parfait. Voici de quoi entretenir ce qui fonctionne pour vous." },
];

const ARTICLES = [
  { t: "Comprendre une crise d'angoisse en 5 minutes", d: "Ce qui se passe dans le corps, pourquoi cela finit toujours par passer, et trois gestes pour traverser le pic.", min: 5, cat: "Anxiété", m: ["anxieux", "stresse"] },
  { t: "Le sommeil, premier allié du moral", d: "Pourquoi dormir mal change notre humeur, et comment créer une routine du soir réaliste.", min: 7, cat: "Sommeil", m: ["fatigue", "anxieux"] },
  { t: "Quand la tristesse dure : comment en parler", d: "Reconnaître la différence entre une période difficile et une dépression, et trouver les premiers mots.", min: 8, cat: "Humeur", m: ["triste"] },
  { t: "Dire non sans culpabiliser", d: "Poser une limite est un acte de respect, pour vous et pour les autres. Des phrases simples pour commencer.", min: 6, cat: "Relations", m: ["stresse", "fatigue"] },
  { t: "Étudiant·e et stressé·e avant les examens", d: "Organiser ses révisions, protéger ses nuits et garder du temps pour soi pendant la période d'examens.", min: 6, cat: "Études", m: ["stresse", "anxieux"] },
  { t: "Marcher 20 minutes : l'exercice le plus simple", d: "Ce que dit la recherche sur la marche, l'humeur et la concentration, sans équipement ni abonnement.", min: 4, cat: "Habitudes", m: ["triste", "fatigue", "bien"] },
  { t: "Tenir un journal de gratitude sans se forcer", d: "Une méthode de trois lignes par soir pour remarquer ce qui va bien, même les jours moyens.", min: 5, cat: "Habitudes", m: ["bien", "triste"] },
  { t: "Pourquoi on se compare, et comment arrêter d'y perdre du temps", d: "Les réseaux sociaux montrent des vies filtrées. Quelques repères pour garder les pieds sur terre.", min: 7, cat: "Réseaux sociaux", m: ["anxieux", "bien"] },
];

const $ = (s) => document.querySelector(s);
const face = (c, bad) => `<span class="face" style="background:${c}"><svg viewBox="0 0 24 24" fill="none" stroke="#2b2a5c" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="10" r=".6" fill="#2b2a5c"/><circle cx="16" cy="10" r=".6" fill="#2b2a5c"/><path d="${bad}"/></svg></span>`;
const MOUTH = { stresse: "M8 16c2-1.5 6-1.5 8 0", anxieux: "M8 16h8", fatigue: "M8 15c2 1 6 1 8 0", triste: "M8 17c2-2 6-2 8 0", bien: "M8 14c2 3 6 3 8 0" };

let current = null;
const moods = $("#moods");
MOODS.forEach((m) => {
  const b = document.createElement("button");
  b.className = "mood";
  b.setAttribute("aria-pressed", "false");
  b.innerHTML = face(m.color, MOUTH[m.id]) + m.label;
  b.addEventListener("click", () => {
    current = m.id;
    moods.querySelectorAll(".mood").forEach((x) => x.setAttribute("aria-pressed", x === b));
    $("#moodMsg").textContent = m.msg;
    $("#reset").hidden = false;
    $("#artTitle").textContent = "Articles pour vous";
    render();
    $("#articles").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });
  moods.appendChild(b);
});

$("#reset").addEventListener("click", () => {
  current = null;
  moods.querySelectorAll(".mood").forEach((x) => x.setAttribute("aria-pressed", "false"));
  $("#moodMsg").textContent = "Aucune réponse n'est mauvaise. Cette sélection reste sur votre appareil.";
  $("#reset").hidden = true;
  render();
});

function render() {
  const list = ARTICLES.filter((a) => !current || a.m.includes(current));
  $("#list").innerHTML = list
    .map((a) => `<li class="post"><span class="meta">${a.cat} · ${a.min} min de lecture</span><h3>${a.t}</h3><p>${a.d}</p><a href="#">Lire l'article</a></li>`)
    .join("");
}
render();

/* Breathing exercise 4-4-6 */
const orb = $("#orb"), txt = $("#orbText"), btn = $("#breatheBtn"), live = $("#breatheLive");
let running = false, timers = [];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

function phase(name, label, ms) {
  orb.className = "orb " + name;
  txt.textContent = label;
  live.textContent = label;
  return new Promise((res) => timers.push(setTimeout(res, ms)));
}
async function run() {
  running = true;
  btn.textContent = "Arrêter";
  for (let i = 0; i < 6 && running; i++) {
    await phase("inhale", "Inspirez", 4000);
    if (!running) break;
    await phase("hold", "Retenez", 4000);
    if (!running) break;
    await phase("exhale", "Expirez", 6000);
  }
  stop();
}
function stop() {
  running = false;
  timers.forEach(clearTimeout);
  timers = [];
  orb.className = "orb";
  txt.textContent = "Prêt";
  btn.textContent = "Commencer";
}
btn.addEventListener("click", () => (running ? stop() : run()));
