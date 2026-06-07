import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchAbout, createMessage, MessagePayload } from "@/lib/queries";
import type { AboutProps } from "@/types/About.types";

// `initialData` lets the /about page seed the cache with data fetched on the
// server, so the credentials render in the SSR HTML (visible to crawlers, no
// loading spinner) while still revalidating on the client.
export const useAboutQuery = (initialData?: AboutProps) =>
  useQuery({
    queryKey: ["about"],
    queryFn: fetchAbout,
    staleTime: 5 * 60 * 1000,
    initialData,
  });

export const useCreateMessage = () =>
  useMutation({
    mutationFn: (payload: MessagePayload) => createMessage(payload),
  });
