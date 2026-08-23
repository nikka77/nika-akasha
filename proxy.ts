// proxy.ts — pont pour les 124 références en chemin RACINE (/images/akasha/…, 12 fichiers,
// lib/akasha/db-cosmos.ts en tête) et le poster DomainHero (/images/heroes/learn.webp) : ce code,
// copié tel quel du cœur (règle « extraire jamais réécrire »), construit ces chemins en dur SANS
// passer par <Link>/next/image basePath-aware — le navigateur les demande donc littéralement,
// sans le préfixe /learn/akasha. Or Next sert TOUJOURS public/ SOUS basePath une fois configuré
// (vérifié à la main le 23/08/2026 : /images/akasha/x 404, /learn/akasha/images/akasha/x 200).
//
// DEUX pièges trouvés en vérifiant à l'écran (pas seulement au build) :
// 1. next.config.ts::rewrites() avec `basePath:false` NE PEUT PAS résoudre ça : Next refuse au
//    build toute destination INTERNE sur une règle basePath:false (« rewrites urls outside of the
//    basePath » — seule une destination http(s) externe est acceptée).
// 2. Un `export const config = { matcher: [...] }` classique ÉCHOUE AUSSI : Next rajoute
//    AUTOMATIQUEMENT le basePath au matcher lui-même (vérifié dans .next/server/functions-config.
//    json : le regexp généré exigeait `/learn/akasha` en préfixe), donc le proxy n'était jamais
//    déclenché sur la requête RÉELLE (sans préfixe) que le navigateur envoie. Solution qui marche,
//    vérifiée par curl : AUCUN `matcher` (le proxy tourne sur toutes les requêtes, basePath n'a
//    rien à auto-préfixer), et le filtrage se fait à la main sur `request.nextUrl.pathname` — qui,
//    lui, reste le chemin RÉEL non préfixé pour une requête hors basePath.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/images/akasha/') || pathname.startsWith('/images/heroes/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/learn/akasha${pathname}`;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
