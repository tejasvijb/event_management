import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import { validateRequestBody } from "../middleware/validateRequestBody.js";
import { loginUserSchema, registerUserSchema } from "../../../types/types.js";

const router = express.Router();

router.post("/register", validateRequestBody(registerUserSchema), registerUser);

router.post("/login", validateRequestBody(loginUserSchema), loginUser);

export default router;
