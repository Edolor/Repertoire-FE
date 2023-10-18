import { PATHS, baseURL } from "./urls";

export async function getProjects( size: number ) {
    const response = await fetch(`${baseURL}${PATHS.projects}?size=${size}`, {
      next: { revalidate: 3600 },
    });
  
    const data = await response.json();
  
    return data;
}

export async function getProjectsNoCache( size: number ) {
    const response = await fetch(`${baseURL}${PATHS.projects}?size=${size}`,
        { cache: "no-store" }
    );
  
    const data = await response.json();
  
    return data;
}