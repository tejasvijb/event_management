import { z } from "zod";

export const userSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(100),
    type: z.enum(["organizer", "attendee"]),
    createdAt: z.date(),
    id: z.uuid(),
});

export const loginUserSchema = userSchema.pick({
    username: true,
    password: true,
});

export const registerUserSchema = userSchema.pick({
    username: true,
    password: true,
    type: true,
});

export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = z.infer<typeof userSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
