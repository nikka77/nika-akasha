// lib/supabase/server.ts — LE client Supabase de la zone AKASHA : lecture publique, SANS cookies.
//
// POURQUOI (23/08/2026, après la vague C) : le cœur NIKA construit son client avec
// `createServerClient` de @supabase/ssr et `cookies()` de next/headers — il en a besoin pour ses
// utilisateurs connectés (FOOD, AUTO, RENT…). AKASHA, lui, ne lit jamais une session : zéro
// getUser/getSession/auth dans la zone (vérifié par grep). Or `cookies()` est une API dynamique :
// son seul appel rend CHAQUE page dynamique et neutralise `export const revalidate = 3600` posé sur
// toutes les routes. Mesuré sur la prod du cœur : `cache-control: private, no-cache, no-store` et
// `x-vercel-cache: MISS` sur toutes les fiches, 874 000 invocations de fonction en un mois pour
// ~8 000 URL — le cycle Hobby de Dan dépassé (Fluid CPU 4 h 26 / 4 h, Edge Requests 1,3 M / 1 M).
//
// Sans cookies, les pages qui n'utilisent aucune autre API dynamique (toutes les fiches, les hubs
// sans searchParams) redeviennent ISR : rendues une fois, servies depuis le CDN pendant 1 h. Même
// signature qu'avant (`async createClient()` → client ou null) : aucun appelant à toucher.
import { createClient as creerClient, type SupabaseClient } from '@supabase/supabase-js';

export async function createClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return creerClient(url, key, {
    // Pas de session à persister ni à rafraîchir : on n'en lit jamais.
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
