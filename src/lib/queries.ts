import { apiClient } from "./api";
import { PATHS } from "@/urls";
import { AboutProps } from "@/types/About.types";
import { BaseProjectProps } from "@/types/Project.types";
import { ServerResponse } from "@/types/Server.types";
import { sanitizeProject, sanitizeAbout } from "./sanitize";

export const fetchAbout = async (): Promise<AboutProps> => {
  const { data } = await apiClient.get(PATHS.about);
  return sanitizeAbout(data);
};

export const fetchProjects = async (size: number): Promise<ServerResponse> => {
  const { data } = await apiClient.get<ServerResponse>(
    `${PATHS.projects}?size=${size}`,
  );
  return { ...data, results: (data.results ?? []).map(sanitizeProject) };
};

export const fetchProjectDetail = async (
  id: string,
): Promise<BaseProjectProps> => {
  const { data } = await apiClient.get(`${PATHS.projectDetail}${id}/`);
  return sanitizeProject(data);
};

export const fetchProjectsPage = async (
  url: string,
): Promise<ServerResponse> => {
  const { data } = await apiClient.get<ServerResponse>(url);
  return { ...data, results: (data.results ?? []).map(sanitizeProject) };
};

export type MessagePayload = { name: string; email: string; message: string };

export const createMessage = async (payload: MessagePayload): Promise<void> => {
  const { data } = await apiClient.post(PATHS.contact, payload);
  return data;
};
