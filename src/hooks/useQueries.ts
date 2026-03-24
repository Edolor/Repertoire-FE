import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchAbout,
  fetchProjects,
  fetchProjectDetail,
  createMessage,
  MessagePayload,
} from "@/lib/queries";

export const useAboutQuery = () =>
  useQuery({
    queryKey: ["about"],
    queryFn: fetchAbout,
    staleTime: 5 * 60 * 1000,
  });

export const useProjectsQuery = (size: number) =>
  useQuery({
    queryKey: ["projects", size],
    queryFn: () => fetchProjects(size),
  });

export const useProjectDetailQuery = (id: string) =>
  useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProjectDetail(id),
    enabled: !!id,
  });

export const useCreateMessage = () =>
  useMutation({
    mutationFn: (payload: MessagePayload) => createMessage(payload),
  });
