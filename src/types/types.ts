import { z } from "zod";

// user schema definition

export const userSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(100),
    type: z.enum(["organizer", "attendee"]),
    createdAt: z.date(),
    id: z.string().uuid(),
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

// event schema definition

export const eventSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(5).max(100),
    description: z.string().min(10).max(1000),
    date: z.date(),
    location: z.string().min(5).max(200),
    organizerId: z.string().uuid(),
    createdAt: z.date(),
    participants: z.array(z.string().uuid()).optional().default([]),
});

// Schema for creating a new event (excludes id, organizerId, and createdAt which are set by the server)
export const createEventSchema = eventSchema
    .omit({
        id: true,
        organizerId: true,
        createdAt: true,
    })
    .extend({
        date: z.string().or(z.date()), // Allow date to be a string or Date object
    });

// Schema for updating an existing event (makes all fields optional)
export const updateEventSchema = createEventSchema.partial();

// Registration schema
export const registrationSchema = z.object({
    eventId: z.string().uuid(),
    userId: z.string().uuid(),
});

export type Event = z.infer<typeof eventSchema>;
export type CreateEvent = z.infer<typeof createEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;
export type Registration = z.infer<typeof registrationSchema>;
