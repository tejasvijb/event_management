import express from "express";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

const v1Router = express.Router();

// Mount routes
v1Router.use("/user", userRoutes);
v1Router.use("/event", eventRoutes);

export default v1Router;
