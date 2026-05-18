"use client";
import Link from "next/link";
import Icon from "@/components/Icon/Icon";
import { useResume } from "@/context/ResumeContext/ResumeContext";
import Image from "next/image";

export default function Footer() {
  const { open: openResume } = useResume();

  return (
    <footer className="w-full bg-black dark:bg-zinc-900 py-4 px-2 sm:py-2">
      <div className="container mx-auto flex flex-col gap-6 items-center justify-between text-white sm:flex-row">
        <p className="text-base sm:text-lg">
          &copy;{new Date().getFullYear()}, Aghoghomena Akasukpe
        </p>

        <Link href="/" className="hidden sm:block">
          <Image src="/logo-white.svg" alt="Logo" width={160} height={51} />
        </Link>

        <button
          type="button"
          onClick={openResume}
          className="flex flex-row items-center text-base font-semibold px-4 pr-5 py-3 bg-white
              text-black gap-x-2 drop-shadow-lg outline-offset-2 outline-white outline-1 focus:outline
              active:drop-shadow-none hover:underline hover:bg-gray-100"
        >
          <Icon name="open-in-new" color="#000000" classes="h-4 w-4" />
          <span>Resume</span>
        </button>
      </div>
    </footer>
  );
}
