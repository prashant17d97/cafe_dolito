import { z } from "zod";
import { nameSchema, emailSchema, phoneSchema } from "./patterns";

export const reservationSchema = z.object({
  date: z.string().min(1, "Pick a date"),
  timeSlot: z.string().min(1, "Pick a time"),
  partySize: z.coerce.number().int().min(1, "At least 1 guest").max(20, "Call us for parties over 20"),
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  occasion: z.string().optional(),
  notes: z.string().max(500, "Keep notes under 500 characters").optional(),
});
export type ReservationForm = z.infer<typeof reservationSchema>;
