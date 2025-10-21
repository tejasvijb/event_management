import express from "express";
import userRoutes from "./routes/userRoutes.js";

const v1Router = express.Router();

// Mount routes
v1Router.use("/user", userRoutes);

export default v1Router;
