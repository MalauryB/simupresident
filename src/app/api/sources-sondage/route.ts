import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// GET /api/sources-sondage — Liste toutes les sources de sondage
export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("source_sondage")
    .select("*")
    .order("libelle");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/sources-sondage — Crée une source de sondage
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("source_sondage")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
