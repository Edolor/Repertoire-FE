import React from "react";
import Icon from "../Icon/Icon";
import { BaseProjectProps } from "@/types/Project.types";

type DetailProps = {
  project: BaseProjectProps;
  theme: string;
  loading: boolean;
};

const DetailSide: React.FC<DetailProps> = ({ project, theme, loading }) => {
  return (
    <div
      className="bg-white dark:bg-zinc-800 rounded-xl p-6  space-y-2 flex flex-col 
                items-center drop-shadow-lg w-full sm:w-96 sm:p-8 md:mx-0"
    >
      {loading ? (
        <>
          <div className="w-full h-8 animate-pulse bg-zinc-400"></div>
          <div className="w-full h-8 animate-pulse bg-zinc-400"></div>
          <div className="w-full h-8 animate-pulse bg-zinc-400"></div>
          <div className="w-full h-8 animate-pulse bg-zinc-400"></div>
          <div className="w-full h-8 animate-pulse bg-zinc-400"></div>

          <span className="w-full h-px bg-zinc-300">&nbsp;</span>

          <div className="w-full h-16 animate-pulse bg-zinc-500"></div>
        </>
      ) : (
        <>
          <div className="group text-xl dark:text-zinc-100 flex justify-between items-center w-full py-1">
            <span className="font-bold">Date:</span>
            <span className="text-right flex justify-end">
              {project.created}
            </span>
          </div>

          <div className="group text-xl dark:text-zinc-100 flex justify-between items-center w-full py-1">
            <span className="font-bold">Client:</span>
            <span className="text-right flex justify-end">
              {project.client}
            </span>
          </div>

          <div className="group text-xl dark:text-zinc-100 flex justify-between items-center w-full py-1">
            <span className="font-bold">Domain:</span>
            <span className="text-right flex justify-end">
              {project.domain}
            </span>
          </div>

          <div className="group text-xl dark:text-zinc-100 flex justify-between items-center w-full py-1">
            <span className="font-bold">Type:</span>
            <span className="text-right flex justify-end">{project.type}</span>
          </div>

          <div className="group text-xl dark:text-zinc-100 flex justify-between items-center w-full py-1">
            <span className="font-bold">Role:</span>
            <span className="text-right flex justify-end">{project.role} </span>
          </div>

          {(project.live_url || project.figma_url || project.github_url) && (
            <span className="w-full h-px bg-zinc-300">&nbsp;</span>
          )}

          <div className="pt-3 space-y-4 w-full">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-primary text-xl dark:text-zinc-100
                                py-3 px-4 rounded-md border border-primary dark:border-white flex items-center justify-between gap-2"
              >
                <span className="underline sm:whitespace-nowrap group-hover:no-underline">
                  View live Project
                </span>
                <Icon
                  name="chevron-right"
                  color={theme === "light" ? "#027373" : "#ffffff"}
                  classes="h-8 w-8 transition-transform group-hover:scale-95"
                />
              </a>
            )}

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-primary text-xl dark:text-zinc-100
                                py-2 px-4 rounded-md border border-primary dark:border-white flex items-center justify-between gap-2"
              >
                <span className="underline sm:whitespace-nowrap group-hover:no-underline">
                  View project on Github
                </span>
                <Icon
                  name="github"
                  color={theme === "light" ? "#027373" : "#ffffff"}
                  classes="h-10 w-10 transition-transform group-hover:scale-95"
                />
              </a>
            )}

            {project.figma_url && (
              <a
                href={project.figma_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-figma text-xl dark:text-zinc-100
                                py-2 px-4 rounded-md border border-figma flex items-center justify-between gap-2"
              >
                <span className="underline sm:whitespace-nowrap group-hover:no-underline">
                  View project on Figma
                </span>
                <Icon
                  name="figma-logo"
                  color={theme === "light" ? "#027373" : "#ffffff"}
                  classes="h-10 w-10 transition-transform group-hover:scale-95"
                />
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DetailSide;
