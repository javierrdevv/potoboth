export const FRAME_W = 1000;
export const FRAME_H = 750;
export const PAD = 64;
export const GAP = 20;
export const BRAND_H = 120;

export type Pattern = "none" | "dots" | "stripes" | "sprocket" | "grid" | "rays";
export type Motif = "none" | "star" | "flower" | "sprinkle" | "bolt" | "heart";

export type ThemeField = { key: string; label: string; placeholder: string };

export type Theme = {
  id: string;
  label: string;
  bg: string;
  ink: string;
  accent: string;
  accent2: string;
  headH: number;
  footH: number;
  pattern: Pattern;
  motif: Motif;
  headline?: string;
  fields: ThemeField[];
};

export const THEMES: Theme[] = [
  {
    id: "polos",
    label: "Polos",
    bg: "#ffffff",
    ink: "#09090b",
    accent: "#c8f02a",
    accent2: "#09090b",
    headH: 48,
    footH: BRAND_H,
    pattern: "none",
    motif: "none",
    fields: [],
  },
  {
    id: "ulang-tahun",
    label: "Ulang Tahun",
    bg: "#fff4e6",
    ink: "#3b1e0c",
    accent: "#ff5c8a",
    accent2: "#ffb703",
    headH: 240,
    footH: 200,
    pattern: "rays",
    motif: "sprinkle",
    headline: "HAPPY BIRTHDAY",
    fields: [
      { key: "name", label: "Nama", placeholder: "Nama yangzzles" },
      { key: "date", label: "Tanggal", placeholder: "12 Agustus 2026" },
    ],
  },
  {
    id: "pita",
    label: "Pita Washi",
    bg: "#eef4ff",
    ink: "#0f2744",
    accent: "#7c9cf5",
    accent2: "#ffd166",
    headH: 190,
    footH: 170,
    pattern: "grid",
    motif: "flower",
    fields: [
      { key: "note", label: "Catatan", placeholder: "Sama-sama happy" },
      { key: "from", label: "Dari", placeholder: "Dari Dita & Bagas" },
    ],
  },
  {
    id: "polkadot",
    label: "Polkadot",
    bg: "#fffaf2",
    ink: "#2a1a05",
    accent: "#f26b3a",
    accent2: "#2a1a05",
    headH: 150,
    footH: 150,
    pattern: "dots",
    motif: "none",
    fields: [{ key: "note", label: "Catatan", placeholder: "Best day ever" }],
  },
  {
    id: "film",
    label: "Film",
    bg: "#0b0b0e",
    ink: "#f5f5f4",
    accent: "#e4e4e7",
    accent2: "#a1a1aa",
    headH: 130,
    footH: 150,
    pattern: "sprocket",
    motif: "none",
    fields: [{ key: "note", label: "Label", placeholder: "ROLL 01" }],
  },
  {
    id: "konser",
    label: "Konser",
    bg: "#120a24",
    ink: "#f5f3ff",
    accent: "#d946ef",
    accent2: "#22d3ee",
    headH: 230,
    footH: 190,
    pattern: "stripes",
    motif: "bolt",
    headline: "SEE YOU LIVE",
    fields: [
      { key: "band", label: "Band / Artis", placeholder: "Nama panggung" },
      { key: "date", label: "Tanggal", placeholder: "21 Juni 2026" },
    ],
  },
  {
    id: "wisuda",
    label: "Wisuda",
    bg: "#f2f6fc",
    ink: "#0d1b3e",
    accent: "#1d4ed8",
    accent2: "#b8860b",
    headH: 250,
    footH: 200,
    pattern: "grid",
    motif: "star",
    headline: "SELAMAT WISUDA",
    fields: [
      { key: "name", label: "Nama", placeholder: "Nama lengkap" },
      { key: "major", label: "Program Studi", placeholder: "S1 Teknik Elektro" },
    ],
  },
  {
    id: "pernikahan",
    label: "Pernikahan",
    bg: "#fdf6f0",
    ink: "#4a3728",
    accent: "#b08968",
    accent2: "#7f5539",
    headH: 210,
    footH: 180,
    pattern: "none",
    motif: "flower",
    headline: "SAMPAI KETEMU",
    fields: [
      { key: "names", label: "Nama Pasangan", placeholder: "A & B" },
      { key: "date", label: "Tanggal", placeholder: "9 November 2026" },
    ],
  },
  {
    id: "bayi",
    label: "Bayi",
    bg: "#eefaf4",
    ink: "#12463a",
    accent: "#34c39a",
    accent2: "#ffd9a0",
    headH: 210,
    footH: 180,
    pattern: "dots",
    motif: "heart",
    headline: "SELAMAT LAHIR",
    fields: [
      { key: "name", label: "Nama Bayi", placeholder: "Nama si kecil" },
      { key: "date", label: "Tanggal", placeholder: "3 Oktober 2026" },
    ],
  },
];

