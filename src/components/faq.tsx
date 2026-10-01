"use client";

import { CaretDown } from "@phosphor-icons/react";
import { useState } from "react";
import { Reveal } from "@/components/reveal";

const QA = [
  {
    q: "Browser apa saja yang bisa menjalankan photobooth ini?",
    a: "Chrome, Edge, Safari, dan Firefox versi terbaru, di HP maupun laptop. Safari di iPhone meminta izin kamera saat pertama kali halaman dibuka.",
  },
  {
    q: "Kenapa kamera tidak bisa dinyalakan?",
    a: "Biasanya karena izin kamera belum diberikan, atau halaman dibuka lewat koneksi yang tidak aman. Izinkan kamera lewat ikon kunci di address bar, lalu muat ulang halaman.",
  },
  {
    q: "Apakah fotonya tersimpan di suatu tempat?",
    a: "Tidak. Setiap frame diproses di perangkat kamu dan langsung dibuang setelah strip selesai dirangkai. Tidak ada yang dikirim ke server kami.",
  },
  {
    q: "Bisakah dipakai untuk acara dengan banyak tamu?",
    a: "Bisa. Taruh laptop atau tablet yang jalankan photobooth ini di dekat area foto, sambungkan ke proyektor atau TV, dan setiap tamu bisa langsung ambil stripnya sendiri.",
  },
  {
    q: "Kenapa gratisnya tidak ikut berubah?",
    a: "Semua pemrosesan foto jalan di perangkat kamu, jadi kami tidak perlu membayar server atau penyimpanan. Itu sebabnya tidak ada biaya yang perlu ditambahkan.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-line py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 className="max-w-[14ch] text-3xl leading-[1.1] font-semibold tracking-tight text-balance lg:text-4xl">
              Pertanyaan yang sering masuk.
            </h2>
          </div>

          <Reveal delay={0.06} className="lg:col-span-8">
            <div className="divide-y divide-line border-y border-line">
              {QA.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div key={item.q}>
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="flex w-full items-start justify-between gap-6 py-6 text-left"
                      >
                        <span className="text-[16px] leading-snug font-medium sm:text-[17px]">
                          {item.q}
                        </span>
                        <CaretDown
                          size={18}
                          weight="bold"
                          aria-hidden
                          className={`mt-0.5 shrink-0 text-muted transition-transform duration-300 motion-reduce:transition-none ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </h3>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-[62ch] pr-8 pb-7 text-[15px] leading-relaxed text-muted sm:text-[16px]">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}