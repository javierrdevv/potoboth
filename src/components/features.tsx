import {
  ArrowCounterClockwise,
  CheckCircle,
  Devices,
  ImageSquare,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";

const EXTRAS = [
  {
    icon: ArrowCounterClockwise,
    title: "Hitung mundur otomatis",
    body: "Tiga detik sebelum foto diambil, jadi kamu sempat senyum dan lihat posisi badan.",
  },
  {
    icon: ImageSquare,
    title: "Bingkai selalu sama",
    body: "Setiap foto dipotong rasio yang sama, jadi strip hasil akhirnya rapi dan simetris.",
  },
  {
    icon: CheckCircle,
    title: "Semua dalam satu file",
    body: "Tidak perlu menggabungkan foto satu per satu di aplikasi pengedit gambar.",
  },
];

export function Features() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <h2 className="max-w-[24ch] text-3xl leading-[1.1] font-semibold tracking-tight text-balance lg:text-4xl">
          Yang sudah Handle di dalam photobooth.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3">
          <Reveal className="lg:col-span-3">
            <div className="flex h-full flex-col justify-between gap-8 rounded-2xl bg-accent p-7 text-accent-ink sm:flex-row sm:items-end sm:p-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-10">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-ink/10">
                  <Devices size={21} weight="regular" />
                </span>
                <h3 className="max-w-[20ch] text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
                  Tidak ada yang perlu dipasang.
                </h3>
              </div>
              <p className="max-w-[40ch] shrink-0 text-[16px] leading-relaxed opacity-80 sm:text-right">
                Tidak ada aplikasi, tidak ada driver, tidak ada akun. Buka halamannya
                dan kamerapanya langsung jalan.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-3">
            <ul className="grid gap-x-8 divide-y divide-line border-y border-line md:grid-cols-3 md:divide-y-0">
              {EXTRAS.map((f) => {
                const Icon = f.icon;
                return (
                  <li
                    key={f.title}
                    className="py-7 md:pr-6 md:border-r md:border-line md:last:border-r-0"
                  >
                    <span className="grid size-10 place-items-center rounded-full bg-surface text-ink">
                      <Icon size={19} weight="regular" />
                    </span>
                    <h4 className="mt-5 text-[17px] font-semibold tracking-tight">
                      {f.title}
                    </h4>
                    <p className="mt-2 max-w-[38ch] text-[15px] leading-relaxed text-muted">
                      {f.body}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}