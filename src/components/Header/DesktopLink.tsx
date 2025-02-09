import Link from "next/link";
import { HeaderProps } from "./Header.types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DesktopLink({ content }: HeaderProps) {
  const location = usePathname();
  const isActive = location === content.path;

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin); // This will only run in the browser
    }
  }, []);

  return (
    <Link
      href={`${origin}/${content.link}`}
      className={`hover:text-primary text-lg dark:hover:text-zinc-50 border-t-2 
          border-b-2 border-transparent ${
            isActive
              ? "border-b-primary dark:border-b-white text-primary dark:text-white"
              : ""
          }`}
    >
      {!content.bubble ? (
        <span>{content.title}</span>
      ) : (
        <span className="flex space-x-1.5 items-center relative">
          <span>{content.title}</span>
          <span
            className="h-3 w-3 -mb-[4px] absolute -right-4 shrink-0 rounded-full bg-orangeish"
            aria-hidden="true"
          >
            &nbsp;
          </span>
        </span>
      )}
    </Link>
  );
}
