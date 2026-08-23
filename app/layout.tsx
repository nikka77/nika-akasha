// app/layout.tsx — layout RACINE de la zone AKASHA.
// Fusion de deux couches du cœur : le root layout (html/body/polices/tokens, ici via nika-liant)
// ET la « coquille AKASHA » qui vivait à app/learn/akasha/layout.tsx (barre AKASHA · roue des
// univers · recherche ⌘K) — la zone n'a pas le Nav/Footer/MapOverlay du cœur, ils restent
// spécifiques aux 9 domaines et ne font pas partie de ce qui a été extrait (tasks/migration-zones.md).
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import 'nika-liant/tokens.css';
import { fontVariables } from 'nika-liant/fonts';
import './globals.css';
import { SITE_URL } from '@/lib/site';
import OmniSearch from '@/components/akasha/OmniSearch';
import UniverseWheel from '@/components/akasha/UniverseWheel';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'AKASHA — Le registre de tout ce qui existe | NIKA LEARN',
  description:
    'Akasha : le registre universel NIKA. Personnages, lieux, artefacts, métiers, statuts, pouvoirs et compétences — réels ou imaginés, reliés entre eux.',
};

export const viewport: Viewport = {
  themeColor: '#050C17',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={fontVariables} style={{ scrollBehavior: 'smooth' }}>
      <body>
        <div data-liquid-glass="bar" suppressHydrationWarning className="ak-topbar">
          <Link
            href="/"
            title="Registre AKASHA"
            style={{
              fontFamily: 'var(--fe)', fontStyle: 'italic', fontWeight: 900, fontSize: 14,
              letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--purple)',
              textDecoration: 'none', flexShrink: 0,
            }}
          >
            Akasha
          </Link>
          <span className="ak-topbar-sep" aria-hidden />
          <UniverseWheel />
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <OmniSearch variant="icon" />
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
