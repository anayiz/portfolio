# Portfolio — Razika Chachoua

Portfolio statique en HTML, CSS et JavaScript natif, prévu pour GitHub Pages à `https://anayiz.github.io/portfolio/`.

## Développement et publication

Le site ne nécessite ni compilation ni dépendance. Ouvrez `index.html` dans un navigateur pour un aperçu local. Pour tester le service worker et l’installation PWA, servez le dossier en HTTP local (par exemple avec Live Server). Publiez les changements en les poussant sur la branche configurée pour GitHub Pages.

## Modifier les informations

- `index.html` : sections du portfolio, liens de projets, contact et métadonnées SEO.
- `js/app.js` : textes FR/EN/AR, thèmes, filtres, assistant de profil et formulaire.
- `css/styles.css` : mise en page responsive, thèmes et styles d’impression.
- `cv.html` : CV imprimable. Le bouton **Imprimer / Enregistrer en PDF** ouvre la boîte de dialogue du navigateur ; choisir « Enregistrer en PDF » pour obtenir le PDF.
- `manifest.webmanifest`, `service-worker.js`, `assets/favicon.svg` : installation PWA et fonctionnement hors ligne de base.

Le contenu du CV et du portfolio utilise les seules informations connues. Les dates et l’établissement du Master sont laissés à compléter, ainsi que les liens GitHub/LinkedIn et le dépôt du code source.

### Activer le formulaire de contact

Le formulaire fonctionne comme une soumission Formspree lorsqu’un endpoint valide y est configuré. Créez gratuitement un formulaire sur [Formspree](https://formspree.io/), puis remplacez `REMPLACER_ID` dans l’attribut `action` du formulaire `#contactForm` de `index.html` par l’identifiant fourni, au format `https://formspree.io/f/xxxxxxxx`. Sans identifiant, le formulaire prépare un message via l’application e-mail du visiteur (aucune donnée n’est envoyée à un serveur par le site).

### Éléments à compléter avant diffusion

1. Ajouter le PDF définitif du CV si vous préférez un fichier téléchargeable direct plutôt que l’impression de `cv.html`.
2. Confirmer le nom de l’établissement et les dates du Master.
3. Ajouter les dates et détails réels des deux stages.
4. Remplacer les mentions « Code GitHub · À compléter » par les URL des dépôts correspondant aux projets.
5. Ajouter l’URL LinkedIn.
6. Facultatif : ajouter une photo professionnelle et des captures de projets, optimisées en WebP/AVIF avec texte alternatif.
7. Facultatif : créer un endpoint Formspree et le renseigner pour activer l’envoi direct du formulaire.

## Accessibilité, performance et confidentialité

Navigation clavier, lien d’évitement, focus visible, préférences de mouvement réduit, layout mobile-first, SVG léger et aucun framework ni script analytique. La police est chargée depuis Google Fonts avec des familles limitées ; le système utilise des polices de repli si la connexion est indisponible. L’assistant répond uniquement à partir des informations intégrées dans le navigateur, sans API ni collecte.
