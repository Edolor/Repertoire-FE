"use client";
import { useState, useEffect } from "react";

import Experience from "@/components/Experience/Experience";
import Honour from "@/components/Honour/Honour";
import AboutLoading from "@/components/Card/AboutLoading";
import { useAbout } from "@/context/AboutContext/AboutContext";
import { AboutProps } from "@/types/About.types";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import background from "@/assets/img/home-background.png";
import awsBadge from "@/assets/img/badges/aws.png";
import ccBadge from "@/assets/img/badges/cc.png";
import homeCareFinancialBadge from "@/assets/img/badges/home_care_financial.png";
import { motion } from "framer-motion";
import homeHealthFinancialBadge from "@/assets/img/badges/home_health_financial.png";
import hospiceFinancialBadge from "@/assets/img/badges/hospice_financial.png";
import palliativeFinancialBadge from "@/assets/img/badges/palliative_care_financial.png";
import Project from "@/components/Project/Project";
import Expertise from "@/components/Expertise/Expertise";
import { EXPERTISE } from "@/components/Expertise/data";
import Icon from "@/components/Icon/Icon";
import { githubUrl, emailUrl, linkedinUrl } from "@/urls";
import ProjectLoading from "@/components/Card/ProjectLoading";
import { useProject } from "@/context/ProjectContext/ProjectContext";
import { BaseProjectProps } from "@/types/Project.types";
import { getProjects } from "@/utils";

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

