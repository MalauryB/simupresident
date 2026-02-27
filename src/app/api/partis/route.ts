import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// GET /api/partis — Liste tous les partis
export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("parti").select("*").order("nom");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/partis — Crée un parti
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const body = await request.json();

  const { data, error } = await supabase.from("parti").insert(body).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
