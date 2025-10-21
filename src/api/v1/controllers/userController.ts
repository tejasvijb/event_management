import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import type { LoginUser, RegisterUser, User } from "../../../types/types.js";
import { users } from "../database/users.js";

export const registerUser = asyncHandler(
    async (req: Request, res: Response, next) => {
        const body: RegisterUser = req.body;

        const userAvailable = users.find(
            (user) => user.username === body.username
        );

        if (userAvailable) {
            res.status(400);
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        const user: User = {
            username: body.username,
            password: hashedPassword,
            type: body.type,
            createdAt: new Date(),
            id: crypto.randomUUID(),
        };
        users.push(user);

        console.log(`User Created ${user}`);

        if (user) {
            res.status(201).json({ username: user.username, type: user.type });
        } else {
            res.status(400);
            throw new Error("User data is not valid");
        }
    }
);

export const loginUser = asyncHandler(
    async (req: Request, res: Response, next) => {
        const accessToken_secret = process.env.ACCESS_TOKEN_SECRET;
        if (!accessToken_secret) {
            res.status(500);
            throw new Error("Access token secret is not defined");
        }
        const body: LoginUser = req.body;

        const user = users.find((user) => user.username === body.username);

        // compare password with hashed password
        if (user && (await bcrypt.compare(body.password, user.password))) {
            const accessToken = jwt.sign(
                {
                    user: {
                        username: user.username,
                        type: user.type,
                        id: user.id,
                    },
                },
                accessToken_secret,
                {
                    expiresIn: "15m",
                }
            );
            res.status(200).json({
                accessToken,
            });
        } else {
            res.status(401);
            throw new Error("Invalid email or password");
        }
    }
);
