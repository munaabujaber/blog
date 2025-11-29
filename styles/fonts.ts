import { Press_Start_2P, Inter, JetBrains_Mono } from "next/font/google";


const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pressStart2P",
  display: "swap",
  preload: true,
  fallback: ["cursive", "Arial", "sans-serif"],
  style: ["normal"],
});


const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Arial", "sans-serif"],
  style: ["normal", "italic"],
});


const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jetBrainsMono",
  display: "swap",
  preload: true,
  fallback: ["Fira Mono", "Consolas", "monospace"],
  style: ["normal", "italic"],
});

export { pressStart2P, inter, jetBrainsMono };
