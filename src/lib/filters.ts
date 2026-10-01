export type Filter = {
  id: string;
  label: string;
  css: string;
};

export const FILTERS: Filter[] = [
  { id: "none", label: "Asli", css: "none" },
  { id: "bw", label: "Hitam Putih", css: "grayscale(1) contrast(1.12)" },
  { id: "warm", label: "Hangat", css: "sepia(0.32) saturate(1.18)" },
  { id: "cold", label: "Dingin", css: "saturate(1.15) hue-rotate(-12deg)" },
  { id: "vivid", label: "Pudar", css: "contrast(1.28) saturate(1.45)" },
  { id: "soft", label: "Lembut", css: "brightness(1.06) saturate(0.86)" },
];

export const DEFAULT_FILTER = FILTERS[0];