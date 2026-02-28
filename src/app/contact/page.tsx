"use client";

import { useState, type FormEvent } from "react";
import { BackLink } from "@/app/components/ui/BackLink";

type Status = "idle" | "submitting" | "success" | "error";

interface FormData {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

const initial: FormData = { nom: "", email: "", sujet: "", message: "" };

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Une erreur est survenue.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <BackLink href="/" />

      {/* Badge */}
      <div className="mb-4 text-center">
        <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary">
          CONTACT
        </span>
      </div>

      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-primary-dark sm:text-4xl">
          Nous contacter
        </h1>
        <p className="text-gray-600">
          Une question, une suggestion&nbsp;? &Eacute;crivez-nous.
        </p>
      </div>

      {status === "success" ? (
        <div className="mx-auto max-w-lg rounded-xl border border-green-200 bg-green-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-bold text-primary-dark">
            Message envoy&eacute;&nbsp;!
          </h2>
          <p className="mb-6 text-sm text-gray-600">
            Merci pour votre message. Nous vous r&eacute;pondrons dans les meilleurs d&eacute;lais.
          </p>
          <button
            type="button"
            onClick={() => { setFormData(initial); setStatus("idle"); setErrorMessage(""); }}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent/90"
          >
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto max-w-lg rounded-xl border border-gray-200 bg-white p-6">
          <div className="space-y-5">
            {/* Nom */}
            <div>
              <label htmlFor="nom" className="mb-1 block text-sm font-medium text-primary-dark">
                Nom
              </label>
              <input
                id="nom"
                type="text"
                required
                minLength={2}
                maxLength={100}
                value={formData.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Votre nom"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-primary-dark">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                maxLength={255}
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="votre@email.fr"
              />
            </div>

            {/* Sujet */}
            <div>
              <label htmlFor="sujet" className="mb-1 block text-sm font-medium text-primary-dark">
                Sujet
              </label>
              <input
                id="sujet"
                type="text"
                required
                minLength={3}
                maxLength={200}
                value={formData.sujet}
                onChange={(e) => handleChange("sujet", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Objet de votre message"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium text-primary-dark">
                Message
              </label>
              <textarea
                id="message"
                required
                minLength={10}
                maxLength={5000}
                rows={5}
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Votre message..."
              />
            </div>

            {/* Error */}
            {status === "error" && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "submitting" ? "Envoi en cours..." : "Envoyer le message"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
