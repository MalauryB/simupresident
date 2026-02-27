import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";

type SourceSondageUpdate = Database["public"]["Tables"]["source_sondage"]["Update"];

interface Params {
  params: Promise<{ type: string }>;
}

// GET /api/sources-sondage/:type
export async function GET(_request: Request, { params }: Params) {
  const { type } = await params;
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("source_sondage")
    .select("*")
    .eq("type", type)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

// PUT /api/sources-sondage/:type
export async function PUT(request: Request, { params }: Params) {
  const { type } = await params;
  const supabase = createServerSupabaseClient();
  const body: SourceSondageUpdate = await request.json();

  const { data, error } = await supabase
    .from("source_sondage")
    .update(body)
    .eq("type", type)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// DELETE /api/sources-sondage/:type
export async function DELETE(_request: Request, { params }: Params) {
  const { type } = await params;
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("source_sondage").delete().eq("type", type);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
