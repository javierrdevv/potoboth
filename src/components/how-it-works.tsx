import {
  Camera,
  Images,
  DownloadSimple,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";

const STEPS = [
  {
    icon: Camera,
    title: "Nyalakan kamera",
    body: "Klik sekali, lalu izinkan akses kamera. Izinnya hanya berlaku di halaman ini.",
  },
  {
    icon: Images,
    title: "Ambil fotonya",
    body: "Tekan tombol, hitung mundur berjalan, lalu foto diambil otomatis sebanyak yang kamu pilih.",
  },
  {
    icon: DownloadSimple,
    title: "Unduh stripnya",
    body: "Semua foto dirangkai jadi satu file PNG. Tersimpan ke HP, kirim ke grup, atau cetak.",
  },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <h2 className="max-w-[20ch] text-3xl leading-[1.1] font-semibold tracking-tight text-balance lg:text-4xl">
          Tiga langkah, selesai.
        </h2>

        <ol className="mt-12 divide-y divide-line border-y border-line">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={i * 0.06} as="li">
                <div className="grid items-center gap-5 py-8 sm:grid-cols-12 sm:gap-8 lg:py-10">
                  <span className="grid size-11 place-items-center rounded-full border border-line text-ink sm:col-span-1">
                    <Icon size={20} weight="regular" />
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight sm:col-span-4">
                    {step.title}
                  </h3>
                  <p className="max-w-[46ch] text-[16px] leading-relaxed text-muted sm:col-span-7">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}