import { z } from "zod";

export const reservationSchema = z.object({
  date: z.string().min(1, "Pick a date"),
  timeSlot: z.string().min(1, "Pick a time"),
  partySize: z.coerce.number().int().min(1, "At least 1 guest").max(20, "Call us for parties over 20"),
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  occasion: z.string().optional(),
  notes: z.string().max(500, "Keep notes under 500 characters").optional(),
});
export type ReservationForm = z.infer<typeof reservationSchema>;
