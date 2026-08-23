import type { NextConfig } from 'next';

// basePath posé dès la première ligne (consigne migration-zones.md) : la zone vit sous
// /learn/akasha derrière le domaine du cœur une fois les réécritures posées côté nika (vague C).
// En attendant, le déploiement Vercel de cette zone sert directement sous cette même racine —
// les 499 URL publiques AKASHA ne changent pas.
//
// IMPORTANT (23/08/2026) : basePath rajoute AUTOMATIQUEMENT le préfixe aux <Link>/<router.push>
// et aux `source`/`destination` de redirects() — le code copié depuis le cœur (qui écrivait ces
// chemins EN DUR avec /learn/akasha, faute de basePath) a dû être adapté partout où il passe par
// ces mécanismes : liens <Link> internes, 4 appels router.push, le builder registryHref (et ses
// deux variantes locales), les 3 `extras` de universe-taxonomy.ts, et les 48 redirections
// ci-dessous. Les <a> DURS (2 dans NarutoWorldMap.tsx, 1 dans OnePieceMap.tsx) et les URL déjà
// absolues (canonical/openGraph via SITE_URL, fetch(), NextResponse.redirect(new URL(...))) n'ont
// PAS basePath auto-appliqué : leur chemin littéral /learn/akasha est resté inchangé à dessein.
const nextConfig: NextConfig = {
  basePath: '/learn/akasha',
  assetPrefix: '/learn/akasha',
  // Le liant est un paquet TS non buildé : Next doit le transpiler lui-même (cf. son README).
  transpilePackages: ['nika-liant'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Le pont /images/akasha/* (chemins RACINE construits en dur par le code copié du cœur, alors que
  // Next sert public/ SOUS le basePath) — 23/08/2026, deuxième version : Next refuse toute rewrite
  // basePath:false vers une destination INTERNE, mais accepte une destination ABSOLUE… y compris
  // vers ce même déploiement. Un saut HTTP de plus, zéro middleware : l'ancien proxy.ts tournait
  // sur 100 % des requêtes de la zone et, pire, doublait le préfixe des requêtes déjà sous
  // basePath (/learn/akasha/images/akasha/x → 404, mesuré en prod). Derrière le cœur, ce pont ne
  // sert plus : le cœur réécrit /images/akasha/* directement vers /learn/akasha/images/akasha/*.
  // /images/heroes/learn.webp (poster DomainHero) : servi par le cœur lui-même sur le domaine public.
  async rewrites() {
    return [
      { source: '/images/akasha/:path*', destination: 'https://nika-akasha.vercel.app/learn/akasha/images/akasha/:path*', basePath: false },
    ];
  },
  async redirects() {
    return [
      { source: '/skypiea', destination: '/skypiea-lieu', permanent: true },
      { source: '/loguetown', destination: '/loguetown-lieu', permanent: true },
      { source: '/little-garden', destination: '/little-garden-lieu', permanent: true },
      { source: '/water-seven', destination: '/water-seven-lieu', permanent: true },
      { source: '/ile-de-drum', destination: '/drum-island', permanent: true },
      { source: '/ile-des-hommes-poissons', destination: '/fishman-island', permanent: true },
      { source: '/dressrosa', destination: '/dressrosa-lieu', permanent: true },
      { source: '/village-de-shimotsuki', destination: '/shimotsuki-village', permanent: true },
      { source: '/royaume-de-germa', destination: '/germa-kingdom', permanent: true },
      { source: '/alabasta', destination: '/alabasta-lieu', permanent: true },
      { source: '/enies-lobby', destination: '/enies-lobby-lieu', permanent: true },
      { source: '/east-blue-one-piece', destination: '/east-blue', permanent: true },
      { source: '/royaume-de-goa', destination: '/goa-kingdom', permanent: true },
      { source: '/green-bit', destination: '/green-bit-op', permanent: true },
      { source: '/impel-down', destination: '/impel-down-lieu', permanent: true },
      { source: '/royaume-de-lvneel', destination: '/lvneel-kingdom', permanent: true },
      { source: '/royaume-de-luvneel', destination: '/lvneel-kingdom', permanent: true },
      { source: '/ohara', destination: '/ohara-lieu', permanent: true },
      { source: '/punk-hazard', destination: '/punk-hazard-lieu', permanent: true },
      { source: '/reverse-mountain', destination: '/reverse-mountain-lieu', permanent: true },
      { source: '/long-ring-long-land', destination: '/long-ring-long-land-op', permanent: true },
      { source: '/thriller-bark', destination: '/thriller-bark-lieu', permanent: true },
      { source: '/weatheria', destination: '/weatheria-op', permanent: true },
      { source: '/royaume-de-prodence', destination: '/prodence-kingdom', permanent: true },
      { source: '/gotei-13-bleach', destination: '/gotei-13', permanent: true },
      { source: '/baggy-s-delivery', destination: '/buggy-s-delivery', permanent: true },
      { source: '/royaume-de-mogalo', destination: '/mogaro-kingdom', permanent: true },
      { source: '/archipel-de-boing', destination: '/boin-archipelago', permanent: true },
      { source: '/erbaf', destination: '/elbaf', permanent: true },
      { source: '/l-equipage-des-marquereaux', destination: '/l-equipage-des-maquereaux', permanent: true },
      { source: '/shells-town', destination: '/shells-town-op', permanent: true },
      { source: '/archipel-des-sabaody', destination: '/sabaody', permanent: true },
      { source: '/baterilla', destination: '/baterilla-island', permanent: true },
      { source: '/baratie', destination: '/baratie-lieu', permanent: true },
      { source: '/chapeau-de-paille', destination: '/l-equipage-du-chapeau-de-paille', permanent: true },
      { source: '/archipel-conomi', destination: '/conomi-islands', permanent: true },
      { source: '/archipel-des-gecko', destination: '/gecko-islands', permanent: true },
      { source: '/cap-des-jumeaux', destination: '/twin-cape', permanent: true },
      { source: '/ile-aux-cactus', destination: '/cactus-island', permanent: true },
      { source: '/ile-des-animaux-etranges', destination: '/island-of-rare-animals', permanent: true },
      { source: '/pays-des-wa', destination: '/wano', permanent: true },
      { source: '/zo', destination: '/zou', permanent: true },
      { source: '/pays-des-fleurs', destination: '/kano-country', permanent: true },
      { source: '/jet-skis', destination: '/waver', permanent: true },
      { source: '/juushirou-ukitake', destination: '/jushiro-ukitake', permanent: true },
      { source: '/shunsui-jirou-sakuranosuke-kyouraku', destination: '/shunsui-kyoraku', permanent: true },
      { source: '/mont-usui', destination: '/col-usui', permanent: true },
      { source: '/nelliel-tu-oderschvank', destination: '/nelliel', permanent: true },
    ];
  },
};

export default nextConfig;
