import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// GET /api/simulations — Liste toutes les simulations
export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("simulation")
    .select("*")
    .order("date_creation", { ascending: false });

  if (error) return NextResponse.json({ error: "Database error" }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/simulations — Crée une simulation
export async function POST(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Body must be a JSON object" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("simulation")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Database error" }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
