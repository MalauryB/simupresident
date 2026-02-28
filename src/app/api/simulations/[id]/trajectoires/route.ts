import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/simulations/:id/trajectoires — Trajectoires de la simulation
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("trajectoire")
    .select("*")
    .eq("simulation_id", id)
    .order("jour");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/simulations/:id/trajectoires — Enregistre les trajectoires (batch)
export async function POST(request: Request, { params }: Params) {
  const { id } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const items = Array.isArray(body) ? body : [body];
  const withSimId = items.map((item: any) => ({ ...item, simulation_id: id }));

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("trajectoire")
    .insert(withSimId)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
