"use client";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import { HeaderProps } from "./Header.types";
import Icon from "@/components/Icon/Icon";

export default function MobileLink({ content }: HeaderProps) {
  const { theme } = useTheme();

  return (
    <Link
      href={content.link}
      className="text-lg flex w-full px-4 font-semibold border-gray-100 dark:border-zinc-400 
          items-center justify-between text-gray-800 dark:text-gray-200 space-x-4 border-b-[1px] py-4 active:underline"
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

      <Icon
        name="chevron-right"
        color={theme === "light" ? "#000000" : "#ffffff"}
        classes="h-6 w-6 -mb-1"
      />
    </Link>
  );
}
