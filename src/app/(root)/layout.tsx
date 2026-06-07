import ResumeProvider from "@/context/ResumeContext/ResumeContext";
import { ScrollProgress } from "@/components/primitives/ScrollProgress";
import { Crosshair } from "@/components/primitives/Crosshair";
import { Spotlight } from "@/components/primitives/Spotlight";
import { SmoothScroll } from "@/components/primitives/SmoothScroll";
import { SectionRail } from "@/components/primitives/SectionRail";
import { ScrollToTop } from "@/components/primitives/ScrollToTop";
import { ChunkRecover } from "@/components/primitives/ChunkRecover";
import { PageTransition } from "@/components/primitives/PageTransition";
import { Toaster } from "@/components/primitives/Toaster";
import { KonamiEgg } from "@/components/primitives/KonamiEgg";
import { SelfDrivingTour } from "@/components/primitives/SelfDrivingTour";
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
          <ChunkRecover />
          <CommandPalette />
          <SmoothScroll />
          <Spotlight />
          <ScrollProgress />
          <Crosshair />
          <SectionRail />
          <ScrollToTop />
          <Toaster />
          <KonamiEgg />
          <SelfDrivingTour />
          <Header />
          <main id="main" className="pt-16">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </OsGate>
      </OsModeProvider>
    </ResumeProvider>
  );
}
