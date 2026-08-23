// components/akasha/Crumbs.tsx — fil d'Ariane 4 niveaux du registre (Refonte L3) :
// Registre → Univers (hub) → Collection (registre filtré) → Fiche. + JSON-LD BreadcrumbList (SEO).
// RSC pur, liens partageables.
import Link from 'next/link';
import { SITE_URL } from '@/lib/site';
import { universeHubSlug } from '@/lib/akasha/universe-taxonomy';
import { registryHref } from '@/lib/akasha/href';

// href (relatif, pour <Link>) → chemin PUBLIC complet (pour le JSON-LD, avec SITE_URL = domaine
// du cœur). '/' devient '/learn/akasha' ; '/?x=1' devient '/learn/akasha?x=1' (pas de '//').
function toPublicPath(href: string): string {
  if (href === '/') return '/learn/akasha'; // publicPath (JSON-LD absolu), pas un <Link>
  return href.startsWith('/?') ? `/learn/akasha${href.slice(1)}` : `/learn/akasha${href}`; // publicPath (JSON-LD absolu)
}

export default function Crumbs({ universe, category, name }: { universe?: string | null; category?: string | null; name: string }) {
  const hub = universe ? universeHubSlug(universe) : null;
  // `href` est SANS le préfixe /learn/akasha (basePath le rajoute pour <Link>, migration en
  // zones du 23/08/2026 — même convention que lib/akasha/href.ts). Le JSON-LD, lui, a besoin de
  // l'URL PUBLIQUE complète (SITE_URL pointe le domaine du cœur) : `publicPath` la reconstruit.
  const items: { label: string; href?: string; publicPath?: string }[] = [
    { label: 'Registre AKASHA', href: '/', publicPath: '/learn/akasha' },
  ];
  if (universe) {
    const href = hub ? `/u/${hub}` : registryHref({ universe });
    items.push({ label: universe, href, publicPath: toPublicPath(href) });
  }
  if (universe && category) {
    const href = registryHref({ universe, cat: category });
    items.push({ label: category, href, publicPath: toPublicPath(href) });
  }
  items.push({ label: name });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      ...(it.publicPath ? { item: `${SITE_URL}${it.publicPath}` } : {}),
    })),
  };

  return (
    <nav aria-label="Fil d'Ariane" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {items.map((it, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <span aria-hidden style={{ fontFamily: 'var(--fo)', fontSize: 10, color: 'var(--td3)' }}>›</span>}
          {it.href ? (
            <Link href={it.href} style={{ display: 'inline-flex', alignItems: 'center', minHeight: 24, padding: '4px 2px', fontFamily: 'var(--fo)', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: i === 0 ? 'uppercase' : 'none', color: 'var(--td2)', textDecoration: 'none' }}>
              {i === 0 ? '← ' : ''}{it.label}
            </Link>
          ) : (
            <span style={{ fontFamily: 'var(--fo)', fontSize: 11.5, fontWeight: 700, color: 'var(--td2)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
