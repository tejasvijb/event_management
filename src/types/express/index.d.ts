// types/express.d.ts

import express from "express";

declare global {
    namespace Express {
        interface Request {
            user?: {
                username: string;
                type: string;
                id: string;
            };
        }
    }
}
