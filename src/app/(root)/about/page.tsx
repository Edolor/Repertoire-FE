"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import background from "@/assets/img/about-background.png";
import personalSelfie from "@/assets/img/personal-selfie.png";
import potrait from "@/assets/img/potrait.png";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import Experience from "@/components/Experience/Experience";
import Honour from "@/components/Honour/Honour";
import AboutLoading from "@/components/Card/AboutLoading";
import { useAbout } from "@/context/AboutContext/AboutContext";
import { AboutProps } from "@/types/About.types";

const heroStyleWhite = {
  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background.src})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

const heroStyleDark = {
  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${background.src})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

function About() {
  const { theme } = useTheme();
  const { getAbout } = useAbout();
  const [about, setAbout] = useState<AboutProps>({} as AboutProps);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let firstRender = true;

    const getData = async () => {
      try {
        if (firstRender) {
          // Fetch data only once
          const res = await getAbout(); // Fetch projects
          if (res.status === 200) {
            setAbout(() => res.data);
          }

          setLoading(() => false);
        }
      } catch (err) {}
    };

    getData();
    return () => {
      firstRender = false;
    };
  }, [getAbout]);

  const fields = ["Experience", "Awards", "Education", "Certifications"];

  const descriptions = {
    Experience: "An overview of my professional life as a computer scientist.",
    Awards:
      "A selection of awards and honors I have received for my work and in life.",
    Education: "An overview of my academic life as a computer scientist.",
    Certifications:
      "A selection of certifications I have gotten in my professional pursuit for excellence.",
  };

  const [selectedField, setSelectedField] = useState(fields[0]);

  return (
    <>
      <section
        id="hero"
        style={theme === "light" ? heroStyleWhite : heroStyleDark}
        className="w-full bg-gray-50 flex flex-col justify-center min-h-[40vh] sm:min-h-[60vh]
          lg:py-8"
      >
        <div className="container mx-auto flex flex-col justify-center items-center h-full px-6 space-y-6 lg:justify-start sm:px-14">
          <h1
            className="font-serif font-extrabold text-5xl text-white dark:text-zinc-100 text-center space-y-1 lg:items-start
              md:text-6xl"
          >
            About Me
          </h1>

          <p className="text-xl text-center text-white dark:text-zinc-100">
            Bright, daring and awesome!!
          </p>
        </div>
      </section>

      {/* <section id="about" className="w-full dark:bg-zinc-800">
        <div className="container mx-auto py-20 flex gap-6 items-center justify-center sm:px-0">
          <div
            className="relative flex flex-col justify-center px-6 rounded-md
              items-center gap:3 sm:gap-5 sm:items-start md:px-0 lg:mr-4"
          >
            <div className="space-y-1">
              <h2 className="uppercase text-lg text-center text-primary font-bold sm:text-left">
                ABOUT ME
              </h2>

              <p
                className="font-serif text-4xl font-extrabold text-center items-center flex-col 
                dark:text-zinc-100 md:text-5xl flex sm:text-left"
              >
                Akauskpe Aghoghomena
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-lg mt-1 text-gray-800 dark:text-zinc-100 text-center max-w-5xl leading-loose block lg:leading-9 lg:text-xl sm:text-left">
                I am a computer scientist and software engineer with a Bachelor
                of Science in Computer Science from Babcock University, Nigeria,
                where I graduated Summa Cum Laude with a 4.88/5.0 CGPA.
                Currently, I am pursuing a Master of Science in Computer Science
                (Thesis-Based) at Ontario Tech University, specializing in
                Networking and IT Security.
              </p>

              <p className="text-lg mt-1 text-gray-800 dark:text-zinc-100 text-center max-w-5xl leading-loose block lg:leading-9 lg:text-xl sm:text-left">
                With over four years of experience, I have contributed to
                full-stack development, system optimization, and cloud-based
                solutions, working with companies such as Cavista Technologies
                and Azul Nigeria. My expertise spans Django, Next.js, React,
                ASP.NET, and cloud platforms like AWS and Docker, with a strong
                foundation in cybersecurity, machine learning, and scalable
                system design.
              </p>
              <p className="text-lg mt-1 text-gray-800 dark:text-zinc-100 text-center max-w-5xl leading-loose block lg:leading-9 lg:text-xl sm:text-left">
                Beyond software development, I am passionate about mentorship,
                research, and innovation. I have actively contributed to student
                tutoring, blockchain development, and software engineering
                communities, mentoring aspiring developers through organizations
                like the Google Developer Student Clubs and the Babcock
                University Computer Club.
              </p>
              <p className="text-lg mt-1 text-gray-800 dark:text-zinc-100 text-center max-w-5xl leading-loose block lg:leading-9 lg:text-xl sm:text-left">
                I spend my days exploring new technologies, refining my
                problem-solving skills, and experimenting with productivity
                hacks to enhance both personal and professional growth. I thrive
                on curiosity, collaboration, and a relentless pursuit of
                excellence in everything I do.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-8 pt-3 sm:pt-0">
              <Link
                href="/contact"
                className="flex flex-row items-center text-base font-semibold px-5 pl-6 py-5 bg-primary
                    text-white gap-x-2 drop-shadow-lg outline-offset-2 outline-primary outline-1 focus:outline
                    active:drop-shadow-none group hover:bg-primaryLight rounded-md"
              >
                <span className="text-lg sm:text-xl group-hover:underline">
                  Send me a message
                </span>
                <span>(^_^)</span>
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      <section
        id="content"
        className="w-full bg-zinc-100 dark:bg-zinc-700 py-16"
      >
        <div className="container max-w-5xl pb-10 border-b-[1.5px] border-b-zinc-400 px-6 mx-auto">
          {loading ? (
            <AboutLoading />
          ) : (
            <>
              <aside className="flex flex-wrap gap-x-14 gap-y-6 border-b-[1.5px] border-b-zinc-400 dark:border-b-zinc-100">
                {fields.map((field, index) => {
                  return (
                    <button
                      className={`
                          pb-4 dark:text-zinc-100 border-b-2 ${
                            field === selectedField
                              ? "font-semibold text-[19.5px] border-b-black dark:border-b-zinc-100"
                              : "text-xl border-b-transparent"
                          }`}
                      onClick={() => {
                        setSelectedField(() => field);
                      }}
                      key={index}
                    >
                      {field}
                    </button>
                  );
                })}
              </aside>

              <p className="my-6 text-xl dark:text-zinc-100">
                {descriptions[selectedField as keyof typeof descriptions]}
              </p>

              <div
                className={`space-y-6 ${
                  selectedField === "Experience" ? "block" : "hidden"
                }`}
              >
                {/** Experiences */}
                {about.experiences.map((exp, index) => {
                  return <Experience key={index} data={exp} />;
                })}
              </div>

              <div
                className={`flex-wrap justify-around gap-10 md:gap-y-14 mt-12 ${
                  selectedField === "Awards" ? "flex" : "hidden"
                }`}
              >
                {/** Awards */}
                {about.awards.map((award, index) => {
                  return <Honour data={award} key={index} />;
                })}
              </div>

              <div
                className={`space-y-6 ${
                  selectedField === "Education" ? "block" : "hidden"
                }`}
              >
                {/** Education */}
                {about.education.map((exp, index) => {
                  return <Experience key={index} data={exp} />;
                })}
              </div>

              <div
                className={`flex-wrap justify-around gap-10 md:gap-y-14 mt-12 ${
                  selectedField === "Certifications" ? "flex" : "hidden"
                }`}
              >
                {/** Certifications */}
                {about.certifications.map((award, index) => {
                  return <Honour data={award} key={index} />;
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default About;
