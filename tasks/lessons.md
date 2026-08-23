# Leçons — nika-akasha

| Date | Ce qui s'est mal passé | Règle à suivre la prochaine fois |
|---|---|---|
| 2026-08-23 | Le contre-vérificateur de la vague B a déclaré la parité FAUSSE (cœur 3 sections, zone 8 sur `baby`) en comptant les titres dans le HTML brut : React 19 streame les grands textes hors ligne (`<template id="P:n">` + `<div hidden id="S:n">` recollés par `$RS`), et le cœur (Next 16.2) découpe là où la zone (16.3) ne découpe pas. Dans le DOM, les deux rendent 8. | Une parité se mesure dans le DOM (navigateur) ou, sur le HTML brut, en comptant TOUTES les occurrences du motif y compris dans les morceaux `S:n` — jamais dans le seul bloc inline. Avant de crier à la divergence de données, interroger la base : ici elle avait 8 lignes, donc le « 3 » ne pouvait être qu'un artefact de mesure. |
| 2026-08-23 | `vercel env pull` a laissé un `.env.vercel-check` dans le dépôt, non couvert par `.env*.local`. Non commité, mais rien ne l'empêchait. | `.gitignore` couvre `.env*` entier (sauf `.env.example`). Tout fichier d'env temporaire se crée dans le scratchpad, jamais dans le dépôt. |
