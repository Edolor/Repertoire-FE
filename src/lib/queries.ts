import { apiClient } from "./api";
import { PATHS } from "@/urls";
import { AboutProps } from "@/types/About.types";
import { BaseProjectProps } from "@/types/Project.types";
import { ServerResponse } from "@/app/(root)/projects/Projects.types";

export const fetchAbout = async (): Promise<AboutProps> => {
  const { data } = await apiClient.get(PATHS.about);
  return data;
};

export const fetchProjects = async (size: number): Promise<ServerResponse> => {
  const { data } = await apiClient.get(`${PATHS.projects}?size=${size}`);
  return data;
};

export const fetchProjectDetail = async (id: string): Promise<BaseProjectProps> => {
  const { data } = await apiClient.get(`${PATHS.projectDetail}${id}/`);
  return data;
};

export const fetchProjectsPage = async (url: string): Promise<ServerResponse> => {
  const { data } = await apiClient.get(url);
  return data;
};

export type MessagePayload = { name: string; email: string; message: string };

export const createMessage = async (payload: MessagePayload): Promise<void> => {
  const { data } = await apiClient.post(PATHS.contact, payload);
  return data;
};
