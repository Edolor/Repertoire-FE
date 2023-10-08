"use client";
import React from "react";
import background from "@/assets/img/competitve-background.png";
import { hackerrankUrl, githubUrl, leetcodeUrl, codewarsUrl } from "@/urls";

const heroStyleWhite = {
  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background.src})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

type PlatformProps = {
  platform: {
    url: string;
    dash: boolean;
    name: string;
  };
};

const Platform = ({ platform }: PlatformProps) => {
  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-zinc-600 text-white px-4 py-1 rounded-full text-lg font-semibold outline-1 outline-primary 
       dark:outline-primaryLight outline-offset-2 hover:outline focus:outline relative after:content-[' '] after:hidden ${
         platform.dash ? "sm:after:block" : "after:hidden"
       } after:h-[2px]
        after:absolute after:top-2/4 after:bg-black dark:after:bg-zinc-100 after:left-full after:-translate-y-1/2 after:w-8`}
    >
      {platform.name}
    </a>
  );
};

function Profiles() {
  const platforms = [
    {
      name: "Hackerrank",
      url: hackerrankUrl,
      dash: true,
    },
    {
      name: "Codewars",
      url: codewarsUrl,
      dash: true,
    },
    {
      name: "Leetcode",
      url: leetcodeUrl,
      dash: true,
    },
    {
      name: "Github",
      url: githubUrl,
      dash: false,
    },
  ];

  return (
    <>
      <section
        id="hero"
        style={heroStyleWhite}
        className="w-full bg-gray-50 flex flex-col justify-center min-h-[40vh] sm:min-h-[60vh]
          lg:py-8"
      >
        <div className="container mx-auto flex flex-col justify-center items-center h-full px-6 space-y-6 lg:justify-start sm:px-14">
          <h1
            className="font-serif font-extrabold text-5xl text-white dark:text-zinc-100 text-center space-y-1 lg:items-start
              md:text-6xl"
          >
            <span className="hidden sm:block">Competitive Programming</span>
            <span className="sm:hidden">Coding</span>
          </h1>

          <p className="text-xl text-center text-white dark:text-zinc-100 sm:text-2xl">
            Exceeding preconceived limits!!
          </p>
        </div>
      </section>

      <section
        id="projects"
        className="w-full bg-zinc-50 dark:bg-zinc-700 px-0 sm:px-4"
      >
        <div className="container mx-auto pt-12 pb-12 px-4 sm:px-0 sm:pt-10">
          <h2 className="font-serif text-5xl font-extrabold flex space-x-3 items-end justify-center dark:text-zinc-100 text-center space-y-1 md:text-[56px]">
            <span className="hidden sm:inline-block">My</span>
            <span>Profiles</span>
          </h2>

          <p className="mt-4 text-center text-lg max-w-6xl mx-auto leading-relaxed sm:leading-loose sm:text-xl dark:text-zinc-100">
            Competitive coding, in my opinion, improves my performance in other
            topics i study and learn. It teaches anyone how to rationally
            construct a workable program by dissecting a problem into discrete
            parts and expressing ones self using a language that the machine can
            understand. By doing tons of exercises, I have cultivated a certain
            attitude for tackling issues and digesting massive volumes of data,
            which is essential for mastering any subject matter.
          </p>

          <div className="mt-6 flex justify-center items-center flex-wrap gap-6">
            {platforms.map((platform, index) => {
              return <Platform key={index} platform={platform} />;
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default Profiles;
