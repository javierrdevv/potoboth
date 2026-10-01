const ITEMS = [
  "Pernikahan",
  "Ulang Tahun",
  "Wisuda",
  "Akhir Tahun",
  "Arisan",
  "Baby Shower",
  "Rapat Kantor",
  "Grand Opening",
  "Kondangan",
  "Duki Santai",
];

export function EventMarquee() {
  return (
    <section aria-label="Jenis acara" className="border-y border-line py-5">
      <div className="flex overflow-hidden">
        <ul className="marquee-track flex shrink-0 items-center">
          {[...ITEMS, ...ITEMS, ...ITEMS].map((item, i) => (
            <li
              key={i}
              aria-hidden={i >= ITEMS.length}
              className="flex shrink-0 items-center gap-6 pr-6 text-[13px] font-medium tracking-[0.16em] whitespace-nowrap text-muted uppercase"
            >
              {item}
              <span aria-hidden className="size-1 rounded-full bg-accent" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}