export const DEFAULT_THEME = THEMES[0];

export type ThemeText = Record<string, string>;

function motif(
  ctx: CanvasRenderingContext2D,
  kind: Motif,
  x: number,
  y: number,
  r: number,
  color: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();

  if (kind === "star") {
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI / 5) * i - Math.PI / 2;
      const rr = i % 2 === 0 ? r : r * 0.45;
      const px = Math.cos(a) * rr;
      const py = Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  } else if (kind === "flower") {
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      ctx.moveTo(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55);
      ctx.arc(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, r * 0.5, 0, Math.PI * 2);
    }
    ctx.closePath();
    ctx.fill();
  } else if (kind === "heart") {
    ctx.moveTo(0, r * 0.75);
    ctx.bezierCurveTo(-r * 1.4, -r * 0.3, -r * 0.4, -r * 1.2, 0, -r * 0.4);
    ctx.bezierCurveTo(r * 0.4, -r * 1.2, r * 1.4, -r * 0.3, 0, r * 0.75);
    ctx.closePath();
    ctx.fill();
  } else if (kind === "bolt") {
    ctx.moveTo(-r * 0.35, -r);
    ctx.lineTo(r * 0.5, -r * 0.15);
    ctx.lineTo(r * 0.05, -r * 0.15);
    ctx.lineTo(r * 0.35, r);
    ctx.lineTo(-r * 0.5, r * 0.1);
    ctx.lineTo(-r * 0.05, r * 0.1);
    ctx.closePath();
    ctx.fill();
  } else if (kind === "sprinkle") {
    ctx.save();
    ctx.rotate(Math.PI / 5);
    ctx.fillRect(-r, -r * 0.18, r * 2, r * 0.36);
    ctx.restore();
  }

  ctx.restore();
}

function pattern(
  ctx: CanvasRenderingContext2D,
  kind: Pattern,
  w: number,
  h: number,
  accent: string,
  accent2: string,
) {
  if (kind === "none") return;

  ctx.save();
  ctx.globalAlpha = 0.16;

  if (kind === "dots") {
    ctx.fillStyle = accent;
    for (let y = 40; y < h; y += 68) {
      for (let x = 40; x < w; x += 68) {
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (kind === "grid") {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    for (let x = 30; x < w; x += 56) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 30; y < h; y += 56) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  } else if (kind === "stripes") {
    ctx.strokeStyle = accent2;
    ctx.lineWidth = 26;
    for (let i = -h; i < w + h; i += 88) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }
  } else if (kind === "rays") {
    ctx.fillStyle = accent2;
    const cx = w / 2;
    const cy = 0;
    for (let i = 0; i < 16; i += 2) {
      const a1 = (Math.PI * 2 * i) / 16;
      const a2 = (Math.PI * 2 * (i + 1)) / 16;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, w * 1.4, a1, a2);
      ctx.closePath();
      ctx.fill();
    }
  } else if (kind === "sprocket") {
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.85;
    for (let y = 26; y < h - 20; y += 72) {
      for (const x of [18, w - 18 - 40]) {
        ctx.beginPath();
        ctx.roundRect(x, y, 40, 44, 8);
        ctx.fill();
      }
    }
  }

  ctx.restore();
}

