import Link from "next/link";
import Icon from "@/components/Icon/Icon";
import { resumeLink } from "@/urls";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-black dark:bg-zinc-900 py-4 px-2 sm:py-2">
      <div className="container mx-auto flex flex-col gap-6 items-center justify-between text-white sm:flex-row">
        <p className="text-base sm:text-lg">&copy;2023, Edolor</p>

        <Link href="/" className="hidden sm:block">
          <Image src="/logo-white.svg" alt="Logo" width={160} height={51} />
        </Link>

        <a
          href={resumeLink}
          download="download"
          target="_blank"
          rel="noreferrer"
          className="flex flex-row items-center text-base font-semibold px-4 pr-5 py-3 bg-white
              text-black gap-x-2 drop-shadow-lg outline-offset-2 outline-white outline-1 focus:outline
              active:drop-shadow-none hover:underline hover:bg-gray-100"
        >
          <Icon name="download" color="#000000" classes="h-4 w-4" />
          <span>Resume</span>
        </a>
      </div>
    </footer>
  );
}
