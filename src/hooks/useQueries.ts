import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchAbout, createMessage, MessagePayload } from "@/lib/queries";

export const useAboutQuery = () =>
  useQuery({
    queryKey: ["about"],
    queryFn: fetchAbout,
    staleTime: 5 * 60 * 1000,
  });

export const useCreateMessage = () =>
  useMutation({
    mutationFn: (payload: MessagePayload) => createMessage(payload),
  });
