"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext/ThemeContext";
import Project from "@/components/Project/Project";
import DetailSide from "@/components/Project/DetailSide";
import { useProject } from "@/context/ProjectContext/ProjectContext";
import { BaseProjectProps } from "@/types/Project.types";
import ProjectLoading from "@/components/Card/ProjectLoading";

type ImageProp = {
  src: string;
};

function ProjectDetail({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<BaseProjectProps>(
    {} as BaseProjectProps
  );
  const projectId = params.id;
  const { getProjectDetails } = useProject();
  const { theme } = useTheme();
  const [projectIsLoading, setProjectIsLoading] = useState(true);
  const loadingRef = useRef(true);

  const images = useRef([]);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    let firstRender = true;

    const getData = async () => {
      setProjectIsLoading(() => true);
      loadingRef.current = true;

      try {
        if (firstRender) {
          // Fetch data only once
          const res = await getProjectDetails(projectId); // Fetch project details
          if (res.status === 200) {
            setProject(() => res.data);
            setProjectIsLoading(() => false);
            loadingRef.current = false;

            // Handling images
            images.current =
              res.data.images.filter((image: string) => image !== null) ?? [];
            setSelectedImage(images.current[0]);
          }
        }
      } catch (err) {}
    };

    getData();
    return () => {
      firstRender = false;
    };
  }, [projectId, getProjectDetails]);

  useEffect(() => {
    if (project && !loadingRef.current) {
      document.title = `${project.title.trim()} - Edolor`;
    }
  }, [project]);

  return (
    <>
      <section id="details" className="dark:bg-zinc-700">
        <div className="w-full bg-zinc-100 dark:bg-zinc-900 py-6 pb-12 md:py-10 md:pb-16">
          <div className="container mx-auto">
            {!projectIsLoading ? (
              <h1 className="font-serif text-3xl font-extrabold px-4 dark:text-zinc-100 text-center space-y-1 md:text-5xl">
                {project.title}
              </h1>
            ) : (
              <div className="flex justify-center w-full">
                <div className="bg-zinc-500 animate-pulse w-2/3 h-10"></div>
              </div>
            )}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="container mx-auto flex justify-center gap-10 overflow-x-auto -mt-7 scrollbar-hide">
          <div className="h-[400px] w-11/12 bg-zinc-600 sm:w-10/12 md:w-8/12 relative overflow-hidden rounded-xl">
            {!projectIsLoading ? (
              <AnimatePresence mode="wait">
                {images.current.filter(Boolean).map((image: string, index) =>
                  image === selectedImage ? (
                    <motion.div
                      key={image}
                      className="absolute inset-0 w-full h-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={image}
                        alt={`Project image ${index + 1}`}
                        fill
                        priority
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>
            ) : (
              <div className="h-full w-full bg-zinc-300 animate-pulse rounded-xl"></div>
            )}

            {!projectIsLoading && images.current.length === 0 && (
              <p className="text-white text-2xl text-center font-semibold absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4">
                No images yet :(
              </p>
            )}
          </div>
        </div>

        {/* Image Selector Tabs */}
        {!projectIsLoading && images.current.length > 1 && (
          <div className="flex justify-center mt-4 space-x-3">
            {images.current.map((image, index) => (
              <button
                key={index}
                aria-label={`View image ${index + 1}`}
                aria-pressed={selectedImage === image}
                onClick={() => setSelectedImage(image)}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  selectedImage === image
                    ? "bg-primary scale-110"
                    : "bg-zinc-400"
                }`}
              />
            ))}
          </div>
        )}

        <article className="px-6 py-8 flex flex-col-reverse items-start lg:mx-auto md:space-y-0 lg:container md:gap-16 md:flex-row">
          <article className="flex-1 mt-8 md:mt-0">
            <h2 className="text-2xl font-bold dark:text-zinc-100 text-center sm:text-left">
              Overview:
            </h2>

            {projectIsLoading ? (
              <div className="space-y-2 mt-4">
                <div className="w-full h-6 animate-pulse bg-zinc-400"></div>
                <div className="w-2/3 h-6 animate-pulse bg-zinc-400"></div>
                <div className="w-1/2 h-6 animate-pulse bg-zinc-400"></div>
              </div>
            ) : (
              <p className="dark:text-zinc-100 text-zinc-700 text-lg text-center mt-2 leading-relaxed sm:text-left">
                {project.description}
              </p>
            )}

            <h3 className="text-2xl font-bold dark:text-zinc-100 text-center mt-8 sm:text-left">
              Tools:
            </h3>

            {!projectIsLoading ? (
              <ul className="list-disc list-inside mt-2 ml-2">
                {project.tools &&
                  project?.tools.map((tool, index) => {
                    return (
                      <li
                        key={index}
                        className="dark:text-zinc-100 text-zinc-700 text-lg"
                      >
                        {tool}
                      </li>
                    );
                  })}
              </ul>
            ) : (
              <div className="space-y-2 mt-3">
                <div className="w-32 h-4 animate-pulse bg-zinc-400"></div>
                <div className="w-28 h-4 animate-pulse bg-zinc-400"></div>
                <div className="w-24 h-4 animate-pulse bg-zinc-400"></div>
              </div>
            )}

            <h3 className="text-2xl font-bold dark:text-zinc-100 text-center mt-8 sm:text-left">
              Tags:
            </h3>

            {!projectIsLoading ? (
              <div className="flex top-0 gap-x-6 mt-4 justify-center flex-wrap gap-y-4 sm:justify-start">
                {project.tags &&
                  project.tags.map((tag, index) => {
                    return (
                      <button
                        className="font-base py-1 px-4 border border-zinc-800 text-black 
                              dark:text-zinc-100 dark:border-zinc-200 hover:underline hover:bg-zinc-100
                                dark:hover:bg-zinc-500"
                        key={index}
                      >
                        {tag}
                      </button>
                    );
                  })}
              </div>
            ) : (
              <div className="space-x-4 flex mt-3">
                <div className="w-28 h-6 animate-pulse bg-zinc-400"></div>
                <div className="w-28 h-6 animate-pulse bg-zinc-400"></div>
              </div>
            )}
          </article>

          <aside className="flex flex-col items-center lg:items-start self-stretch md:sticky md:top-0">
            {/* White card on right side */}
            <DetailSide
              project={project}
              theme={theme}
              loading={projectIsLoading}
            />
          </aside>
        </article>
      </section>

      <section id="projects" className="w-full dark:bg-zinc-800">
        <div className="container mx-auto pt-12 px-4 sm:px-0 sm:pt-10">
          <h2 className="font-serif text-5xl font-extrabold dark:text-zinc-100 text-center space-y-1">
            More Projects
          </h2>

          <div className="mt-6 w-full flex flex-wrap items-start justify-center pt-1 pb-3 px-1 gap-10 gap-y-12">
            {/** PROJECTS */}
            {!projectIsLoading &&
              project.other_projects &&
              project.other_projects.map((project, index) => {
                return <Project key={index} project={project} />;
              })}

            {projectIsLoading && (
              <>
                <ProjectLoading />
                <ProjectLoading />
                <ProjectLoading />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default ProjectDetail;
