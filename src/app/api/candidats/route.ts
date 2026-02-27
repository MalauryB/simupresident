import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// GET /api/candidats?parti_tag=xxx — Liste les candidats (filtre optionnel par parti)
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  const partiTag = request.nextUrl.searchParams.get("parti_tag");

  let query = supabase.from("candidat").select("*").order("nom");
  if (partiTag) query = query.eq("parti_tag", partiTag);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/candidats — Crée un candidat
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("candidat")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
