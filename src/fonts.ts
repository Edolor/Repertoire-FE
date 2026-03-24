import { KoHo, Bungee_Inline } from "next/font/google";

export const koho = KoHo({ 
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-sans-koho",
});

export const bungee = Bungee_Inline({ 
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-serif-bungee",
});