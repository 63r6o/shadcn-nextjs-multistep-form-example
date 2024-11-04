import { z } from "zod";

export const inputDataSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  githubUrl: z.string().url(),
  feedback: z.string().max(255),
});

export type InputData = z.infer<typeof inputDataSchema>;