function family(varName: string, fallback: string) {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return v ? `${v}, ${fallback}` : fallback;
}

const sans = () => family("--font-outfit", "system-ui, sans-serif");
const mono = () => family("--font-mono-code", "monospace");

function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  size: number,
  weight = 700,
) {
  let s = size;
  do {
    ctx.font = `${weight} ${s}px ${sans()}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    s -= 2;
  } while (s > 14);
  return s;
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  src: CanvasImageSource,
  sw0: number,
  sh0: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  const scale = Math.max(dw / sw0, dh / sh0);
  const sw = dw / scale;
  const sh = dh / scale;
  ctx.drawImage(src, (sw0 - sw) / 2, (sh0 - sh) / 2, sw, sh, dx, dy, dw, dh);
}

export function stripHeight(frames: number, theme: Theme = DEFAULT_THEME) {
  return (
    theme.headH + frames * FRAME_H + (frames - 1) * GAP + GAP + theme.footH
  );
}

export function stripWidth() {
  return FRAME_W + PAD * 2;
}

export async function drawStrip(
  shots: { url: string }[],
  theme: Theme,
  text: ThemeText,
) {
  const frames = Math.max(shots.length, 1);
  const w = stripWidth();
  const h = stripHeight(frames, theme);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Without this, ctx.font silently falls back to system-ui if the webfont has
  // not loaded yet, and the wrong face gets baked permanently into the PNG.
  await document.fonts.ready;

  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, w, h);
  pattern(ctx, theme.pattern, w, h, theme.accent, theme.accent2);

  if (theme.motif !== "none") {
    motif(ctx, theme.motif, PAD + 26, theme.headH / 2, 30, theme.accent);
    motif(ctx, theme.motif, w - PAD - 26, theme.headH / 2, 30, theme.accent2);
  }

  if (theme.headline) {
    const size = fitFont(ctx, theme.headline, w - PAD * 2 - 90, 96);
    ctx.fillStyle = theme.accent;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(theme.headline, w / 2, theme.headH / 2);
ctx.fillStyle = theme.ink;
  ctx.font = `700 ${size}px ${sans()}`;
}

  await Promise.all(
    shots.map(async (shot, i) => {
      const img = new Image();
      img.src = shot.url;
      try {
        await img.decode();
      } catch {
        return;
      }
      const dy = theme.headH + i * (FRAME_H + GAP);
      // No mirror here: capture() already un-mirrors into the JPEG. Mirroring
      // again in the strip would flip the face twice, backwards from preview.
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(PAD, dy, FRAME_W, FRAME_H, 12);
      ctx.clip();
      drawCover(ctx, img, img.naturalWidth, img.naturalHeight, PAD, dy, FRAME_W, FRAME_H);
      ctx.restore();
      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(PAD, dy, FRAME_W, FRAME_H, 12);
      ctx.stroke();
    }),
  );

  const footTop = theme.headH + frames * FRAME_H + (frames - 1) * GAP + GAP;
  ctx.fillStyle = theme.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const values = theme.fields
    .map((f) => text[f.key]?.trim())
    .filter(Boolean) as string[];

  if (values.length > 0) {
    const primary = values[0];
    const size = fitFont(ctx, primary, w - PAD * 2 - 60, 62, 600);
    ctx.font = `600 ${size}px ${sans()}`;
    ctx.fillText(primary, w / 2, footTop + theme.footH * 0.34);

    if (values[1]) {
      ctx.fillStyle = theme.accent;
      const sub = fitFont(ctx, values[1], w - PAD * 2 - 60, 40, 500);
      ctx.font = `500 ${sub}px ${sans()}`;
      ctx.fillText(values[1], w / 2, footTop + theme.footH * 0.63);
    }
  }

  ctx.fillStyle = theme.ink;
  ctx.globalAlpha = 0.55;
  ctx.font = `600 26px ${mono()}`;
  ctx.fillText("POTHOBOX", w / 2, h - 30);
  ctx.globalAlpha = 1;

  return canvas;
}