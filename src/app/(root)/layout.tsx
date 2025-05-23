"use client";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import { useState, useEffect } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Icon from "@/components/Icon/Icon";
import Contact from "@/components/Contact/Contact";
import { LINKS } from "@/components/Header/data";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScrollEvent = () => {
      if (window.scrollY > 400) {
        setShowTopButton(() => true);
      } else {
        setShowTopButton(() => false);
      }
    };

    window.addEventListener("scroll", handleScrollEvent);

    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  const handleScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className={`w-full ${theme === "dark" ? "dark" : ""}`}>
      <Header links={LINKS} />
      <main className="pt-20 md:pt-[83px]">
        {children}
        <Contact />
      </main>
      <button
        aria-label="Go to top"
        type="button"
        className={`flex items-center justify-center w-14 h-14 bg-white dark:bg-zinc-400 border 
          border-zinc-100 rounded-full 
          shadow-md shadown-inner z-20 fixed bottom-6 right-6 sm:bottom-10 sm:right-10 ${
            showTopButton === false ? "hidden" : ""
          }`}
        onClick={handleScroll}
      >
        <Icon
          name="arrow-upward"
          color="#000000"
          classes={`h-7 -mt-p ${theme !== "light" && "hidden"}`}
        />
        <Icon
          name="arrow-upward"
          color="#ffffff"
          classes={`h-7 -mt-p ${theme !== "dark" && "hidden"}`}
        />
        <span className="w-1 h-1 overflow-hidden hidden">Go to top</span>
      </button>
      <Footer />
    </div>
  );
}
