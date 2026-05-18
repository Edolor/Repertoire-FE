import { z } from "zod";

// Shared client + server validation shape.
export const contactSchema = z.object({
  name: z.string().min(2, "Tell me who you are").max(120),
  email: z.string().email("That email looks off"),
  // One-line problem statement. Kept short on purpose.
  message: z
    .string()
    .min(12, "One concrete line about the problem")
    .max(600, "Keep it to the gist, we go deeper on a call"),
  // Honeypot: real users never fill this.
  company_website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
