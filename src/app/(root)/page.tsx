"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import background from "@/assets/img/home-background.png";
import personalSelfie from "@/assets/img/personal-selfie.png";
import Project from "@/components/Project/Project";
import Expertise from "@/components/Expertise/Expertise";
import { EXPERTISE } from "@/components/Expertise/data";
import Icon from "@/components/Icon/Icon";
import { twitterUrl, githubUrl, emailUrl, phoneNumber, baseURL } from "@/urls";
import ProjectLoading from "@/components/Card/ProjectLoading";
import { useProject } from "@/context/ProjectContext/ProjectContext";
import { BaseProjectProps } from "@/types/Project.types";
import { PATHS } from "@/urls";

const heroStyleWhite = {
  backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), url(${background.src})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

const heroStyleDark = {
  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${background.src})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

async function getProjects() {
  const response = await fetch(`${baseURL}${PATHS.projects}?size=3`);

  const data = await response.json();

  return data.data;
}

export default function Home() {
  const { theme } = useTheme();
  const { fetchProjects } = useProject();
  const [projects, setProjects] = useState<BaseProjectProps[]>(
    [] as BaseProjectProps[]
  );
  const [projectIsLoading, setProjectIsLoading] = useState(true);

  useEffect(() => {
    let firstRender = true;

    const getData = async () => {
      try {
        if (firstRender) {
          // Fetch data only once
          // const res = await fetchProjects(3); // Fetch projects

          const res = await getProjects();
          if (res.status === 200) {
            setProjects(() => res.data.results);
          }

          setProjectIsLoading(() => false);
        }
      } catch (err) {}
    };

    getData();
    return () => {
      firstRender = false;
    };
  }, [fetchProjects]);

  return (
    <>
      <section
        id="hero"
        style={theme === "light" ? heroStyleWhite : heroStyleDark}
        className="w-full bg-gray-50 flex flex-col justify-center min-h-[80vh]
          lg:py-8"
      >
        <div className="container mx-auto flex justify-center items-center h-full px-6 lg:justify-start sm:px-14">
          <div className="w-full flex flex-col items-center py-10 lg:w-1/2 lg:items-start">
            <figure className="w-56 h-56 mb-4 bg-white overflow-hidden rounded-full lg:hidden">
              <Image
                src={personalSelfie}
                loading="lazy"
                alt="A selfie of me"
                className="color-transparent object-cover indent-[100%] overflow-hidden whitespace-nowrap w-full h-full"
              />

              <figcaption className="hidden">My image</figcaption>
            </figure>

            <h1 className="font-serif text-4xl items-center dark:text-zinc-100 flex flex-col space-y-1 sm:text-5xl md:text-[56px] lg:items-start">
              <span>Akasukpe</span>{" "}
              <span className="font-extrabold">Aghoghomena</span>
            </h1>

            <div
              className="bg-white dark:bg-zinc-800 rounded-xl p-4 py-8 mt-5 max-w-sm space-y-2 flex flex-col 
                items-center drop-shadow-lg lg:items-start sm:p-7 md:mx-0"
            >
              <a href="/" className="-ml-2 lg:ml-0">
                <Image
                  src="/logo-black.svg"
                  alt="Logo"
                  width={160}
                  height={51}
                  aria-hidden="true"
                  className={`w-32 ${theme !== "light" && "hidden"}`}
                />

                <Image
                  src="/logo-white.svg"
                  alt="Logo"
                  width={160}
                  height={51}
                  aria-hidden="true"
                  className={`w-32 ${theme !== "dark" && "hidden"}`}
                />
              </a>

              <p className="text-xl text-center dark:text-zinc-100 lg:text-left">
                A designer, software developer and an avid reader.
              </p>

              <div className="flex justify-center flex-wrap gap-4 sm:justify-between">
                <a
                  href={`mailto:${emailUrl}`}
                  rel="noopener noreferrer"
                  className="flex flex-col items-center space-y-2 bg-gray-50 dark:bg-zinc-900 drop-shadow-md rounded-2xl py-2 
                    pt-4 px-6 outline-gray-200 outline-1 hover:outline active:drop-shadow-none"
                >
                  <Icon
                    name="email"
                    color={theme === "light" ? "#000000" : "#ffffff"}
                    classes="h-10 w-10"
                  />
                  <span className="text-xl dark:text-zinc-100">Email</span>
                </a>

                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center space-y-2 bg-gray-50 dark:bg-zinc-900 drop-shadow-md rounded-2xl py-2 
                    pt-4 px-4 outline-gray-200 outline-1 hover:outline active:drop-shadow-none"
                >
                  <Icon
                    name="github"
                    color={theme === "light" ? "#000000" : "#ffffff"}
                    classes="h-10 w-10"
                  />
                  <span className="text-xl dark:text-zinc-100">Github</span>
                </a>

                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center space-y-2 bg-gray-50 dark:bg-zinc-900 drop-shadow-md rounded-2xl py-2
                    pt-4 px-4 outline-gray-200 outline-1 hover:outline active:drop-shadow-none"
                >
                  <Icon
                    name="twitter"
                    color={theme === "light" ? "#000000" : "#ffffff"}
                    classes="h-10 w-10"
                  />
                  <span className="text-xl dark:text-zinc-100">Twitter</span>
                </a>
              </div>
            </div>
          </div>

          <div className="w-1/2 hidden items-center flex-col justify-between space-y-8 lg:flex">
            <figure className="w-80 h-80 bg-white overflow-hidden rounded-full">
              <Image
                src={personalSelfie}
                alt="A selfie of me"
                className="color-transparent object-cover indent-[100%] overflow-hidden whitespace-nowrap h-full w-full"
              />

              <figcaption className="hidden">My image</figcaption>
            </figure>

            <p className="text-xl italic text-center dark:text-zinc-100">
              I create 21st - century, responsive websites with features that
              scale for any purpose.
            </p>
          </div>
        </div>
      </section>

      <section id="projects" className="w-full dark:bg-zinc-800 px-0 sm:px-4">
        <div className="container mx-auto pt-12 px-4 sm:px-0 sm:pt-10">
          <h2 className="font-serif text-5xl font-extrabold dark:text-zinc-100 text-center space-y-1 md:text-[56px] xl:text-left">
            Projects
          </h2>

          <p className="text-xl mt-1 text-center sm:text-2xl xl:text-left dark:text-zinc-100">
            Projects cover a wide spectrum of technologies and frameworks
          </p>

          <div
            className="mt-6 w-full flex flex-wrap items-start justify-center pt-1 pb-3 px-1 gap-6
               xl:justify-between md:gap-x-12"
          >
            {/** PROJECTS */}
            {!projectIsLoading &&
              projects.map((project) => {
                return <Project key={project.url} project={project} />;
              })}

            {projectIsLoading && (
              <>
                <ProjectLoading />
                <ProjectLoading />
                <ProjectLoading />
              </>
            )}
          </div>

          <div className="flex justify-center mt-8 sm:mt-10">
            <Link
              href="/projects"
              className="flex flex-row items-center text-base font-semibold px-5 pl-6 py-4 bg-primary
                  text-white gap-x-2 drop-shadow-lg outline-offset-2 outline-primary outline-1 focus:outline
                  active:drop-shadow-none hover:underline hover:bg-primaryLight"
            >
              <span className="text-lg sm:text-xl">View More</span>
              <Icon
                name="left-double-arrow"
                color="#ffffff"
                classes="h-3 w-3 -mb-1"
              />
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="w-full dark:bg-zinc-800">
        <div className="container mx-auto pt-40 flex justify-center sm:px-0">
          <div
            className="max-w-6xl relative pb-12 pt-36 px-4 bg-gray-50 dark:bg-zinc-900 flex flex-col justify-center rounded-md
              items-center space-y-3 sm:px-16 after:content-['*'] after:w-full after:h-full after:bg-primaryBackground
              after:absolute after:-z-10 after:top-6 after:left-6 after:rounded-md after:shadow-md
              after:hidden after:sm:block after:lg:left-12 after:lg:top-12 sm:pb-16 
              sm:shadow-md sm:space-y-5"
          >
            <h2
              className="absolute top-0 left-0 hidden font-serif font-extrabold uppercase p-3 px-6
                -translate-y-2/4 text-primary bg-white text-xl border border-primary md:left-10"
            >
              About Me
            </h2>

            <figure className="w-64 h-64 mb-4 absolute top-0 -translate-y-2/4 overflow-hidden bg-white rounded-full">
              <Image
                src={personalSelfie}
                loading="lazy"
                alt="A selfie of myself"
                className="color-transparent object-cover indent-[100%] w-full h-full whitespace-nowrap"
              />

              <figcaption className="hidden">My image</figcaption>
            </figure>

            <p className="font-serif hidden text-4xl font-extrabold text-center items-center flex-col dark:text-zinc-100 md:text-5xl sm:flex">
              Akauskpe Aghoghomena
            </p>

            <p className="font-serif font-extrabold text-center items-center flex leading-none flex-col dark:text-zinc-100 text-[40px] sm:hidden">
              About Me
            </p>

            <p className="text-lg mt-1 text-gray-800 hidden dark:text-zinc-100 text-center max-w-5xl leading-loose sm:block lg:text-xl">
              I am a computer scientist who graduated from Babcock University,
              Nigeria. My fascination with computers and software began at a
              young age and I have over 4 years of experience designing and
              developing software that spans a wide range of domains.
            </p>

            <p className="text-lg text-gray-800 dark:text-zinc-100 text-center max-w-5xl leading-relaxed sm:hidden lg:text-xl">
              I am a computer scientist who graduated from Babcock University,
              My fascination with computers an...
            </p>

            <div className="flex items-center justify-center space-x-8 mt-3 sm:mt-0">
              <Link
                href="/about"
                className="flex flex-row items-center text-base font-semibold px-5 pl-6 py-4 bg-primary
                    text-white gap-x-2 drop-shadow-lg outline-offset-2 outline-primary outline-1 focus:outline
                    active:drop-shadow-none hover:underline hover:bg-primaryLight"
              >
                <span className="text-lg sm:text-xl">Read More</span>
                <Icon
                  name="top-right-arrow"
                  color="#ffffff"
                  classes="h-3 w-3"
                />
              </Link>

              <a
                href={`tel:${phoneNumber}`}
                rel="noopener noreferrer"
                className="flex flex-row items-center text-base font-semibold
                    text-primary gap-x-2 drop-shadow-lg outline-offset-2 outline-primary outline-1 focus:outline
                    active:drop-shadow-none"
              >
                <Icon name="call" color="#027373" classes="h-4 w-4" />
                <span className="text-lg underline hover:no-underline sm:text-xl">
                  Call Me
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="expertise" className="w-full dark:bg-zinc-800">
        <div className="max-w-[1366px] mx-auto w-full flex flex-col lg:flex-row sm:pt-24">
          <div
            className="flex flex-col basis-2/4 space-y-2 bg-gray-50 dark:bg-zinc-900 
              border-gray-100 dark:border-zinc-500 border-t-[1px] p-8 lg:border-0 sm:p-14"
          >
            <h2 className="font-serif text-4xl font-extrabold space-y-1 dark:text-zinc-100 sm:text-left lg:text-right">
              Expertise
            </h2>
            <p className="dark:text-zinc-100 sm:text-left lg:text-right">
              Domains of my expertise.
            </p>
          </div>

          {/** Expertise section */}
          <div
            className="grid grid-cols-1 gap-14 px-8 py-14 border-gray-100 dark:border-zinc-500 border-y-[1px] 
                lg:border-r-[1px] sm:py-20 sm:px-14 sm:grid-cols-2"
          >
            {EXPERTISE.map((expertise, index) => (
              <Expertise key={index} content={expertise} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