export default function Home() {
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
  const { fetchProjects } = useProject();
  const [projects, setProjects] = useState<BaseProjectProps[]>(
    [] as BaseProjectProps[]
  );
  const [projectIsLoading, setProjectIsLoading] = useState(true);

  const badgeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
    }),
  };

  const blogPosts = [
    {
      title: "Role-Based Access-Control using Next.js Middlewares",
      url: "https://www.linkedin.com/pulse/role-based-access-control-using-nextjs-middlewares-akasukpe-kkt1f/",
      date: "May 5, 2024",
    },
    {
      title:
        "Content-Based Filtering Recommendation System using Django, Scikit-learn, and Django Rest Framework",
      url: "https://www.linkedin.com/pulse/content-based-filtering-recommendation-system-using-django-akasukpe-pzpcf/",
      date: "May 13, 2024",
    },
  ];

  // Badge Animation
  const badgePulse = {
    animate: {
      scale: [1, 1.05, 1],
      rotate: [0, 2, -2, 0],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut",
      },
    },
  };

  // Container Animation
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fadeInUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    },
  });

  const badges = [
    { src: awsBadge, alt: "AWS Certification Badge" },
    { src: ccBadge, alt: "CC Badge" },
    { src: homeCareFinancialBadge, alt: "Home Care Financial Badge" },
    { src: homeHealthFinancialBadge, alt: "Home Health Financial Badge" },
    { src: hospiceFinancialBadge, alt: "Hospice Financial Badge" },
    { src: palliativeFinancialBadge, alt: "Palliative Financial Badge" },
  ];

  useEffect(() => {
    let firstRender = true;

    const getData = async () => {
      try {
        if (firstRender) {
          // Fetch data only once
          const res = await getProjects(3);

          if (res.count > 0) {
            setProjects(() => res.results);
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
        className="w-full bg-gray-50 flex flex-col justify-center lg:py-16"
      >
        <div className="container mx-auto flex lg:flex-row flex-col justify-center items-center h-full px-4 lg:justify-start gap-6 py-10 lg:py-0 md:px-14">
          <div className="w-full flex flex-col justify-center items-center lg:w-1/2">
            <motion.div
              className="relative bg-white dark:bg-zinc-800 rounded-xl p-4 py-8 space-y-4 flex flex-col 
        items-center justify-center drop-shadow-lg sm:p-7 md:mx-0"
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <motion.h2
                className="absolute -top-5 left-0 font-serif font-extrabold uppercase p-2 px-6
          -translate-y-2/4 text-primary bg-white text-xl border border-primary md:left-5"
                variants={badgePulse}
                animate="animate"
              >
                🚀 Open to Work!
              </motion.h2>

              <motion.h1
                className="font-serif text-4xl items-center dark:text-zinc-100 flex flex-col space-y-1 sm:text-5xl md:text-[56px]"
                variants={fadeInUp(0.1)}
              >
                <span className="font-extrabold text-center">
                  Aghoghomena Akasukpe
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-center dark:text-zinc-100"
                variants={fadeInUp(0.2)}
              >
                <u>Who am I?</u> A{" "}
                <b>Cybersecurity and Machine Learning engineer</b> with over 4
                years of experience in <b>software development</b> and{" "}
                <b>system design</b>. My passion for cybersecurity runs deep and
                it influences the way I build and design systems. I am currently
                pursuing a <a href="#">Master’s degree in Computer Science</a>{" "}
                with a specialization in <b>Cybersecurity</b> and{" "}
                <b>Artificial Intelligence</b>.
              </motion.p>

              <motion.p
                className="text-xl text-center dark:text-zinc-100 underline"
                variants={fadeInUp(0.3)}
              >
                Connect with me!
              </motion.p>

              <motion.div
                className="flex justify-center flex-wrap gap-4 sm:justify-between"
                variants={fadeInUp(0.4)}
              >
                <motion.a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center space-y-2 bg-gray-50 dark:bg-zinc-900 drop-shadow-md rounded-2xl py-2
            pt-4 px-4 outline-gray-200 outline-1 hover:outline active:drop-shadow-none"
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon
                    name="linkedin"
                    color={theme === "light" ? "#000000" : "#ffffff"}
                    classes="h-10 w-10"
                  />
                  <span className="text-xl dark:text-zinc-100">LinkedIn</span>
                </motion.a>

                <motion.a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center space-y-2 bg-gray-50 dark:bg-zinc-900 drop-shadow-md rounded-2xl py-2 
            pt-4 px-4 outline-gray-200 outline-1 hover:outline active:drop-shadow-none"
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon
                    name="github"
                    color={theme === "light" ? "#000000" : "#ffffff"}
                    classes="h-10 w-10"
                  />
                  <span className="text-xl dark:text-zinc-100">GitHub</span>
                </motion.a>

                <motion.a
                  href={`mailto:${emailUrl}`}
                  rel="noopener noreferrer"
                  className="flex flex-col items-center space-y-2 bg-gray-50 dark:bg-zinc-900 drop-shadow-md rounded-2xl py-2 
            pt-4 px-6 outline-gray-200 outline-1 hover:outline active:drop-shadow-none"
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon
                    name="email"
                    color={theme === "light" ? "#000000" : "#ffffff"}
                    classes="h-10 w-10"
                  />
                  <span className="text-xl dark:text-zinc-100">Email</span>
                </motion.a>
              </motion.div>

              <motion.a
                href="/contact"
                className="flex flex-row items-center text-base font-semibold px-5 py-4 bg-[#027373] rounded-md
          text-white gap-x-2 drop-shadow-lg disabled:opacity-50 disabled:cursor-not-allowed outline-offset-2 outline-primary outline-1 focus:outline
          active:drop-shadow-none hover:underline hover:bg-[#038c8c]"
                variants={fadeInUp(0.5)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg sm:text-xl">Want to Chat?</span>
              </motion.a>
            </motion.div>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:w-1/2 lg:pl-10 flex-col sm:space-y-8 lg:flex">
            <motion.div
              className="hidden sm:flex flex-wrap items-center justify-start gap-6"
              initial="hidden"
              animate="visible"
            >
              <motion.h2
                className="text-2xl font-bold text-black dark:text-zinc-100"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Recent Certifications→
              </motion.h2>

              {badges.map((badge, i) => (
                <motion.figure
                  key={badge.alt}
                  className="w-32 overflow-hidden"
                  variants={badgeVariants}
                  custom={i}
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={badge.src}
                    alt={badge.alt}
                    className="object-cover h-full w-full"
                  />
                  <figcaption className="hidden">{badge.alt}</figcaption>
                </motion.figure>
              ))}
            </motion.div>

            <motion.div className="sm:mt-12" initial="hidden" animate="visible">
              <motion.h2
                className="text-2xl font-bold text-[#027373] dark:text-zinc-100 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Latest Blog Posts
              </motion.h2>
              <div className="space-y-4">
                {blogPosts.map((post, i) => (
                  <motion.a
                    key={post.title}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border border-primaryLight rounded-lg hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2, duration: 0.5 }}
                  >
                    <h3 className="text-lg font-semibold text-[#027373] dark:text-zinc-100">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-300">
                      {post.date}
                    </p>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="w-full dark:bg-zinc-800 px-0 sm:px-4">
        <div className="container mx-auto pt-12 px-4 sm:px-0 sm:pt-10">
          <motion.h2
            className="font-serif text-5xl font-extrabold dark:text-zinc-100 text-center space-y-1 md:text-[56px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeIn" }}
            viewport={{ once: true, amount: 0.6 }}
          >
            Projects
          </motion.h2>

          <motion.p
            className="text-xl mt-1 text-center sm:text-2xl dark:text-zinc-100"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, ease: "easeIn", delay: 0.1 }}
          >
            Projects cover a wide spectrum of technologies and frameworks
          </motion.p>

          <motion.div
            className="mt-6 w-full flex flex-wrap items-start justify-center pt-1 pb-3 px-1 gap-6 md:gap-x-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {!projectIsLoading &&
              projects.map((project) => (
                <motion.div
                  key={project.url}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Project project={project} />
                </motion.div>
              ))}

            {projectIsLoading && (
              <>
                <ProjectLoading />
                <ProjectLoading />
                <ProjectLoading />
              </>
            )}
          </motion.div>

          <motion.div
            className="flex justify-center mt-8 sm:mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.5 }}
          >
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
          </motion.div>
        </div>
      </section>

      <section id="about" className="w-full dark:bg-zinc-800">
        <div className="container mx-auto pt-20 flex justify-center sm:px-0">
          <div
            className="w-full max-w-6xl relative pb-12 pt-12 px-4 bg-gray-50 dark:bg-zinc-900 flex flex-col justify-center rounded-md
              items-center space-y-3 sm:px-16 after:content-['*'] after:w-full after:h-full after:bg-primaryBackground
              after:absolute after:-z-10 after:top-6 after:left-6 after:rounded-md after:shadow-md
              after:hidden after:sm:block after:lg:left-8 after:lg:top-8 sm:pb-16 
              sm:shadow-md sm:space-y-5"
          >
            <h2
              className="absolute top-0 left-0 font-serif font-extrabold uppercase p-3 px-6
                -translate-y-2/4 text-primary bg-white text-xl border border-primary md:left-10"
            >
              About Me
            </h2>

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

          {/* Expertise section */}
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
