import { z } from "zod";

export const DaySchema = z.object({
  day: z.number(),
  morning: z.string(),
  afternoon: z.string(),
  evening: z.string(),
  estimatedCost: z.number()
});

export const ItinerarySchema = z.array(DaySchema);
