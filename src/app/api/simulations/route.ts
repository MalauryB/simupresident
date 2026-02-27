import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// GET /api/simulations — Liste toutes les simulations
export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("simulation")
    .select("*")
    .order("date_creation", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/simulations — Crée une simulation
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("simulation")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
