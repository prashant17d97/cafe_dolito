import { z } from "zod";
import { nameSchema, emailSchema } from "./patterns";

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().trim().min(1, "Add a subject"),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(1000, "Keep it under 1000 characters"),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;
