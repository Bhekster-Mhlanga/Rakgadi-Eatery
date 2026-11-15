import { NextResponse } from "next/server";

/**
 * TEMPORARY setup check - open /api/health in the browser.
 * Reports whether the env vars are set and whether Supabase answers.
 * Returns no secrets. Delete this file before going live.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const result = {
    envUrlSet: Boolean(url),
    envKeySet: Boolean(key),
    supabaseReachable: false as boolean,
    note: "",
  };

  if (!url || !key) {
    result.note = "Add both values to frontend/.env.local and restart npm run dev.";
    return NextResponse.json(result);
  }

  try {
    const res = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: key },
      cache: "no-store",
    });
    result.supabaseReachable = res.ok;
    result.note = res.ok
      ? "Supabase is reachable and the key was accepted."
      : `Supabase answered with status ${res.status}. Check the URL and key.`;
  } catch {
    result.note = "Could not reach Supabase. Check the URL.";
  }

  return NextResponse.json(result);
}
