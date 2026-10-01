import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Pothobox, photobooth gratis di browser. Tampilan strip foto dengan bingkai lime.";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#09090b",
          padding: 72,
          gap: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 999,
                background: "#c8f02a",
              }}
            />
            <div style={{ fontSize: 30, color: "#c8f02a", letterSpacing: 2 }}>
              POTHOBOX
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 76,
                lineHeight: 1.05,
                fontWeight: 700,
                color: "#fafafa",
                letterSpacing: -2,
              }}
            >
              Photobooth yang jalan di browser.
            </div>
            <div
              style={{
                marginTop: 24,
                fontSize: 32,
                color: "#a1a1aa",
                lineHeight: 1.4,
              }}
            >
              Gratis, tanpa akun, tanpa server.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 300,
            padding: 14,
            borderRadius: 20,
            background: "#ffffff",
            gap: 10,
          }}
        >
          <div style={{ width: "100%", height: 12, background: "#c8f02a", borderRadius: 999 }} />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "100%",
                height: 190,
                borderRadius: 8,
                background: ["#3f3f46", "#52525b", "#71717a"][i],
              }}
            />
          ))}
        </div>
      </div>
    ),
    size,
  );
}