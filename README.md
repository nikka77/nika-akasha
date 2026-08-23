# nika-akasha

La zone AKASHA de NIKA : le registre encyclopédique (personnages, lieux, artefacts de fiction — Naruto, One Piece, Dragon Ball, Bleach, Hunter x Hunter, JoJo, Death Note, Initial D), servi sous `/learn/akasha` — consomme `nika-liant` (tokens, polices, en-tête) et se déploie sur son propre projet Vercel.
Ce n'est **pas** le cœur NIKA : pas de Nav/Footer/MapOverlay des 9 domaines, pas de NIKO, pas des autres zones — un produit isolé, abandonnable sans rien casser ailleurs (`tasks/migration-zones.md` du dépôt cœur).
Lancer en local : `npm install` puis `npm run dev` — servi sur `http://localhost:3000/learn/akasha` (le `basePath` est posé dans `next.config.ts`). Tests : `npm test`.

## Le miroir des axes — le cœur devient consommateur

`lib/akasha/axes-miroir.mjs` (ex `scripts/lib/akasha-axes.mjs` du dépôt cœur) et `lib/akasha/universe-taxonomy.ts` sont désormais tenus **dans cette zone**, synchronisés mécaniquement par `lib/akasha/miroir-axes.test.ts`. C'était auparavant deux fichiers séparés par un dépôt — le cœur avait le miroir, `lib/akasha` avait la taxonomie. `nika-akasha` est maintenant la **source de vérité des deux**.

Conséquence pour la vague C (réécritures + amaigrissement du cœur) : l'usine du cœur (`scripts/ops-fill-attrs.mjs`, `scripts/agent-worker.mjs` et une dizaine d'autres, recensés par la reconnaissance B0 du 23/08/2026) importe aujourd'hui `scripts/lib/akasha-axes.mjs` en LOCAL. Ce fichier devra soit rester un doublon volontairement synchronisé à la main (mauvaise option — c'est exactement le risque de dérive qui a coûté deux incidents en 08/2026), soit le cœur consommera `nika-akasha` en dépendance git (`github:nikka77/nika-akasha`) pour son usine, comme il consomme déjà `nika-liant`. À trancher par Dan avant la vague C.
