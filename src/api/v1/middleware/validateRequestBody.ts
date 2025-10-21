import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * Middleware for validating request body against a Zod schema
 * @param schema The Zod schema to validate against
 */
export const validateRequestBody = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body against the schema
      schema.parse(req.body);
      // If validation passes, proceed to the next middleware or controller
      next();
    } catch (error) {
      // If validation fails, return a 400 Bad Request response with the validation error
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation failed", 
          errors: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        });
      } else {
        // For any other type of error
        res.status(400).json({ 
          message: "Invalid request body",
          error: "Unexpected validation error"
        });
      }
    }
  };
};