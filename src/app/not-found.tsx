"use client";
import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";
import { koho, bungee } from "@/fonts";

export const metadata: Metadata = {
  title: "Page not found(404) - Edolor",
  description: "Could not find the requested page",
};

export default function Error() {
  return (
    <main>
      <section className="w-full min-h-[80vh] flex items-center bg-zinc-200 dark:bg-zinc-700">
        <div className="container mx-auto grid place-items-center h-full px-4 sm:px-0">
          {/* <h1 className="font-serif text-7xl dark:text-zinc-100">404</h1> */}
          <h2 className="font-serif text-6xl text-center sm:text-7xl dark:text-zinc-100">
            Page not found
          </h2>
          <p className="text-lg sm:text-xl text-center dark:text-zinc-100 mt-4">
            Unfortunately, the page you are looking for does not exist.
          </p>
          <p className="text-lg sm:text-xl text-center dark:text-zinc-100 mt-1">
            But the are other useful projects.
          </p>

          <div className="flex space-x-8 mt-8 gap-y-3 flex-wrap justify-center">
            <Link
              href="/"
              className="uppercase text-xl font-bold underline hover:no-underline dark:text-zinc-100"
            >
              Home Page
            </Link>
            <Link
              href="/projects"
              className="uppercase text-xl font-bold underline hover:no-underline dark:text-zinc-100"
            >
              Projects
            </Link>
            <Link
              href="/contact"
              className="uppercase text-xl font-bold underline hover:no-underline dark:text-zinc-100"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
