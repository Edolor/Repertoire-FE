import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That path does not resolve.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 font-mono">
      <div className="text-center">
        <p className="text-accent">&gt; 404</p>
        <h1 className="mt-2 text-3xl font-bold">command not found</h1>
        <p className="mt-2 text-text/65">That path does not resolve.</p>
        <Link
          href="/"
          className="mt-6 inline-block text-accent-2 hover:underline"
        >
          &gt; cd ~
        </Link>
      </div>
    </main>
  );
}
