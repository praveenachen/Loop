import { z } from "zod";

export const marketplaceCreateSchema = z.object({
  title: z.string().min(3).max(140),
  description: z.string().min(8).max(1000),
  price: z.number().int().nonnegative(),
  location: z.string().min(2).max(120),
  category: z.string().min(2).max(60)
});

export const rideCreateSchema = z.object({
  route: z.string().min(3).max(140),
  departure: z.string().min(3).max(80),
  pricePerSeat: z.number().int().nonnegative(),
  seats: z.number().int().min(0).max(8),
  car: z.string().min(2).max(120),
  mode: z.enum(["OFFER", "REQUEST"]).default("OFFER")
});

export const studyGroupCreateSchema = z.object({
  course: z.string().min(2).max(20),
  title: z.string().min(3).max(140),
  schedule: z.string().min(3).max(120),
  location: z.string().min(2).max(120),
  seatsLeft: z.number().int().min(0).max(60),
  focus: z.string().min(4).max(240)
});
