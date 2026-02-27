import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";

type PartiUpdate = Database["public"]["Tables"]["parti"]["Update"];

interface Params {
  params: Promise<{ tag: string }>;
}

// GET /api/partis/:tag — Récupère un parti
export async function GET(_request: Request, { params }: Params) {
  const { tag } = await params;
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("parti")
    .select("*")
    .eq("tag", tag)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

// PUT /api/partis/:tag — Met à jour un parti
export async function PUT(request: Request, { params }: Params) {
  const { tag } = await params;
  const supabase = createServerSupabaseClient();
  const body: PartiUpdate = await request.json();

  const { data, error } = await supabase
    .from("parti")
    .update(body)
    .eq("tag", tag)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// DELETE /api/partis/:tag — Supprime un parti
export async function DELETE(_request: Request, { params }: Params) {
  const { tag } = await params;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("parti").delete().eq("tag", tag);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
