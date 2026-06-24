import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  subject: z.string().min(1, "Add a subject"),
  message: z.string().min(10, "Tell us a little more (10+ characters)").max(1000, "Keep it under 1000 characters"),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;
