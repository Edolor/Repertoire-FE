import { apiClient } from "./api";
import { PATHS } from "@/urls";
import { AboutProps } from "@/types/About.types";
import { sanitizeAbout } from "./sanitize";

export const fetchAbout = async (): Promise<AboutProps> => {
  const { data } = await apiClient.get(PATHS.about);
  return sanitizeAbout(data);
};

export type MessagePayload = { name: string; email: string; message: string };

export const createMessage = async (payload: MessagePayload): Promise<void> => {
  const { data } = await apiClient.post(PATHS.contact, payload);
  return data;
};
