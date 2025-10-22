import type { Event } from "../../../types/types.js";

export const events: Event[] = [];

// Function to register a user for an event
export const registerUserForEvent = (
    eventId: string,
    userId: string
): { success: boolean; message: string } => {
    const eventIndex = events.findIndex((event) => event.id === eventId);

    if (eventIndex === -1) {
        return { success: false, message: "Event not found" };
    }

    const event = events[eventIndex];

    // Initialize participants array if it doesn't exist
    if (!event.participants) {
        event.participants = [];
    }

    // Check if user is already registered
    if (event.participants.includes(userId)) {
        return {
            success: false,
            message: "User already registered for this event",
        };
    }

    // Add user to participants
    event.participants.push(userId);
    events[eventIndex] = event;

    return {
        success: true,
        message: "User registered for the event successfully",
    };
};

// Function to get all participants for an event
export const getEventParticipants = (eventId: string): string[] | null => {
    const event = events.find((event) => event.id === eventId);

    if (!event) {
        return null;
    }

    return event.participants || [];
};

// Function to check if a user is registered for an event
export const isUserRegistered = (eventId: string, userId: string): boolean => {
    const event = events.find((event) => event.id === eventId);

    if (!event || !event.participants) {
        return false;
    }

    return event.participants.includes(userId);
};

// Function to unregister a user from an event
export const unregisterUserFromEvent = (
    eventId: string,
    userId: string
): { success: boolean; message: string } => {
    const eventIndex = events.findIndex((event) => event.id === eventId);

    if (eventIndex === -1) {
        return { success: false, message: "Event not found" };
    }

    const event = events[eventIndex];

    // Check if user is registered
    if (!event.participants || !event.participants.includes(userId)) {
        return {
            success: false,
            message: "User is not registered for this event",
        };
    }

    // Remove user from participants
    event.participants = event.participants.filter((id) => id !== userId);
    events[eventIndex] = event;

    return {
        success: true,
        message: "User unregistered from the event successfully",
    };
};
