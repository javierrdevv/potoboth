"use client";

import {
  ArrowCounterClockwise,
  ArrowsClockwise,
  ArrowsOutCardinal,
  Camera,
  DownloadSimple,
  Images,
  SlidersHorizontal,
  SpinnerGap,
  TextT,
  X,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { StripPreview } from "@/components/strip-preview";
import { DEFAULT_FILTER, FILTERS } from "@/lib/filters";
import {
  DEFAULT_THEME,
  FRAME_H,
  FRAME_W,
  GAP,
  PAD,
  THEMES,
  drawStrip,
  stripHeight,
  stripWidth,
  type ThemeText,
} from "@/lib/photobooth-themes";

const COUNTS = [1, 2, 3, 4];
const HISTORY_MAX = 6;
// A 4-frame strip is ~2.4x taller than a 1-frame one, so the sample preview
// has to shrink with the frame count or it overflows the dialog.
const PREVIEW_W: Record<number, string> = {
  1: "260px",
  2: "220px",
  3: "190px",
  4: "158px",
};

type Phase = "idle" | "starting" | "ready" | "countdown" | "done";
type Shot = { url: string };
type HistoryItem = { id: number; url: string; themeId: string };

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

export function Photobooth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef(0);
  const stepRef = useRef(3);
  const idsRef = useRef(1);

  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(4);
  const [shots, setShots] = useState<Shot[]>([]);
  const [tick, setTick] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [themeId, setThemeId] = useState(DEFAULT_THEME.id);
  const [text, setText] = useState<ThemeText>({});
  const [filterId, setFilterId] = useState(DEFAULT_FILTER.id);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [multiCam, setMultiCam] = useState(false);
  const [panel, setPanel] = useState<null | "theme" | "filter" | "text">(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  const theme = THEMES.find((t) => t.id === themeId) ?? DEFAULT_THEME;
  const hasFields = theme.fields.length > 0;
  const filter = FILTERS.find((f) => f.id === filterId) ?? DEFAULT_FILTER;
  const mirrored = facing === "user";

  function stash() {
    if (!preview) return;
    setHistory((prev) => [
      { id: idsRef.current++, url: preview, themeId },
      ...prev,
    ].slice(0, HISTORY_MAX));
  }

  useEffect(() => {
    if (phase !== "done" || shots.length === 0) return;
    let alive = true;
    void drawStrip(shots, theme, text).then((canvas) => {
      if (alive && canvas) setPreview(canvas.toDataURL("image/jpeg", 0.82));
    });
    return () => {
      alive = false;
    };
  }, [phase, shots, theme, text]);

  useEffect(() => {
    if (!panel) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setPanel(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (previewOpen) setPreviewOpen(false);
      else setPanel(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [panel, previewOpen]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setTick(null);
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(
    () => () => {
      stopStream();
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [stopStream],
  );

  function pickTheme(id: string) {
    setThemeId(id);
    const next = THEMES.find((t) => t.id === id) ?? DEFAULT_THEME;
    setText((prev) => {
      const out: ThemeText = {};
      for (const f of next.fields) out[f.key] = prev[f.key] ?? "";
      return out;
    });
    setHovered(null);
  }

  async function start(which: "user" | "environment") {
    setError(null);
    setShots([]);
    setReplaceIndex(null);
    setPhase("starting");
    stopStream();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: which },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setFacing(which);
      const n = (await navigator.mediaDevices.enumerateDevices()).filter(
        (d) => d.kind === "videoinput",
      ).length;
      setMultiCam(n > 1);
      setPhase("ready");
    } catch (e) {
      const name = e instanceof DOMException ? e.name : "";
      setError(
        name === "NotAllowedError" || name === "SecurityError"
          ? "Izin kamera ditolak. Buka izin kamera di pengaturan browser, lalu coba lagi."
          : name === "NotFoundError" || name === "OverconstrainedError"
            ? "Tidak ada kamera yang ditemukan di perangkat ini."
            : "Kamera tidak bisa dinyalakan. Coba lagi, atau coba browser lain.",
      );
      setPhase("idle");
    }
  }

  function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement("canvas");
    canvas.width = FRAME_W;
    canvas.height = FRAME_H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.filter = filter.css;
    if (mirrored) {
      ctx.translate(FRAME_W, 0);
      ctx.scale(-1, 1);
    }
    drawCover(
      ctx,
      video,
      video.videoWidth,
      video.videoHeight,
      0,
      0,
      FRAME_W,
      FRAME_H,
    );
    ctx.restore();

    const url = canvas.toDataURL("image/jpeg", 0.9);
    setShots((prev) => {
      if (replaceIndex !== null) {
        const next = [...prev];
        next[replaceIndex] = { url };
        return next;
      }
      return [...prev, { url }];
    });
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
  }

  function tickDown() {
    stepRef.current -= 1;
    if (stepRef.current > 0) {
      setTick(stepRef.current);
      timerRef.current = setTimeout(tickDown, 1000);
      return;
    }

    capture();
    pendingRef.current -= 1;
    if (pendingRef.current > 0) {
      stepRef.current = 3;
      setTick(3);
      timerRef.current = setTimeout(tickDown, 1000);
    } else {
      setTick(null);
      setPhase("done");
    }
  }

  function begin() {
    clearTimer();
    setTick(3);
    setPhase("countdown");
    timerRef.current = setTimeout(tickDown, 1000);
  }

  function startShoot() {
    stash();
    setShots([]);
    setReplaceIndex(null);
    pendingRef.current = count;
    stepRef.current = 3;
    begin();
  }

  function startReplace(i: number) {
    setReplaceIndex(i);
    pendingRef.current = 1;
    stepRef.current = 3;
    begin();
  }

  async function download() {
    if (shots.length === 0) return;
    const canvas = await drawStrip(shots, theme, text);
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pothobox-${theme.id}-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
    stash();
  }

  function saveHistory(item: HistoryItem) {
    const a = document.createElement("a");
    a.href = item.url;
    a.download = `pothobox-${item.themeId}.png`;
    a.click();
  }

  const live = phase === "ready" || phase === "countdown";
  const retaking = phase === "countdown" && replaceIndex !== null;

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden rounded-2xl border border-line bg-surface"
    >
      <div className="relative border-b border-line px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex gap-1 rounded-full bg-elevated p-1"
            role="group"
            aria-label="Jumlah foto per strip"
          >
            {COUNTS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  if (live) {
                    pendingRef.current = Math.max(
                      0,
                      pendingRef.current + (n - count),
                    );
                  }
                  setCount(n);
                }}
                aria-pressed={count === n}
                className="relative grid size-9 place-items-center rounded-full text-[14px] font-semibold text-muted transition-colors hover:text-ink"
              >
                {count === n && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-bg shadow-sm"
                  />
                )}
                <span className="relative">{n}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {hasFields && (
              <button
                type="button"
                onClick={() => setPanel((v) => (v === "text" ? null : "text"))}
                aria-expanded={panel === "text"}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-medium transition-colors hover:bg-bg ${
                  panel === "text" ? "border-ink bg-bg text-ink" : "border-line text-ink"
                }`}
              >
                <TextT size={14} weight="bold" />
                Teks
              </button>
            )}
            <button
              type="button"
              onClick={() => setPanel((v) => (v === "filter" ? null : "filter"))}
              aria-expanded={panel === "filter"}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-bg"
            >
              <SlidersHorizontal size={14} weight="bold" />
              {filter.label}
            </button>
            <button
              type="button"
              onClick={() => setPanel((v) => (v === "theme" ? null : "theme"))}
              aria-expanded={panel === "theme"}
              className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-bg"
            >
              <span
                aria-hidden
                className="size-3.5 rounded-full border border-line"
                style={{ background: theme.accent }}
              />
              {theme.label}
            </button>
          </div>
        </div>

        {panel === "filter" && (
          <div className="absolute inset-x-0 top-full z-20 rounded-b-2xl border-b border-line bg-surface p-4 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterId(f.id)}
                aria-pressed={f.id === filter.id}
                className={`overflow-hidden rounded-lg border text-[11px] font-medium transition-colors ${
                  f.id === filter.id
                    ? "border-ink text-ink"
                    : "border-line text-muted hover:bg-bg"
                }`}
              >
                <span
                  aria-hidden
                  className="block h-9 w-full bg-linear-to-br from-muted to-ink/60"
                  style={{ filter: f.css }}
                />
                <span className="block px-1.5 py-1.5">{f.label}</span>
              </button>
            ))}
            </div>
          </div>
        )}

        {panel === "theme" && (
          <div className="absolute inset-x-0 top-full z-20 rounded-b-2xl border-b border-line bg-surface p-4 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.5)]">
            <div className="flex items-stretch gap-4">
              <div className="flex min-w-0 flex-1 flex-col justify-start">
                <p className="text-[14px] font-semibold text-ink">
                  {(THEMES.find((t) => t.id === (hovered ?? theme.id)) ?? theme)
                    .label}
                </p>

                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-full border border-line px-2.5 py-1.5 text-[12px] font-medium text-ink transition-colors hover:bg-bg sm:hidden"
                >
                  <ArrowsOutCardinal size={13} weight="bold" />
                  Lihat contoh bingkai
                </button>

                <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:grid-cols-4">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => pickTheme(t.id)}
                onMouseEnter={() => setHovered(t.id)}
                onFocus={() => setHovered(t.id)}
                aria-pressed={t.id === theme.id}
                className={`rounded-lg px-1.5 py-2 text-center transition-colors ${
                  t.id === theme.id
                    ? "bg-ink text-bg"
                    : "bg-elevated text-muted hover:text-ink"
                }`}
              >
                <span className="block truncate text-[12px] leading-tight font-medium">
                  {t.label}
                </span>
              </button>
            ))}
                </div>
              </div>

              <div className="hidden shrink-0 items-start sm:flex">
                <StripPreview
                  themeId={hovered ?? theme.id}
                  text={text}
                  frames={count}
                  className="w-[190px]"
                />
              </div>
            </div>
          </div>
        )}

        {panel === "theme" && previewOpen && (
          <div
            className="fixed inset-0 z-50 flex flex-col bg-bg/95 backdrop-blur-sm sm:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Contoh bingkai"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-[14px] font-semibold text-ink">
                {(THEMES.find((t) => t.id === (hovered ?? theme.id)) ?? theme)
                  .label}
              </p>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                aria-label="Tutup contoh"
                className="grid size-9 place-items-center rounded-full border border-line text-ink"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-5">
              <StripPreview
                themeId={hovered ?? theme.id}
                text={text}
                frames={count}
                className="shrink-0"
                style={{ width: PREVIEW_W[count] }}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 border-t border-line p-4">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setHovered(t.id)}
                  aria-pressed={t.id === (hovered ?? theme.id)}
                  className={`rounded-lg px-2 py-2 text-[12px] font-medium transition-colors ${
                    t.id === (hovered ?? theme.id)
                      ? "bg-ink text-bg"
                      : "bg-elevated text-muted"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {panel === "text" && hasFields && (
          <div className="absolute inset-x-0 top-full z-20 grid gap-2 rounded-b-2xl border-b border-line bg-surface p-4 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.5)] sm:grid-cols-2">
            {theme.fields.map((f) => (
              <label key={f.key} className="block">
                <span className="mb-1 block text-[12px] font-medium text-muted">
                  {f.label}
                </span>
                <input
                  type="text"
                  value={text[f.key] ?? ""}
                  placeholder={f.placeholder}
                  maxLength={40}
                  autoFocus={panel === "text"}
                  onChange={(e) =>
                    setText((prev) => ({ ...prev, [f.key]: e.target.value }))
                  }
                  className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-[14px] text-ink outline-none placeholder:text-muted/60 focus:border-ink"
                />
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="relative aspect-4/3 bg-elevated">
        <video
          ref={videoRef}
          playsInline
          muted
          aria-hidden={!live}
          style={{ filter: filter.css }}
          className={`size-full object-cover ${
            mirrored ? "scale-x-[-1]" : ""
          } ${live ? "opacity-100" : "opacity-0"}`}
        />

        {live && multiCam && !retaking && (
          <button
            type="button"
            onClick={() => {
              stash();
              start(mirrored ? "environment" : "user");
            }}
            aria-label="Ganti kamera"
            className="absolute top-3 right-3 grid size-10 place-items-center rounded-full border border-line bg-bg/80 text-ink backdrop-blur-md transition-colors hover:bg-bg"
          >
            <ArrowsClockwise size={18} weight="bold" />
          </button>
        )}

        <div
          aria-hidden
          className={`absolute inset-0 bg-white transition-opacity duration-150 motion-reduce:hidden ${
            flash ? "opacity-90" : "opacity-0"
          }`}
        />

        {phase === "done" && (
          <div className="absolute inset-0 flex flex-col items-center gap-3 overflow-y-auto bg-elevated p-4">
            <div
              className="relative w-full max-w-[240px] shrink-0"
              style={{ aspectRatio: `${stripWidth()} / ${stripHeight(shots.length, theme)}` }}
            >
              {preview && (
                /* eslint-disable-next-line @next/next/no-img-element -- runtime canvas data URL, next/image cannot optimize it */
                <img
                  src={preview}
                  alt="Preview strip photobooth"
                  className="absolute inset-0 size-full rounded-md object-contain shadow-[0_16px_36px_-20px_rgba(0,0,0,0.45)]"
                />
              )}

              {preview &&
                shots.map((_, i) => {
                  const top = theme.headH + i * (FRAME_H + GAP);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => startReplace(i)}
                      aria-label={`Ulangi foto ${i + 1}`}
                      style={{
                        top: `${(top / stripHeight(shots.length, theme)) * 100}%`,
                        height: `${(FRAME_H / stripHeight(shots.length, theme)) * 100}%`,
                        left: `${(PAD / stripWidth()) * 100}%`,
                        width: `${(FRAME_W / stripWidth()) * 100}%`,
                      }}
                      className="group absolute rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-[6px] bg-black/60 text-white opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                        <ArrowCounterClockwise size={18} weight="bold" />
                        <span className="text-[12px] font-semibold">Ulangi</span>
                      </span>
                    </button>
                  );
                })}
            </div>

            <p className="shrink-0 pb-2 text-center text-[11px] leading-relaxed text-muted">
              Ketuk salah satu foto untuk mengambil ulang.
            </p>
          </div>
        )}

        {history.length > 0 && (
          <div className="border-t border-line px-4 py-3">
            <div className="mb-2 flex items-center gap-1.5 text-muted">
              <Images size={14} weight="bold" />
              <span className="font-mono text-[11px] tracking-[0.12em] uppercase">
                Sesi sebelumnya
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {history.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => saveHistory(item)}
                  title={`Unduh strip ${item.themeId}`}
                  className="group relative h-20 w-14 shrink-0 overflow-hidden rounded-md bg-elevated ring-1 ring-line transition-shadow hover:ring-ink"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- runtime canvas data URLs, next/image cannot optimize them */}
                  <img
                    src={item.url}
                    alt={`Strip ${item.themeId}, ketuk untuk mengunduh`}
                    className="size-full object-cover"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <DownloadSimple size={16} weight="bold" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <span className="grid size-14 place-items-center rounded-full border border-line text-ink">
              <Camera size={24} weight="regular" />
            </span>
            <div>
              <p className="text-[15px] font-medium">Kamera belum menyala</p>
              <p className="mt-1 max-w-[32ch] text-[13px] leading-relaxed text-muted">
                Video tidak pernah dikirim ke server mana pun.
              </p>
            </div>
            {error && (
              <p
                role="alert"
                className="max-w-[44ch] rounded-lg bg-bg px-3 py-2 text-[13px] leading-relaxed text-ink"
              >
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={() => start("user")}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-[14px] font-semibold text-accent-ink transition-transform hover:brightness-105 active:scale-[0.98]"
            >
              <Camera size={16} weight="bold" />
              Nyalakan Kamera
            </button>
          </div>
        )}

        {phase === "starting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <SpinnerGap
              size={24}
              className="animate-spin text-muted motion-reduce:animate-none"
            />
            <p className="text-[14px] text-muted">Menunggu izin kamera</p>
          </div>
        )}

        {tick !== null && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-3">
              <span className="grid size-24 place-items-center rounded-full bg-ink/80 font-mono text-5xl font-semibold text-bg">
                {tick}
              </span>
              {retaking && (
                <span className="rounded-full bg-accent px-3 py-1.5 text-[12px] font-semibold text-accent-ink">
                  Mengulang foto {replaceIndex + 1}
                </span>
              )}
            </div>
          </div>
        )}

        {live && !retaking && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center p-4">
            <button
              type="button"
              onClick={startShoot}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[15px] font-semibold text-accent-ink transition-transform hover:brightness-105 active:scale-[0.98]"
            >
              <Camera size={17} weight="bold" />
              Ambil {count} foto
            </button>
          </div>
        )}

        {live && retaking && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center p-4">
            <button
              type="button"
              onClick={() => {
                clearTimer();
                setReplaceIndex(null);
                setPhase("done");
              }}
              className="rounded-full border border-line bg-bg/80 px-5 py-2.5 text-[14px] font-semibold text-ink backdrop-blur-md"
            >
              Batal
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <span className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
          {shots.length} dari {count} terekam
        </span>

        <div className="flex gap-2">
          {phase === "done" ? (
            <>
              <button
                type="button"
                onClick={startShoot}
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-bg"
              >
                <ArrowCounterClockwise size={15} weight="bold" />
                Ulangi semua
              </button>
              <button
                type="button"
                onClick={download}
                disabled={shots.length === 0}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-[14px] font-semibold text-accent-ink transition-transform hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
              >
                <DownloadSimple size={15} weight="bold" />
                Unduh
              </button>
            </>
          ) : (
            live && (
              <button
                type="button"
                onClick={() => {
                  clearTimer();
                  stopStream();
                  setShots([]);
                  setReplaceIndex(null);
                  setPhase("idle");
                }}
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-bg"
              >
                Matikan
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}