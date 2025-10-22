import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
    events,
    registerUserForEvent,
    getEventParticipants,
    isUserRegistered,
    unregisterUserFromEvent,
} from "../database/events.js";
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
        participants: [],
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
        participants: events[eventIndex].participants || [],
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

// Middleware to check if the user is an attendee
export const isAttendee = asyncHandler(
    async (req: Request, res: Response, next) => {
        if (!req.user) {
            res.status(401);
            throw new Error("User not authenticated");
        }

        if (req.user.type !== "attendee") {
            res.status(403);
            throw new Error(
                "Access denied. Only attendees can register for events"
            );
        }

        next();
    }
);

// Register a user for an event
export const registerForEvent = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401);
            throw new Error("User not authenticated");
        }

        const eventId = req.params.id;
        const userId = req.user.id;

        // Check if the user is already registered
        if (isUserRegistered(eventId, userId)) {
            res.status(400);
            throw new Error("You are already registered for this event");
        }

        // Register the user for the event
        const result = registerUserForEvent(eventId, userId);

        if (!result.success) {
            res.status(400);
            throw new Error(result.message);
        }

        res.status(201).json({
            message: result.message,
            eventId,
            userId,
        });
    }
);

// Get all participants for an event
export const getEventRegistrations = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401);
            throw new Error("User not authenticated");
        }

        const eventId = req.params.id;

        // Check if the event exists
        const event = events.find((e) => e.id === eventId);
        if (!event) {
            res.status(404);
            throw new Error("Event not found");
        }

        // Only organizers or the event creator can view participant lists
        if (
            req.user.type !== "organizer" &&
            event.organizerId !== req.user.id
        ) {
            res.status(403);
            throw new Error(
                "You do not have permission to view the participant list"
            );
        }

        const participants = getEventParticipants(eventId);

        if (participants === null) {
            res.status(404);
            throw new Error("Event not found");
        }

        res.status(200).json({
            eventId,
            participantCount: participants.length,
            participants,
        });
    }
);

// Check if the current user is registered for an event
export const checkRegistrationStatus = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401);
            throw new Error("User not authenticated");
        }

        const eventId = req.params.id;
        const userId = req.user.id;

        // Check if the event exists
        const event = events.find((e) => e.id === eventId);
        if (!event) {
            res.status(404);
            throw new Error("Event not found");
        }

        const registered = isUserRegistered(eventId, userId);

        res.status(200).json({
            eventId,
            userId,
            registered,
        });
    }
);

// Cancel registration for an event
export const cancelRegistration = asyncHandler(
    async (req: Request, res: Response) => {
        if (!req.user) {
            res.status(401);
            throw new Error("User not authenticated");
        }

        const eventId = req.params.id;
        const userId = req.user.id;

        // Check if the user is registered
        if (!isUserRegistered(eventId, userId)) {
            res.status(400);
            throw new Error("You are not registered for this event");
        }

        // Unregister the user from the event
        const result = unregisterUserFromEvent(eventId, userId);

        if (!result.success) {
            res.status(400);
            throw new Error(result.message);
        }

        res.status(200).json({
            message: result.message,
            eventId,
            userId,
        });
    }
);
