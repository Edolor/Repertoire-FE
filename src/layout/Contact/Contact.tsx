import Link from "next/link";
import Icon from "@/components/Icon/Icon";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import { twitterUrl, githubUrl, linkedinUrl } from "@/urls";

export default function Contact() {
  const { theme } = useTheme();

  return (
    <section className="w-full dark:bg-zinc-800">
      <div className="container mx-auto flex flex-col items-center space-y-3 py-12 px-4 sm:px-0 sm:space-y-6">
        <h3 className="font-serif text-[40px] text-center font-black leading-none dark:text-zinc-100 md:text-5xl">
          Contact Me
        </h3>

        <p className="text-center text-gray-800 max-w-4xl text-lg dark:text-zinc-100 md:text-xl">
          Do you have any questions or would like to receive further information
          about my work? Feel free to contact me.
        </p>

        <div className="flex items-center space-x-6 pt-2 sm:pt-2">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 transition-transform active:scale-100 hover:scale-105"
          >
            <Icon
              name="linkedin"
              color={theme === "light" ? "#000000" : "#ffffff"}
              classes="w-full h-full"
            />
            <span className="w-0 h-0 block overflow-hidden indent-[9999px]">
              Linkedin
            </span>
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 transition-transform active:scale-100 hover:scale-105"
          >
            <Icon
              name="twitter"
              color={theme === "light" ? "#000000" : "#ffffff"}
              classes="w-full h-full"
            />
            <span className="w-0 h-0 block overflow-hidden indent-[9999px]">
              Twitter
            </span>
          </a>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 transition-transform active:scale-100 hover:scale-105"
          >
            <Icon
              name="github"
              color={theme === "light" ? "#000000" : "#ffffff"}
              classes="w-full h-full"
            />
            <span className="w-0 h-0 block overflow-hidden indent-[9999px]">
              Github
            </span>
          </a>
        </div>

        <div className="mt-2 sm:pt-0">
          <Link
            href="/contact"
            download="download"
            className="flex flex-row items-center text-lg font-semibold px-7 py-3.5 bg-black dark:bg-zinc-100
                  text-white dark:text-zinc-900 gap-x-2 drop-shadow-lg outline-offset-2 outline-black dark:outline-zinc-100 outline-1 focus:outline
                  active:drop-shadow-none hover:underline hover:bg-gray-900 dark:hover:bg-zinc-200 sm:py-3 sm:rounded-md"
          >
            Contact Me
          </Link>
        </div>
      </div>
    </section>
  );
}
