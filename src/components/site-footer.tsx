import { ArrowUp } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <Reveal>
          <div className="rounded-2xl bg-ink p-8 sm:p-12 lg:p-16">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <h2 className="max-w-[20ch] text-3xl leading-[1.05] font-semibold tracking-tight text-balance text-bg sm:text-4xl lg:text-5xl">
                  Gratis, dan akan tetap gratis.
                </h2>
                <p className="mt-5 max-w-[48ch] text-[16px] leading-relaxed text-bg/80 sm:text-[17px]">
                  Tidak ada tombol bayar, tidak ada langganan, tidak ada yang
                  disimpan. Buka halamannya, nyalakan kameranya, selesai.
                </p>
              </div>
              <div className="lg:col-span-4 lg:flex lg:justify-end">
                <Link
                  href="#photobooth"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-[15px] font-semibold text-accent-ink transition-transform hover:brightness-105 active:scale-[0.98] sm:w-auto"
                >
                  Nyalakan Kamera
                  <ArrowUp size={16} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid size-7 place-items-center rounded-[8px] bg-accent"
            >
              <span className="size-2.5 rounded-full bg-accent-ink" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              Pothobox
            </span>
          </div>

          <nav aria-label="Navigasi footer">
            <ul className="-mx-2 flex flex-wrap items-center text-[14px] text-muted">
              <li>
                <Link
                  href="#layout"
                  className="inline-block px-2 py-2 transition-colors hover:text-ink"
                >
                  Layout
                </Link>
              </li>
              <li>
                <Link
                  href="#privasi"
                  className="inline-block px-2 py-2 transition-colors hover:text-ink"
                >
                  Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="inline-block px-2 py-2 transition-colors hover:text-ink"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}