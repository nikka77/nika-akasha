// lib/akasha/prefixe-basepath.test.ts — GARDE-FOU : aucun `/learn/akasha` littéral là où Next le
// rajoute déjà tout seul.
//
// POURQUOI (23/08/2026, jour de la fusion en prod) : la zone vit sous basePath `/learn/akasha`. Next
// préfixe AUTOMATIQUEMENT les href de <Link>, router.push/replace et redirects(). Le code extrait du
// cœur écrivait le préfixe en dur ; l'extraction l'a retiré « partout » — faux : 9 constructeurs
// d'URL l'avaient gardé (rails de catégories/univers, chips d'axes des hubs, cartes Bleach, cartes du
// registre, pagination d'axe, signature de hub). Mesuré en prod : 182 liens « /learn/akasha/learn/
// akasha/u/naruto/… » sur le seul hub Naruto, tous en 404. Le contre-vérificateur n'avait testé que
// dix routes.
//
// Ce test lit les SOURCES (pas le rendu) : toute ligne de app/ ou components/ qui contient le
// préfixe littéral doit appartenir à un contexte où Next ne préfixe PAS — et le dire. Contextes
// autorisés : URL absolue bâtie sur SITE_URL (canonical, og, JSON-LD), `publicPath` des fils
// d'Ariane (JSON-LD), <a href> dur (pas <Link>), <form action> (le navigateur soumet l'URL telle
// quelle), fetch() d'API, et les commentaires. Tout le reste est une erreur.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DOSSIERS = ['app', 'components'];
const PREFIXE = '/learn/akasha';

/** Une ligne est tolérée si elle est un commentaire ou si elle porte un des marqueurs autorisés. */
const AUTORISE = [
  /^\s*(\/\/|\*|\/\*|\{\/\*)/,          // commentaire
  /SITE_URL/, /canonical/, /publicPath/, // URL absolues (SEO, JSON-LD)
  /<a\b[^>]*href=/,                      // <a> dur
  /action=["'`]/,                        // <form action>
  /fetch\(/,                             // appel d'API
  /new URL\(/,                           // URL absolue (redirections serveur)
  /rajouté par Next|basePath-aware|<a> dur|Next ne préfixe pas/, // site relu, commenté comme tel
  /app\/learn\/akasha/,                 // chemin de FICHIER du cœur cité en commentaire multi-ligne
];

function* fichiers(dir: string): Generator<string> {
  for (const nom of readdirSync(dir)) {
    const p = join(dir, nom);
    if (statSync(p).isDirectory()) yield* fichiers(p);
    else if (/\.(tsx?|mjs)$/.test(nom) && !nom.endsWith('.test.ts')) yield p;
  }
}

test('aucun « /learn/akasha » littéral dans un contexte que Next préfixe déjà', () => {
  const fautes: string[] = [];
  for (const dossier of DOSSIERS) {
    for (const f of fichiers(join(ROOT, dossier))) {
      const lignes = readFileSync(f, 'utf8').split('\n');
      lignes.forEach((l, i) => {
        if (!l.includes(PREFIXE)) return;
        if (AUTORISE.some((re) => re.test(l))) return;
        fautes.push(`${relative(ROOT, f)}:${i + 1}: ${l.trim().slice(0, 120)}`);
      });
    }
  }
  assert.deepEqual(fautes, [], `Préfixe basePath écrit en dur là où Next le rajoute (double « /learn/akasha/learn/akasha » garanti en prod) :\n${fautes.join('\n')}`);
});
