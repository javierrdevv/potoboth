import { Camera, Lock } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Photobooth } from "@/components/photobooth";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <section className="pt-4 pb-12 sm:pt-6 sm:pb-16 lg:pt-8 lg:pb-20">
      <div className="mx-auto grid max-w-[1400px] items-start gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <div className="lg:col-span-5 lg:pt-6">
          <Reveal>
            <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Photobooth yang jalan di browser.
            </h1>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-muted">
              Nyalakan kamera, ambil beberapa foto, jadi satu strip. Gratis, tanpa
              aplikasi, tanpa akun, tanpa server.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="#photobooth"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[15px] font-semibold text-accent-ink transition-transform hover:brightness-105 active:scale-[0.98]"
              >
                <Camera size={16} weight="bold" />
                Nyalakan Kamera
              </Link>
              <Link
                href="#privasi"
                className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:bg-surface active:scale-[0.98]"
              >
                <Lock size={16} weight="bold" />
                Kenapa aman
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-10 flex items-start gap-3 border-t border-line pt-6 text-[14px] leading-relaxed text-muted">
              <Camera size={17} weight="regular" className="mt-0.5 shrink-0" />
              Langsung coba di sebelah. Kamera hanya hidup selama kamu menyalakannya.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div id="photobooth">
            <Photobooth />
          </div>
        </Reveal>
      </div>
    </section>
  );
}