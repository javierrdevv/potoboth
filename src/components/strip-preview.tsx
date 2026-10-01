import Image from "next/image";
import type { CSSProperties } from "react";
import {
  FRAME_H,
  GAP,
  THEMES,
  stripHeight,
  stripWidth,
  type ThemeText,
} from "@/lib/photobooth-themes";

const W = stripWidth();

/** Canvas px at full strip width -> CSS that scales with the rendered width. */
function pct(v: number) {
  return `${(v / W) * 100}cqw`;
}

export const SAMPLES: Record<string, ThemeText> = {
  "ulang-tahun": { name: "Raka", date: "12 Agustus 2026" },
  pita: { note: "Sama-sama happy", from: "Dita & Bagas" },
  polkadot: { note: "Best day ever" },
  film: { note: "ROLL 01" },
  konser: { band: "Maudy Ayunda", date: "21 Juni 2026" },
  wisuda: { name: "Ayu Lestari", major: "S1 Teknik Elektro" },
  pernikahan: { names: "Bagas & Dita", date: "9 November 2026" },
  bayi: { name: "Kakara", date: "3 Oktober 2026" },
};

export function StripPreview({
  themeId,
  text,
  frames = 3,
  className = "",
  style,
}: {
  themeId: string;
  text?: ThemeText;
  frames?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
  const h = stripHeight(frames, theme);
  const sample = SAMPLES[themeId] ?? {};

  const values = theme.fields
    .map((f) => (text?.[f.key] ?? sample[f.key] ?? "").trim())
    .filter(Boolean);

  return (
    // The container-query wrapper must be the PARENT: cqw on the element that
    // establishes the container resolves against the viewport, not itself.
    <div className={`@container mx-auto ${className}`} style={style}>
      <div
        className="flex flex-col overflow-hidden shadow-[0_16px_36px_-20px_rgba(0,0,0,0.45)]"
        style={{
          aspectRatio: `${W} / ${h}`,
          borderRadius: pct(18),
          // PAD is horizontal only: the canvas puts the first frame flush at
          // y = headH and the footer flush at h. Vertical padding here pushed
          // the content past `h` and clipped the last frame.
          paddingLeft: pct(64),
          paddingRight: pct(64),
          background: theme.bg,
          color: theme.ink,
        }}
      >
        {theme.headline && (
          <div
            className="flex items-center justify-center text-center leading-tight font-bold tracking-tight"
            style={{
              flexShrink: 0,
              color: theme.accent,
              height: `${(theme.headH / h) * 100}%`,
              fontSize: pct(84),
            }}
          >
            {theme.headline}
          </div>
        )}

        <div
          className="flex flex-col"
          style={{
            flexShrink: 0,
            height: `${((frames * FRAME_H + (frames - 1) * GAP) / h) * 100}%`,
            gap: pct(20),
          }}
        >
          {Array.from({ length: frames }).map((_, i) => (
            <div
              key={i}
              className="relative min-h-0 flex-1 overflow-hidden"
              style={{ borderRadius: pct(12) }}
            >
              <Image
                src={`https://picsum.photos/seed/pothobox-${themeId}-${i}/700/525`}
                alt=""
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div
          className="flex flex-col items-center justify-center text-center leading-tight"
          style={{
            flexShrink: 0,
            marginTop: pct(GAP),
            height: `${(theme.footH / h) * 100}%`,
            gap: pct(6),
          }}
        >
          {values[0] && (
            <span className="font-semibold" style={{ fontSize: pct(52) }}>
              {values[0]}
            </span>
          )}
          {values[1] && (
            <span
              className="font-medium"
              style={{ color: theme.accent, fontSize: pct(34) }}
            >
              {values[1]}
            </span>
          )}
          <span
            className="font-mono tracking-[0.18em] opacity-55"
            style={{ fontSize: pct(22) }}
          >
            POTHOBOX
          </span>
        </div>
      </div>
    </div>
  );
}