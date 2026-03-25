import localFont from "next/font/local";

export const koho = localFont({
    src: [
        { path: "./fonts/KoHo-Light.woff2", weight: "300", style: "normal" },
        { path: "./fonts/KoHo-Regular.woff2", weight: "400", style: "normal" },
        { path: "./fonts/KoHo-Medium.woff2", weight: "500", style: "normal" },
        { path: "./fonts/KoHo-SemiBold.woff2", weight: "600", style: "normal" },
        { path: "./fonts/KoHo-Bold.woff2", weight: "700", style: "normal" },
    ],
    variable: "--font-sans-koho",
    display: "swap",
    fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

export const bungee = localFont({
    src: [
        { path: "./fonts/BungeeInline-Regular.woff2", weight: "400", style: "normal" },
    ],
    variable: "--font-serif-bungee",
    display: "swap",
    fallback: ['Georgia', 'Times New Roman', 'serif'],
});
