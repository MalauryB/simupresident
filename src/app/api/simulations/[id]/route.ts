import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";

type SimulationUpdate = Database["public"]["Tables"]["simulation"]["Update"];

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/simulations/:id — Récupère une simulation avec toutes ses données liées
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const [simulation, config, resultats, trajectoires] = await Promise.all([
    supabase.from("simulation").select("*").eq("id", id).single(),
    supabase
      .from("config_simulation_candidat")
      .select("*")
      .eq("simulation_id", id),
    supabase.from("resultat_candidat").select("*").eq("simulation_id", id),
    supabase
      .from("trajectoire")
      .select("*")
      .eq("simulation_id", id)
      .order("jour"),
  ]);

  if (simulation.error)
    return NextResponse.json({ error: simulation.error.message }, { status: 404 });

  return NextResponse.json({
    ...simulation.data,
    config: config.data,
    resultats: resultats.data,
    trajectoires: trajectoires.data,
  });
}

// PUT /api/simulations/:id
export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();
  const body: SimulationUpdate = await request.json();

  const { data, error } = await supabase
    .from("simulation")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// DELETE /api/simulations/:id — Supprime une simulation (cascade sur config, résultats, trajectoires)
export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("simulation").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
