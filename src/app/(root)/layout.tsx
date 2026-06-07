import ResumeProvider from "@/context/ResumeContext/ResumeContext";
import { ScrollProgress } from "@/components/primitives/ScrollProgress";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CommandPalette } from "@/components/command/CommandPalette";
import OsModeProvider from "@/components/os/OsModeContext";
import { OsGate } from "@/components/os/OsGate";

export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResumeProvider>
      <OsModeProvider>
        <OsGate>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-accent-fg"
          >
            Skip to content
          </a>
          <CommandPalette />
          <ScrollProgress />
          <Header />
          <main id="main" className="pt-16">
            {children}
          </main>
          <Footer />
        </OsGate>
      </OsModeProvider>
    </ResumeProvider>
  );
}
