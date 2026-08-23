# nika-akasha — Instructions Claude Code

## Contexte
`nika-akasha` est la zone AKASHA de la super-app NIKA (Côte d'Azur) — le registre encyclopédique
(personnages, lieux, artefacts de fiction), extraite du dépôt cœur dans le cadre de la migration
en zones (`tasks/migration-zones.md` du dépôt `NIKA`). Elle vit sous `/learn/akasha` derrière le
domaine du cœur, dans son propre dépôt GitHub et son propre projet Vercel.

## SELF-LEARNING

### Protocole obligatoire

1. **Début de chaque session** — lire `tasks/lessons.md` en entier avant de toucher au code.
2. **Appliquer chaque règle** listée dans `tasks/lessons.md` avant d'écrire ou modifier quoi que ce soit.
3. **Après chaque correction de Dan** — ajouter immédiatement une entrée dans `tasks/lessons.md` au format :

```
| YYYY-MM-DD | Ce qui s'est mal passé | Règle à suivre la prochaine fois |
```

### Quand ajouter une entrée

- Dan corrige une erreur de code, de design ou de comportement
- Une approche a été rejetée ou refaite
- Un bug a persisté après un premier fix
- Une convention a été rappelée

### Principe

Chaque correction ne doit arriver qu'une seule fois. Si la même erreur se répète, c'est un échec du système.

## Règles absolues

- **Extraire, jamais réécrire** : le code vient du dépôt cœur (`app/learn/akasha`, `components/akasha`,
  `lib/akasha`) copié à l'identique, adapté au STRICT minimum imposé par `basePath`.
- **basePath: '/learn/akasha' rajoute AUTOMATIQUEMENT le préfixe aux `<Link>`/`router.push`/aux
  `source`/`destination` de `redirects()`.** Le code copié depuis le cœur (sans basePath) écrivait
  ces chemins EN DUR avec le préfixe — ADAPTÉ ici (préfixe retiré) partout où il passe par ces
  mécanismes. Les `<a>` DURS et les URL déjà absolues (SITE_URL, `fetch()`,
  `NextResponse.redirect(new URL(...))`) gardent le préfixe littéral, basePath ne les touche pas.
  **Piège vérifié à la main pendant l'implémentation (23/08/2026)** : `lib/akasha/href.ts`
  (`registryHref`), et les builders locaux `villageHref` (`NarutoWorldMap.tsx`) et `registryHref`
  (`OnePieceMap.tsx`) sont consommés À LA FOIS par `<Link>`/`router.push` (préfixe retiré) ET par
  des `<a>` durs (préfixe gardé) — avant de changer un builder d'URL partagé, lister TOUS ses appelants.
- **Liens durs entre zones** : `nika-liant/NikaHeader` (si utilisé) relie vers le cœur et les
  autres zones en `<a href>`, jamais `next/link`. En interne (fiche → fiche, hub → fiche), `next/link`
  est normal.
- **`SITE_URL` reste le domaine du CŒUR** (`NEXT_PUBLIC_APP_URL=https://nika-murex.vercel.app`),
  PAS l'URL de cette zone — les canoniques/OG/sitemap doivent pointer vers les URL publiques
  réelles (`nika-murex.vercel.app/learn/akasha/...`), qui existent encore côté cœur pendant toute
  la migration (rien n'est supprimé avant la vague C).
- `basePath: false` sur une rewrite sert un dossier `public/` SANS le préfixe de zone — utilisé
  pour `/images/akasha/*` (159 fiches, 124 réfs) et `/images/heroes/*` (1 fichier, DomainHero).
- Français partout. Les commentaires disent POURQUOI.
- Pas de dépendance ajoutée sans besoin réel.

## Stack
- Next.js 16 App Router, TypeScript, Tailwind (breakpoints — la quasi-totalité du design est en
  style inline, voir `.claude/skills/NIKA_DESIGN.md` du cœur)
- `nika-liant` (github:nikka77/nika-liant) en dépendance, `transpilePackages: ['nika-liant']`
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`) — mêmes tables que le cœur (`akasha_entries`,
  `akasha_sections`, `akasha_relations`…), même compte, même base (colonne vertébrale commune)
- Déploiement Vercel indépendant (projet `nika-akasha`, équipe `dan-2219cbfb`)
