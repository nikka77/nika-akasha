// app/learn/akasha/random/route.ts — « Surprends-moi » : redirige vers une fiche AU HASARD
// (pondérée vers les entrées imagées pour l'effet wow). Pick par offset aléatoire — pas de
// tri SQL RANDOM() disponible via PostgREST.
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

// 23/08/2026 — l'URL de redirection se bâtit sur SITE_URL (le domaine du CŒUR), plus sur
// `request.url` : derrière la réécriture du cœur (/learn/akasha/* → cette zone), `request.url`
// porte le host de la zone (nika-akasha.vercel.app), et le visiteur atterrissait sur ce host — mesuré
// en prod le jour de la fusion (307 → https://nika-akasha.vercel.app/learn/akasha/matsuba). Le seul
// host public est celui du cœur ; en local sans NEXT_PUBLIC_APP_URL, SITE_URL vaut localhost:3000.
export async function GET(request: Request) {
  const supabase = await createClient();
  const fallback = new URL('/learn/akasha', SITE_URL);
  if (!supabase) return NextResponse.redirect(fallback);

  // Scopé à un univers si ?u= fourni (bouton « Surprends-moi » du hub), sinon tout le registre.
  const universe = new URL(request.url).searchParams.get('u')?.trim() || null;
  // 3 tirages sur 4 parmi les entrées imagées (fiches plus spectaculaires), sinon tout le registre.
  const imagedOnly = Math.random() < 0.75;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const base = (): any => {
    let q = supabase.from('akasha_entries').select('slug', { count: 'exact' });
    if (universe) q = q.eq('universe', universe);
    if (imagedOnly) q = q.not('image_url', 'is', null);
    return q;
  };
  const { count } = await base().range(0, 0);
  if (!count) return NextResponse.redirect(fallback);

  const idx = Math.floor(Math.random() * count);
  const { data } = await base().order('id', { ascending: true }).range(idx, idx);
  const slug = (data as { slug: string }[] | null)?.[0]?.slug;
  return NextResponse.redirect(slug ? new URL(`/learn/akasha/${slug}`, SITE_URL) : fallback);
}
