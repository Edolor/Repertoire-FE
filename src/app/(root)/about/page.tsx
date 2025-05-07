"use client";
import { useState, useEffect } from "react";
import background from "@/assets/img/about-background.png";
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
