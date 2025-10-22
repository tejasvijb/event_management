import express from "express";
import validateToken from "../middleware/validateTokenHandler.js";
import {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    isOrganizer,
} from "../controllers/eventController.js";
import { validateRequestBody } from "../middleware/validateRequestBody.js";
import { createEventSchema, updateEventSchema } from "../../../types/types.js";

const router = express.Router();

// Get all events - accessible by all authenticated users
router.get("/", validateToken, getAllEvents);

// Get a specific event by ID - accessible by all authenticated users
router.get("/:id", validateToken, getEventById);

// Create a new event - only organizers
router.post(
    "/",
    validateToken,
    isOrganizer,
    validateRequestBody(createEventSchema),
    createEvent
);

// Update an existing event - only the organizer who created it
router.put(
    "/:id",
    validateToken,
    isOrganizer,
    validateRequestBody(updateEventSchema),
    updateEvent
);

// Delete an event - only the organizer who created it
router.delete("/:id", validateToken, isOrganizer, deleteEvent);

export default router;
