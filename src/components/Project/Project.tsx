import React from 'react';
import Link from 'next/link';
import { useTheme } from "../../context/ThemeContext/ThemeContext";
import Icon from "../Icon/Icon";
import { ProjectProps } from './Project.types';
import Image from 'next/image';

function Project({ project }: ProjectProps) {
    const { theme } = useTheme();

    return (
        <div className="w-full block group shrink-0 drop-shadow-lg rounded-xl self-stretch cursor-pointer ring-offset-0 ring-0 ring-gray-300 focus:ring-1 hover:ring-1
            sm:max-w-sm active:drop-shadow-none hover:drop-shadow-md focus:drop-shadow-md">
            <Link href={project.url} className="w-full h-full group bg-white flex flex-col dark:bg-zinc-900 rounded-xl cursor-pointer overflow-hidden">
                <figure className="h-60 bg-zinc-200 dark:bg-zinc-500">
                    <Image src={`${project.thumbnail}`} alt="Thumbnail of project" loading="lazy" className="h-full w-full color-transparent object-cover indent-[100%] block overflow-hidden whitespace-nowrap" />

                    <figcaption className="hidden">Project Image</figcaption>
                </figure>
                <div className="py-7 px-6 gap-2.5 flex flex-col flex-1">
                    <p className="text-gray-800 text-sm flex items-center space-x-2">
                        <Icon name="calendar" color={theme === "light" ? "#3E3E3E" : "#ffffff"} classes="h-4 w-4 block" />
                        <span className="dark:text-zinc-100">{project.created}</span>
                    </p>
                    <h4 className="font-bold underline group-hover:no-underline text-xl dark:text-zinc-100 truncate">{project.title}</h4>
                    <p className="text-gray-800 dark:text-zinc-200 leading-normal text-lg mb-auto">
                        {
                            project.description.trim().length > 120 ?
                                (project.description.trim().slice(0, 110) + "...")
                                :
                                project.description
                        }

                    </p>
                    <span className="uppercase font-bold space-x-2 mt-1 flex items-center">
                        <span className="underline group-hover:no-underline dark:text-zinc-100">View Project</span>
                        <Icon name="right-arrow" color={theme === "light" ? "#000000" : "#ffffff"} classes="h-4 w-4 transition-transform group-hover:translate-x-2" />
                    </span>
                </div>
            </Link>
        </div>
    )
}

export default Project
