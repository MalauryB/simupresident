import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Database } from "@/types/database";

type PartiRow = Database["public"]["Tables"]["parti"]["Row"];
type CandidatRow = Database["public"]["Tables"]["candidat"]["Row"];
type SourceSondageRow = Database["public"]["Tables"]["source_sondage"]["Row"];

// GET /api/initial-data — Retourne partis + candidats + sources de sondage
export async function GET() {
  const supabase = createServerSupabaseClient();

  const [partisRes, candidatsRes, sourcesRes] = await Promise.all([
    supabase.from("parti").select("*").eq("actif", true).order("nom"),
    supabase.from("candidat").select("*").order("parti_tag").order("indice_variante"),
    supabase.from("source_sondage").select("*"),
  ]);

  if (partisRes.error)
    return NextResponse.json({ error: partisRes.error.message }, { status: 500 });
  if (candidatsRes.error)
    return NextResponse.json({ error: candidatsRes.error.message }, { status: 500 });
  if (sourcesRes.error)
    return NextResponse.json({ error: sourcesRes.error.message }, { status: 500 });

  // Grouper les candidats par parti
  const candidatsByParti: Record<string, CandidatRow[]> = {};
  for (const c of candidatsRes.data as CandidatRow[]) {
    if (!candidatsByParti[c.parti_tag]) candidatsByParti[c.parti_tag] = [];
    candidatsByParti[c.parti_tag].push(c);
  }

  // Mapper vers le format frontend PartyData[]
  const parties = (partisRes.data as PartiRow[]).map((p) => ({
    tag: p.tag,
    party: p.nom,
    active: true,
    selectedIdx: 0,
    variants: (candidatsByParti[p.tag] ?? []).map((c) => ({
      name: c.nom,
      initials: c.initiales ?? "",
      polled: c.sonde_individuellement ?? false,
      pollGroup: c.groupe_sondage ?? null,
      attractivite: c.attractivite ?? 0,
      tendance: c.tendance ?? 0,
      left: c.ideologie_gauche ?? 0,
      center: c.ideologie_centre ?? 0,
      right: c.ideologie_droite ?? 0,
      barrage: c.taux_barrage ?? 0,
      startAgrege: c.start_agrege ?? 0,
      startDebiaise: c.start_debiaise ?? 0,
      startCustom: c.start_personnalise ?? 0,
      photoUrl: c.photo_url ?? null,
    })),
  }));

  // Mapper les couleurs par tag
  const partyColors: Record<string, { bg: string; fg: string; accent: string; chart: string }> = {};
  for (const p of partisRes.data as PartiRow[]) {
    partyColors[p.tag] = {
      bg: p.couleur_fond ?? "#556C96",
      fg: p.couleur_texte ?? "#FFFFFF",
      accent: p.couleur_accent ?? "#556C96",
      chart: p.couleur_graphique ?? "#556C96",
    };
  }

  // Mapper les sources de sondage
  const pollSources = (sourcesRes.data as SourceSondageRow[]).map((s) => ({
    id: s.type,
    label: s.libelle ?? s.type,
    desc: s.description ?? "",
    icon: s.icone ?? "📊",
  }));

  return NextResponse.json({ parties, partyColors, pollSources });
}
