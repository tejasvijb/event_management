import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const validateToken = asyncHandler(async (req, res, next) => {
    let token: string | undefined;
    let authHeader = req.headers.authorization;
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401);
            throw new Error("User is not authorized or token is missing");
        }

        if (!ACCESS_TOKEN_SECRET) {
            res.status(500);
            throw new Error("Access token secret is not defined");
        }

        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User is not authorized");
            }
            console.log(decoded);
            req.user = (
                decoded as {
                    user: { username: string; type: string; id: string };
                }
            ).user;
            next();
        });
    } else {
        res.status(401);
        throw new Error("User is not authorized or token is missing");
    }
});

export default validateToken;
