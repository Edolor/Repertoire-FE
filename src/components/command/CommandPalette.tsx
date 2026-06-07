"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { posts } from "#content";
import { NAV, PERSON } from "@/content/site";
import { useResume } from "@/context/ResumeContext/ResumeContext";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import { useScrollLock } from "@/lib/scroll-lock";
import { useOsMode } from "@/components/os/OsModeContext";

type Item = { label: string; run: () => void; group: string };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  useScrollLock(open);
  const router = useRouter();
  const { open: openResume } = useResume();
  const { toggle } = useTheme();
  const { toggle: toggleOsMode, active: osActive } = useOsMode();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  const go = (href: string) => () => {
    setOpen(false);
    router.push(href);
  };

  const items: Item[] = [
    ...NAV.map((n) => ({ label: n.label, run: go(n.href), group: "Navigate" })),
    ...posts
      .filter((p) => !p.draft)
      .map((p) => ({ label: p.title, run: go(p.permalink), group: "Writing" })),
    {
      label: "Open resume",
      run: () => {
        setOpen(false);
        openResume();
      },
      group: "Actions",
    },
    { label: "Toggle theme", run: () => toggle(), group: "Actions" },
    {
      label: osActive ? "Switch to website mode" : "Toggle desktop mode",
      run: () => {
        setOpen(false);
        toggleOsMode();
      },
      group: "Actions",
    },
    {
      label: "Email me",
      run: () => {
        setOpen(false);
        window.location.href = `mailto:${PERSON.email}`;
      },
      group: "Actions",
    },
  ];

  const groups = ["Navigate", "Writing", "Actions"];

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[79] bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-24 z-[80] w-[92vw] max-w-lg -translate-x-1/2 border border-divider bg-bg shadow-2xl focus:outline-none"
        >
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <Command label="Command palette" loop>
            <div className="flex items-center gap-2 border-b border-divider px-3">
              <span className="font-mono text-accent" aria-hidden>
                &gt;
              </span>
              <Command.Input
                autoFocus
                placeholder="Jump to anything…"
                className="w-full bg-transparent py-3 font-mono text-sm outline-none placeholder:text-text/40"
              />
            </div>
            <Command.List className="max-h-72 overflow-auto p-2">
              <Command.Empty className="px-2 py-6 text-center font-mono text-sm text-text/50">
                No matches.
              </Command.Empty>
              {groups.map((g) => (
                <Command.Group
                  key={g}
                  heading={g}
                  className="font-mono text-[10px] uppercase tracking-widest text-text/40 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
                >
                  {items
                    .filter((i) => i.group === g)
                    .map((i) => (
                      <Command.Item
                        key={i.label}
                        onSelect={i.run}
                        className="cursor-pointer px-2 py-2 font-mono text-sm text-text/80 aria-selected:bg-surface aria-selected:text-text"
                      >
                        {i.label}
                      </Command.Item>
                    ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
