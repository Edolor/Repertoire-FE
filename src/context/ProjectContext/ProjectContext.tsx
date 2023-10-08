"use client";
import { useContext, createContext, useEffect } from "react";
import { baseURL, PATHS } from "../../urls";
import axios, { AxiosResponse } from "axios";

type ProjectContextProps = {
  getProjects: (size?: number) => Promise<any>;
  getProjectDetails: (projectId: string) => Promise<AxiosResponse<any, any>>;
  fetchProjects: (size?: number) => Promise<AxiosResponse<any, any>>;
};
const ProjectContext = createContext<ProjectContextProps>(
  {} as ProjectContextProps
);
export const useProject = () => {
  return useContext(ProjectContext);
};

export default function ProjectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = axios.create({ baseURL: baseURL });

  useEffect(() => {
    let firstRender = false;

    const checkHealth = async () => {
      if (!firstRender) {
        try {
          return await client.get(`${PATHS.health}`);
        } catch (e) {
          return [];
        }
      }
    };

    checkHealth(); // Call request

    return () => {
      firstRender = true;
    };
  }, [client]);

  const getProjects = async (size = 3) => {
    /** Return 3 projects for the home page */
    const response = await client
      .get(`${PATHS.projects}?size=${size}`)
      .then((res) => {
        return res.data;
      });

    return response;
  };

  const fetchProjects = async (size = 3) => {
    /** Return 3 projects for the home page */
    return client.get(`${PATHS.projects}?size=${size}`);
  };

  const getProjectDetails = async (projectId: string) => {
    // Id passed by loader automatically
    /** Return 3 projects for the home page */
    return await client.get(`${PATHS.projectDetail}${projectId}/`);
  };

  const value = {
    getProjects,
    getProjectDetails,
    fetchProjects,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}
