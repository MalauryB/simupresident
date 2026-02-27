import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/simulations/:id/config — Configurations candidats de la simulation
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("config_simulation_candidat")
    .select("*")
    .eq("simulation_id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/simulations/:id/config — Ajoute des configurations candidats (batch)
export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();
  const body = await request.json();

  const items = Array.isArray(body) ? body : [body];
  const withSimId = items.map((item) => ({ ...item, simulation_id: id }));

  const { data, error } = await supabase
    .from("config_simulation_candidat")
    .insert(withSimId)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
