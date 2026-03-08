import { ImageResponse } from "next/og";

export const alt = "Qui pour l\u2019\u00c9lys\u00e9e\u202f? \u2014 Simulateur pr\u00e9sidentielle 2027";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #556C96 0%, #3d4f70 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#FF584D",
              background: "rgba(255,255,255,0.15)",
              padding: "8px 24px",
              borderRadius: "999px",
              letterSpacing: "2px",
            }}
          >
            PR\u00c9SIDENTIELLE 2027
          </div>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            {`Qui pour l\u2019\u00c9lys\u00e9e\u202f?`}
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "rgba(255,255,255,0.8)",
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            {`Simulez l\u2019\u00e9lection avec notre mod\u00e8le interactif`}
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            {["LFI", "EELV", "PS", "REN", "LR", "RN", "REC"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.15)",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            right: "40px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          quipresident.fr
        </div>
      </div>
    ),
    { ...size },
  );
}
