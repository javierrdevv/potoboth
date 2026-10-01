import { Desktop, DeviceMobile, WifiSlash } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";

const POINTS = [
  {
    icon: WifiSlash,
    title: "Tidak ada yang diunggah",
    body: "Frame kamera diproses di perangkat kamu. Tidak ada request ke server, tidak ada file yang disimpan di sisi kami.",
  },
  {
    icon: DeviceMobile,
    title: "Jalan di hp dan laptop",
    body: "Photobooth ini cuma memakai API kamera bawaan browser. Jadi bisa dipakai di HP, tablet, atau laptop tanpa adjustment.",
  },
  {
    icon: Desktop,
    title: "Bisa dipakai di layar besar",
    body: "              Buka di laptop yang terhubung ke proyektor atau TV, hasilnya jadi layar tamu yang terisi sendiri.",
  },
];

export function Privacy() {
  return (
    <section id="privasi" className="border-y border-line bg-ink py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className="max-w-[16ch] text-3xl leading-[1.05] font-semibold tracking-tight text-balance text-bg lg:text-4xl">
              Video kamu tidak pernah meninggalkan perangkat.
            </h2>
            <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-bg/80">
              Banyak photobooth digital menyimpan video dan foto di server, lalu
              memakai paket data. Pothobox dibalik: semuanya kerja lokal di browser.
            </p>
          </div>

          <ul className="grid gap-x-8 gap-y-10 lg:col-span-7">
            {POINTS.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={i * 0.06}>
                  <li className="border-t border-bg/15 pt-6">
                    <span className="grid size-10 place-items-center rounded-full bg-bg/10 text-bg">
                      <Icon size={19} weight="regular" />
                    </span>
                    <h3 className="mt-5 text-[17px] font-semibold tracking-tight text-bg">
                      {p.title}
                    </h3>
                    <p className="mt-2 max-w-[44ch] text-[15px] leading-relaxed text-bg/70">
                      {p.body}
                    </p>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}