import { KoHo, Bungee_Inline } from "next/font/google";

export const koho = KoHo({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-sans-koho",
    fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

export const bungee = Bungee_Inline({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-serif-bungee",
    fallback: ['Georgia', 'Times New Roman', 'serif'],
});