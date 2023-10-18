"use client";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  MutableRefObject,
  RefObject,
} from "react";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";
import head from "@/assets/img/code-head-1.png";
import Project from "@/components/Project/Project";
import Message from "@/components/Message/Message";
import ProjectLoading from "@/components/Card/ProjectLoading";
import { useProject } from "@/context/ProjectContext/ProjectContext";
import { BaseProjectProps } from "@/types/Project.types";
import { ServerResponse } from "./Projects.types";
import { getProjectsNoCache } from "@/utils";

function Projects() {
  const SIZEOFPAGER = 6; // USED FOR PAGINATION
  const { fetchProjects } = useProject();
  const fields = [
    "All",
    "Machine Learning",
    "Frontend",
    "Backend",
    "UI/UX Design",
    "Random",
  ];

  const nextRef = useRef<string | null>(null);
  const [nextCounter, setNextCounter] = useState(SIZEOFPAGER);
  const { fetchData } = useFetch();

  const [success, setSuccess] = useState(false);
  const initial = useRef(true);

  const [data, setData] = useState<BaseProjectProps[]>(
    [] as BaseProjectProps[]
  );

  const [DATA, setDATA] = useState<ServerResponse>({} as ServerResponse);
  const [projects, setProjects] = useState<BaseProjectProps[]>([]);
  const [projectIsLoading, setProjectIsLoading] = useState(true);
  const [selectedField, setSelectedField] = useState(fields[0]);
  const selectedRef = useRef(selectedField);

  const handleSearch = useCallback(
    (field: string) => {
      if (field === "All") {
        setProjects(() => data);
      } else {
        // Filtering by field name
        setProjects(() => {
          return data.filter((project: BaseProjectProps) => {
            return project.tags.includes(field);
          });
        });
      }
    },
    [data]
  );

  useEffect(() => {
    let firstRender = true;

    const getData = async () => {
      try {
        if (firstRender) {
          if (initial.current) {
            // Fetch data only once
            const res = await getProjectsNoCache(6);

            if (res.count > 0) {
              nextRef.current = res.next; // Set next pager
              setDATA(() => res);
              setData(() => res.results);
            }

            initial.current = false;
            setProjectIsLoading(() => false);
          }

          setProjects(() => data);
          handleSearch(selectedRef.current);
        }
      } catch (err) {}
    };

    getData();
    return () => {
      firstRender = false;
    };
  }, [data, fetchProjects, handleSearch]);

  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);

    if (nextRef.current) {
      try {
        // Send request to get next sequence of products
        let r = await fetchData(nextRef.current);

        const response: ServerResponse = r.data;

        if (nextRef.current !== null) {
          // Set next url
          nextRef.current = response.next;

          // Increase counter that controls 'Show more' button visibility
          setNextCounter((prev) => prev + SIZEOFPAGER);

          // Add the new products to the data
          setData((projects) => [...projects, ...response.results]);

          // Display success message
          setTimeout(() => setSuccess(() => true), 700);

          // Remove success message
          setTimeout(() => setSuccess(() => false), 5000);
        }
      } catch (error) {}
    }

    setLoading(false);
  };

  const projectsRef = useRef<HTMLDivElement>(null);
  const handleCheck = () => {
    if (projectsRef.current !== null) {
      projectsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section
        id="hero"
        className="w-full relative flex flex-col justify-center min-h-[40vh]
          bg-yellowish dark:bg-zinc-900 lg:min-h-[80vh] lg:py-8"
      >
        <div className="container mx-auto flex justify-center items-center h-full px-6 lg:justify-start sm:px-10 xl:px-14">
          <div className="w-full flex flex-col space-y-6 items-center py-10 lg:w-1/2 lg:items-start">
            <h1
              className="font-serif font-extrabold dark:text-zinc-100 max-w-lg flex flex-col space-y-px text-center items-center
               text-[56px] lg:items-start md:text-left"
            >
              <span className="hidden sm:block leading-tight">Complexity</span>
              <span className="hidden sm:block leading-tight sm:whitespace-nowrap">{`Simplified </>`}</span>
              <span className="sm:hidden">Gallery</span>
            </h1>
            <p className="text-lg mt-1 text-center leading-normal max-w-lg sm:text-xl lg:text-left dark:text-zinc-100">
              Explore my project gallery, where magic is made. Projects spread
              across a variety of domains.
            </p>

            <div className="pt-2 sm:pt-0">
              <button
                type="button"
                onClick={handleCheck}
                className="flex flex-row items-center text-base font-semibold px-7 py-3.5 bg-black dark:bg-zinc-100 rounded-md
                    text-white dark:text-zinc-900 gap-x-2 drop-shadow-lg outline-offset-2 outline-black dark:outline-zinc-100 outline-1 focus:outline
                    active:drop-shadow-none sm:text-lg hover:underline hover:bg-gray-900 dark:hover:bg-zinc-200"
              >
                Check them out
              </button>
            </div>
          </div>

          <div className="w-1/2 hidden h-full items-center flex-col justify-between space-y-8 lg:flex">
            <figure className="absolute bottom-0">
              <Image src={head} alt="Code infused bubble head" />
              <figcaption className="hidden">My image</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section
        id="projects"
        ref={projectsRef}
        className="w-full dark:bg-zinc-800 px-0 sm:px-4"
      >
        <div className="container mx-auto pt-12 px-4 sm:px-0 sm:pt-10">
          <h2 className="font-serif text-5xl font-extrabold dark:text-zinc-100 text-center space-y-1 xl:text-left">
            Projects
          </h2>

          <div className="flex top-0 space-x-6 mt-4 justify-center flex-wrap gap-y-4 xl:justify-start">
            {fields.map((field, index) => {
              return (
                <button
                  className={`
                  font-base py-1 px-4 ${
                    field === selectedField
                      ? "bg-black dark:bg-primary text-white"
                      : "bg-zinc-300 text-black"
                  }`}
                  onClick={() => {
                    setSelectedField(() => field);
                    selectedRef.current = field;
                    handleSearch(field); // filter tags
                  }}
                  key={index}
                >
                  {field}
                </button>
              );
            })}
          </div>

          <div className="mt-6 w-full grid grid-cols-auto pt-1 pb-3 gap-10 justify-center xl:gap-x-16 xl:justify-start">
            {/** PROJECTS */}
            {!projectIsLoading &&
              projects.map((project: BaseProjectProps) => {
                return <Project key={project.url} project={project} />;
              })}

            {projectIsLoading && (
              <>
                <ProjectLoading />
                <ProjectLoading />
                <ProjectLoading />
              </>
            )}

            {!projectIsLoading && projects.length === 0 && (
              <p className="text-zinc-100 dark:text-zinc-900 text-xl p-2 text-center dark:bg-zinc-100 bg-zinc-900">
                No projects in this category yet :)
              </p>
            )}
          </div>

          {!projectIsLoading &&
            DATA.count > nextCounter && ( // nextCounter changes as new products are gotten
              <div className="flex justify-center mt-8 sm:mt-10">
                <button
                  type="button"
                  className="text-lg font-semibold px-5 pl-6 py-3 bg-white border border-zinc-700
                    gap-x-2 shadow-md outline-offset-2 outline-zinc-700 outline-1 active:outline rounded-md
                    text-zinc-800 active:drop-shadow-none hover:underline hover:bg-zinc-100 disabled:opacity-75
                    disabled:cursor-not-allowed disabled:no-underline"
                  disabled={loading}
                  onClick={handleFetch}
                >
                  {!loading ? "Load More" : "Loading...."}
                </button>
              </div>
            )}
        </div>
      </section>

      {success && (
        <div className="fixed left-4 bottom-4 flex flex-col space-y-4 z-10">
          <Message type="success" message="Loaded successfully!" />
        </div>
      )}
    </>
  );
}

export default Projects;
