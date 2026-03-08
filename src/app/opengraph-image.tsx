import { ImageResponse } from "next/og";

export const alt =
  "Qui sera pr\u00e9sident\u202f? \u2014 Simulateur pr\u00e9sidentielle 2027";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PARTIES = [
  { tag: "LFI", color: "#cc2443" },
  { tag: "EELV", color: "#00c000" },
  { tag: "PS", color: "#ff8080" },
  { tag: "REN", color: "#ffeb00" },
  { tag: "LR", color: "#0066cc" },
  { tag: "RN", color: "#0d378a" },
  { tag: "REC", color: "#8b5cf6" },
];

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#EEEDFF",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(85,108,150,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-60px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,88,77,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "60px 80px",
            gap: "24px",
          }}
        >
          {/* Badge */}
          <div style={{ display: "flex" }}>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#FF584D",
                background: "rgba(255,88,77,0.1)",
                border: "1px solid rgba(255,88,77,0.2)",
                padding: "6px 20px",
                borderRadius: "999px",
                letterSpacing: "3px",
              }}
            >
              {`PR\u00c9SIDENTIELLE 2027`}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: "68px",
              fontWeight: 800,
              color: "#475465",
              lineHeight: 1.05,
              letterSpacing: "-1px",
            }}
          >
            <span>Qui sera </span>
            <span style={{ color: "#FF584D" }}>
              {`pr\u00e9sident\u202f?`}
            </span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "24px",
              color: "#556C96",
              lineHeight: 1.4,
              maxWidth: "700px",
            }}
          >
            {`Simulez l\u2019\u00e9lection avec notre mod\u00e8le Monte-Carlo interactif`}
          </div>

          {/* Party color bar */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              marginTop: "8px",
            }}
          >
            {PARTIES.map((p) => (
              <div
                key={p.tag}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "6px",
                    borderRadius: "3px",
                    background: p.color,
                    opacity: 0.7,
                  }}
                />
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#556C96",
                    letterSpacing: "1px",
                    opacity: 0.6,
                  }}
                >
                  {p.tag}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 80px 40px",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              color: "#556C96",
              fontWeight: 600,
              opacity: 0.5,
            }}
          >
            quiserapresident.fr
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#556C96",
              fontWeight: 500,
              opacity: 0.35,
            }}
          >
            par Nimli
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
