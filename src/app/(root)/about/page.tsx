"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import background from "@/assets/img/about-background.png";
import portrait from "@/assets/img/mena.jpg";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import Experience from "@/components/Experience/Experience";
import Honour from "@/components/Honour/Honour";
import AboutLoading from "@/components/Card/AboutLoading";
import { useAboutQuery } from "@/hooks/useQueries";

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
  const { data: about, isLoading: loading } = useAboutQuery();

  const fields = ["Experience", "Awards", "Education", "Certifications"];

  const descriptions = {
    Experience:
      "Where I've built things, from production agent systems to high-throughput claims pipelines and full-stack platforms.",
    Awards:
      "Recognition for the research and engineering work, including the MITACS-funded agentic-AI infrastructure project.",
    Education:
      "An MSc in Computer Science (AI & Security) at Ontario Tech, on a Summa cum laude CS foundation.",
    Certifications:
      "Industry credentials backing the security and machine-learning work: CompTIA Security+, AWS ML Specialty, and more.",
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
        <div className="container mx-auto flex flex-col lg:flex-row justify-center items-center h-full gap-8 px-6 py-12 sm:px-14 lg:gap-14">
          <motion.figure
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="shrink-0"
          >
            <Image
              src={portrait}
              alt="Aghoghomena Akasukpe"
              placeholder="blur"
              priority
              className="w-44 h-44 sm:w-56 sm:h-56 rounded-2xl object-cover object-top border-4 border-white/80 shadow-2xl"
            />
          </motion.figure>

          <div className="flex flex-col items-center lg:items-start space-y-4 max-w-2xl">
            <h1 className="font-serif font-extrabold text-5xl text-white text-center lg:text-left md:text-6xl">
              Aghoghomena Akasukpe
            </h1>
            <p className="text-lg sm:text-xl text-center lg:text-left text-white/90">
              Agentic AI Systems Engineer who builds the infrastructure
              autonomous agents run on, and red-teams it. Currently at
              Farpoint Technologies and Ontario Tech University.
            </p>
          </div>
        </div>
      </section>

      <section
        id="content"
        className="w-full bg-zinc-100 dark:bg-zinc-700 py-16"
      >
        <div className="container max-w-5xl pb-10 border-b-[1.5px] border-b-zinc-400 px-6 mx-auto">
          {loading || !about ? (
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
