import { Reveal } from "@/components/reveal";
import { StripPreview } from "@/components/strip-preview";
import { THEMES } from "@/lib/photobooth-themes";

export function Layouts() {
  return (
    <section id="layout" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <h2 className="max-w-[26ch] text-3xl leading-[1.1] font-semibold tracking-tight text-balance lg:text-4xl">
          Pilih tema bingkai sesuai acaranya.
        </h2>
        <p className="mt-5 max-w-[58ch] text-[17px] leading-relaxed text-muted">
          Sembilan tema, dari polos sampai scrapbook. Tulis nama, tanggal, atau
          ucapan, lalu semuanya ikut ter-render di file PNG yang kamu unduh.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {THEMES.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.04}>
              <a
                href="#photobooth"
                className="flex h-full flex-col items-center rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-ink"
              >
                <div className="flex w-full flex-1 items-center justify-center py-3">
                  <StripPreview themeId={t.id} className="w-[150px] sm:w-[190px]" />
                </div>
                <p className="mt-3 text-center text-[14px] font-medium">{t.label}</p>
                <p className="mt-1 text-center text-[12px] leading-snug text-muted">
                  {t.fields.length > 0
                    ? t.fields.map((f) => f.label).join(" · ")
                    : "Tanpa teks tambahan"}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}