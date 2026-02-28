import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

interface ContactBody {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

function validate(body: unknown): { ok: true; data: ContactBody } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Le corps de la requête doit être un objet JSON." };
  }
  const { nom, email, sujet, message } = body as Record<string, unknown>;

  if (typeof nom !== "string" || nom.trim().length < 2 || nom.trim().length > 100) {
    return { ok: false, error: "Le nom doit contenir entre 2 et 100 caractères." };
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
    return { ok: false, error: "Adresse email invalide." };
  }
  if (typeof sujet !== "string" || sujet.trim().length < 3 || sujet.trim().length > 200) {
    return { ok: false, error: "Le sujet doit contenir entre 3 et 200 caractères." };
  }
  if (typeof message !== "string" || message.trim().length < 10 || message.trim().length > 5000) {
    return { ok: false, error: "Le message doit contenir entre 10 et 5000 caractères." };
  }

  return {
    ok: true,
    data: {
      nom: nom.trim(),
      email: email.trim().toLowerCase(),
      sujet: sujet.trim(),
      message: message.trim(),
    },
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("message_contact").insert(result.data);

  if (error) {
    return NextResponse.json({ error: "Erreur lors de l'envoi du message." }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
