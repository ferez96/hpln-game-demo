import { Philosopher, Noto_Serif, Be_Vietnam_Pro, DM_Mono } from "next/font/google";

// Direction B — Hoàng Kim Imperial type system (docs/Typography Spec.dc.html)
export const philosopher = Philosopher({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-philosopher",
  display: "swap",
});

export const notoSerif = Noto_Serif({
  weight: ["400", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-noto-serif",
  display: "swap",
});

export const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});
