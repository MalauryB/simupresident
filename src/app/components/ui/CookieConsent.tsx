"use client";

import { useState, useEffect, useCallback } from "react";

const CONSENT_KEY = "cookie-consent";

type ConsentValue = "accepted" | "refused";

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY) as ConsentValue | null;
      if (stored) {
        setConsent(stored);
      } else {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const accept = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setConsent("accepted");
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-change"));
  }, []);

  const refuse = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "refused");
    setConsent("refused");
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-change"));
  }, []);

  return { consent, visible, accept, refuse };
}

export function CookieConsent() {
  const { visible, accept, refuse } = useCookieConsent();

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div className="mx-auto max-w-lg rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
        <h3 className="mb-1.5 text-sm font-bold text-primary-dark">
          Cookies &amp; mesure d&rsquo;audience
        </h3>
        <p className="mb-4 text-xs leading-relaxed text-gray-600">
          Ce site utilise des cookies analytiques (Vercel Analytics et Google
          Analytics) pour mesurer la fr&eacute;quentation et am&eacute;liorer
          l&rsquo;exp&eacute;rience. Aucune donn&eacute;e personnelle n&rsquo;est
          vendue. Vous pouvez accepter ou refuser.
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={refuse}
            className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
