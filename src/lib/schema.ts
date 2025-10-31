import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Email is required" }),
  password: z.string().min(8, { error: "Minimum 8 characters required" }),
});

export const registerSchema = z.object({
  email: z.email({ error: "Email is required" }),
  password: z.string().min(8, { error: "Minimum 8 characters required" }),
  name: z.string().min(1, { error: "Name is required" }),
});

export const addMoneySchema = z.object({
  amount: z
    .number()
    .min(50, { error: "Minimum 50 rupees are required" })
    .optional(),
  bank: z.string(),
});

export const transferMoneySchema = z.object({
  amount: z.number().min(50, { error: "Minimum 50 rupees are required" }),
  transferAccount: z.string(),
  bank: z.string().optional(),
});
