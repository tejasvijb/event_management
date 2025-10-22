import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { events } from "../database/events.js";
import { Event } from "../../../types/types.js";

// Get all events
export const getAllEvents = asyncHandler(
    async (req: Request, res: Response) => {
        res.status(200).json(events);
    }
);

// Get a single event by ID
export const getEventById = asyncHandler(
    async (req: Request, res: Response) => {
        const event = events.find((e) => e.id === req.params.id);

        if (!event) {
            res.status(404);
            throw new Error("Event not found");
        }

        res.status(200).json(event);
    }
);

// Create a new event
export const createEvent = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error("User not authenticated");
    }

    // Check if user is an organizer
    if (req.user.type !== "organizer") {
        res.status(403);
        throw new Error("Only organizers can create events");
    }

    const { title, description, date, location } = req.body;

    const newEvent: Event = {
        id: crypto.randomUUID(),
        title,
        description,
        date: date instanceof Date ? date : new Date(date),
        location,
        organizerId: req.user.id,
        createdAt: new Date(),
    };

    events.push(newEvent);

    res.status(201).json(newEvent);
});

// Update an existing event
export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error("User not authenticated");
    }

    // Find the event
    const eventIndex = events.findIndex((e) => e.id === req.params.id);

    if (eventIndex === -1) {
        res.status(404);
        throw new Error("Event not found");
    }

    // Check if user is the organizer of this event
    if (events[eventIndex].organizerId !== req.user.id) {
        res.status(403);
        throw new Error("You can only update your own events");
    }

    // Check if user is an organizer
    if (req.user.type !== "organizer") {
        res.status(403);
        throw new Error("Only organizers can update events");
    }

    const { title, description, date, location } = req.body;

    // Update event fields
    const updatedEvent: Event = {
        ...events[eventIndex],
        title: title || events[eventIndex].title,
        description: description || events[eventIndex].description,
        date: date
            ? date instanceof Date
                ? date
                : new Date(date)
            : events[eventIndex].date,
        location: location || events[eventIndex].location,
    };

    events[eventIndex] = updatedEvent;

    res.status(200).json(updatedEvent);
});

// Delete an event
export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error("User not authenticated");
    }

    // Find the event
    const eventIndex = events.findIndex((e) => e.id === req.params.id);

    if (eventIndex === -1) {
        res.status(404);
        throw new Error("Event not found");
    }

    // Check if user is the organizer of this event
    if (events[eventIndex].organizerId !== req.user.id) {
        res.status(403);
        throw new Error("You can only delete your own events");
    }

    // Check if user is an organizer
    if (req.user.type !== "organizer") {
        res.status(403);
        throw new Error("Only organizers can delete events");
    }

    // Remove the event
    events.splice(eventIndex, 1);

    res.status(200).json({ message: "Event deleted successfully" });
});

// Middleware to check if the user is an organizer
export const isOrganizer = asyncHandler(
    async (req: Request, res: Response, next) => {
        if (!req.user) {
            res.status(401);
            throw new Error("User not authenticated");
        }

        if (req.user.type !== "organizer") {
            res.status(403);
            throw new Error(
                "Access denied. Only organizers can perform this action"
            );
        }

        next();
    }
);
