import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import Icon from "@/components/Icon/Icon";
import { resumeLink } from "@/urls";
import { LINKS } from "./data";
import { usePathname } from "next/navigation";
import MobileLink from "./MobileLink";
import DesktopLink from "./DesktopLink";

export default function Header() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    /* Handles the opening and closing of the mobile nav */
    setOpen((prev) => {
      if (prev === false) {
        document.body.style.cssText = "overflow: hidden;";
      } else {
        document.body.style.cssText = "";
      }

      return !prev;
    });
  };

  const location = usePathname();
  // const navClasses = `duration-200 transform ease-out opacity-0 transition`

  useEffect(() => {
    setOpen(false);
    document.body.style.cssText = "";

    window.scrollTo(0, 0);
  }, [location]);

  const { theme, setTheme } = useTheme();

  const handleTheme = () => {
    /* Handle theme switching */
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50 shadow-sm bg-white dark:bg-zinc-900 px-2 sm:px-4">
      <div className="mx-auto py-4 flex items-center justify-between lg:container">
        <Link href="/">
          <Image
            src="/logo-black.svg"
            className={`${theme !== "light" && "hidden"}`}
            alt="Logo"
            width={160}
            height={51}
            priority
          />
          <Image
            src="/logo-white.svg"
            className={`${theme !== "dark" && "hidden"}`}
            alt="Logo"
            width={160}
            height={51}
            priority
          />
        </Link>

        <nav className="hidden flex-row items-center justify-between max-w-md w-full lg:flex dark:text-zinc-100">
          {
            // DESKTOP HEADER LINKS
            LINKS.map((content, index) => (
              <DesktopLink content={content} key={index} />
            ))
          }
        </nav>

        <div className="flex flex-row items-center justify-between space-x-4 sm:space-x-6">
          {/* Dark mode button */}
          <button
            onClick={handleTheme}
            className="relative h-10 w-10 rounded-full flex items-center justify-center drop-shadow-sm bg-gray-100 dark:bg-zinc-600
                  ring-offset-0 ring-0 ring-gray-300 focus:ring-1 hover:ring-1"
          >
            <Icon
              name="dark"
              color="#000000"
              classes={`h-4 w-4 ${theme !== "light" && "hidden"}`}
            />
            <Icon
              name="light-mode"
              color="#ffffff"
              classes={`h-6 w-6 ${theme !== "dark" && "hidden"}`}
            />
          </button>

          <a
            href={resumeLink}
            download="download"
            rel="noreferrer"
            target="_blank"
            className="rounded-md hidden flex-row items-center text-lg font-semibold px-4 pr-5 py-3 bg-primary
                  text-white gap-x-2 drop-shadow-lg outline-offset-2 outline-primary outline-1 focus:outline
                  active:drop-shadow-none hover:underline hover:bg-primaryLight sm:flex"
          >
            <Icon name="download" color="#ffffff" classes="h-4 w-4" />
            <span>Resume</span>
          </a>

          <button
            onClick={handleOpen}
            className="p-2 px-1 py-1.5 border border-transparent rounded-md lg:hidden"
          >
            <Icon
              name="menu"
              color={theme === "light" ? "#000000" : "#ffffff"}
              classes={`h-8 w-10 block ${open && "hidden"}`}
            />
            <Icon
              name="close"
              color={theme === "light" ? "#000000" : "#ffffff"}
              classes={`h-8 w-10 block ${!open && "hidden"}`}
            />
            <span className="w-0 h-0 block overflow-hidden indent-[9999px]">
              Menu
            </span>
          </button>


        </div>
      </div>

      <div
        className={`absolute left-0 bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-400 border-t-[1px] h-screen top-full w-full pb-6 flex
            items-center flex-col ${!open ? "hidden" : ""} lg:hidden`}
      >
        {LINKS.map((content, index) => {
          // MOBILE NAV LINKS
          return <MobileLink key={index} content={content} />;
        })}

        <div className="flex items-center mt-5 px-4 w-full">
          <a
            href={resumeLink}
            rel="noreferrer"
            target="_blank"
            download="download"
            className="rounded-md flex flex-row items-center text-base font-semibold px-4 pr-5 py-3 bg-primary
                  text-white gap-x-2 drop-shadow-lg outline-offset-2 outline-primary outline-1 focus:outline
                  active:drop-shadow-none hover:underline hover:bg-primaryLight"
          >
            <Icon name="download" color="#ffffff" classes="h-4 w-4" />
            <span>Resume</span>
          </a>
        </div>
      </div>
    </header>
  );
}
