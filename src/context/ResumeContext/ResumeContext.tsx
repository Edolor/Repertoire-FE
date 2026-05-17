"use client";
import { createContext, useCallback, useContext, useState } from "react";
import dynamic from "next/dynamic";

// pdf.js touches browser-only APIs, so the viewer is client-only and code-split:
// the (heavy) pdf.js chunk is fetched on first open, not in the initial bundle.
const ResumeViewer = dynamic(
  () => import("@/components/ResumeViewer/ResumeViewer"),
  { ssr: false }
);

type ResumeContextProps = {
  open: () => void;
};
const ResumeContext = createContext<ResumeContextProps>(
  {} as ResumeContextProps
);

export const useResume = () => {
  return useContext(ResumeContext);
};

export default function ResumeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  // Defer mounting (and the dynamic import) until the resume is first opened.
  const [mounted, setMounted] = useState(false);

  const open = useCallback(() => {
    setMounted(true);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ResumeContext.Provider value={{ open }}>
      {children}
      {mounted && <ResumeViewer open={isOpen} onClose={close} />}
    </ResumeContext.Provider>
  );
}
