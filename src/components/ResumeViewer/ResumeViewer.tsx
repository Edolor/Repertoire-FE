"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { AnimatePresence, motion } from "motion/react";
import Icon from "@/components/Icon/Icon";
import { useScrollLock } from "@/lib/scroll-lock";
import { resumeLink } from "@/urls";

// pdf.js worker is copied into /public by scripts/copy-pdf-worker.mjs so it is
// served same-origin (the production CSP is `default-src 'self'`).
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;
const SCALE_STEP = 0.2;
const MAX_PAGE_WIDTH = 900;

type ResumeViewerProps = {
  open: boolean;
  onClose: () => void;
};

export default function ResumeViewer({ open, onClose }: ResumeViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [failed, setFailed] = useState(false);
  const [containerWidth, setContainerWidth] = useState(MAX_PAGE_WIDTH);
  const pageAreaRef = useRef<HTMLDivElement>(null);

  // pdf.js options: disable eval so it runs under the strict production CSP
  // (no 'unsafe-eval'). Memoized: react-pdf reloads the document if the
  // options object identity changes between renders.
  const documentOptions = useMemo(
    () => ({ isEvalSupported: false }),
    []
  );

  // Pause Lenis so the page behind doesn't scroll while the viewer is open.
  useScrollLock(open);

  // Lock body scroll while the overlay is open (same pattern as Header).
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.cssText;
    document.body.style.cssText = "overflow: hidden;";
    return () => {
      document.body.style.cssText = previous;
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Track the available width so pages fit the viewport (incl. mobile).
  useEffect(() => {
    if (!open) return;
    const el = pageAreaRef.current;
    if (!el) return;
    const measure = () =>
      setContainerWidth(Math.min(el.clientWidth - 24, MAX_PAGE_WIDTH));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open]);

  const zoomIn = useCallback(
    () => setScale((s) => Math.min(MAX_SCALE, +(s + SCALE_STEP).toFixed(2))),
    []
  );
  const zoomOut = useCallback(
    () => setScale((s) => Math.max(MIN_SCALE, +(s - SCALE_STEP).toFixed(2))),
    []
  );
  const resetZoom = useCallback(() => setScale(1), []);

  const onDocumentLoad = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      setFailed(false);
    },
    []
  );

  const pageWidth = Math.max(240, containerWidth) * scale;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex flex-col bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Resume preview"
          data-lenis-prevent
          onClick={onClose}
        >
          {/* Toolbar */}
          <div
            className="flex items-center justify-between gap-2 px-3 py-3 bg-white dark:bg-zinc-900 shadow-md sm:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm font-semibold text-black dark:text-zinc-100 sm:text-base">
              Resume{numPages > 0 ? ` · ${numPages} page${numPages > 1 ? "s" : ""}` : ""}
            </span>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={zoomOut}
                aria-label="Zoom out"
                disabled={scale <= MIN_SCALE}
                className="h-9 w-9 rounded-md flex items-center justify-center text-lg font-bold bg-gray-100 dark:bg-zinc-700 text-black dark:text-zinc-100 hover:bg-gray-200 dark:hover:bg-zinc-600 disabled:opacity-40"
              >
                −
              </button>
              <button
                type="button"
                onClick={resetZoom}
                aria-label="Reset zoom"
                className="h-9 px-2 rounded-md text-sm font-semibold bg-gray-100 dark:bg-zinc-700 text-black dark:text-zinc-100 hover:bg-gray-200 dark:hover:bg-zinc-600 tabular-nums"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                type="button"
                onClick={zoomIn}
                aria-label="Zoom in"
                disabled={scale >= MAX_SCALE}
                className="h-9 w-9 rounded-md flex items-center justify-center text-lg font-bold bg-gray-100 dark:bg-zinc-700 text-black dark:text-zinc-100 hover:bg-gray-200 dark:hover:bg-zinc-600 disabled:opacity-40"
              >
                +
              </button>

              <a
                href={resumeLink}
                target="_blank"
                rel="noreferrer"
                aria-label="Open resume in a new tab"
                className="hidden h-9 w-9 rounded-md sm:flex items-center justify-center bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600"
              >
                <Icon name="open-in-new" color="currentColor" classes="h-4 w-4 text-black dark:text-zinc-100" />
              </a>
              <a
                href={resumeLink}
                download
                aria-label="Download resume"
                className="h-9 w-9 rounded-md flex items-center justify-center bg-accent hover:bg-accent/90"
              >
                <Icon name="download" color="#ffffff" classes="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close resume preview"
                className="h-9 w-9 rounded-md flex items-center justify-center bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600"
              >
                <Icon name="close" color="currentColor" classes="h-5 w-5 text-black dark:text-zinc-100" />
              </button>
            </div>
          </div>

          {/* Page area */}
          <div
            ref={pageAreaRef}
            className="flex-1 overflow-auto overscroll-contain py-6 px-3 flex flex-col items-center gap-6"
            onClick={onClose}
          >
            {failed ? (
              <div
                className="m-auto max-w-sm rounded-lg bg-white dark:bg-zinc-900 p-6 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-black dark:text-zinc-100 font-semibold">
                  Couldn&apos;t display the resume here.
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-zinc-400">
                  You can still open or download it directly.
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <a
                    href={resumeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md px-4 py-2 text-sm font-semibold bg-gray-100 dark:bg-zinc-700 text-black dark:text-zinc-100 hover:bg-gray-200 dark:hover:bg-zinc-600"
                  >
                    Open in new tab
                  </a>
                  <a
                    href={resumeLink}
                    download
                    className="rounded-md px-4 py-2 text-sm font-semibold bg-accent text-accent-fg hover:bg-accent/90"
                  >
                    Download
                  </a>
                </div>
              </div>
            ) : (
              <div onClick={(e) => e.stopPropagation()}>
                <Document
                  file={resumeLink}
                  options={documentOptions}
                  onLoadSuccess={onDocumentLoad}
                  onLoadError={() => setFailed(true)}
                  onSourceError={() => setFailed(true)}
                  loading={
                    <div className="flex items-center justify-center py-20">
                      <span className="h-10 w-10 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                    </div>
                  }
                  error={<span className="text-white">Failed to load resume.</span>}
                  className="flex flex-col items-center gap-6"
                >
                  {Array.from({ length: numPages }, (_, i) => (
                    <Page
                      key={`page-${i + 1}`}
                      pageNumber={i + 1}
                      width={pageWidth}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="shadow-2xl rounded-sm overflow-hidden bg-white"
                      loading={
                        <div
                          className="bg-white/10 animate-pulse rounded-sm"
                          style={{ width: pageWidth, height: pageWidth * 1.414 }}
                        />
                      }
                    />
                  ))}
                </Document>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
