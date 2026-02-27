import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";

type CandidatUpdate = Database["public"]["Tables"]["candidat"]["Update"];

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/candidats/:id
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("candidat")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

// PUT /api/candidats/:id
export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();
  const body: CandidatUpdate = await request.json();

  const { data, error } = await supabase
    .from("candidat")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// DELETE /api/candidats/:id
export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("candidat").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
