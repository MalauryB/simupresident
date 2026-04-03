"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const GA_ID = "G-45WV5RC03R";

export function AnalyticsWrapper() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    try {
      setAccepted(localStorage.getItem("cookie-consent") === "accepted");
    } catch {
      // localStorage unavailable
    }

    const onStorage = () => {
      try {
        setAccepted(localStorage.getItem("cookie-consent") === "accepted");
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", onStorage);

    // Also listen for same-tab changes via a custom event
    const onConsent = () => {
      try {
        setAccepted(localStorage.getItem("cookie-consent") === "accepted");
      } catch {
        // ignore
      }
    };
    window.addEventListener("cookie-consent-change", onConsent);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cookie-consent-change", onConsent);
    };
  }, []);

  if (!accepted) return null;

  return (
    <>
      <Analytics />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
