import express from "express";
import morgan from "morgan";
import v1Router from "./api/v1/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(morgan("dev"));

app.use(express.json());

const PORT = process.env.PORT || 4001;

app.get("/", (req, res) => {
    res.send("Welcome to the Event Management Service!");
});

app.use("/api/v1", v1Router);

// Initialize the application
const initApp = async () => {
    try {
        // Start the Express server
        app.listen(PORT, () => {
            console.log(`🚀 Service running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Application initialization failed:", error);
        process.exit(1);
    }
};

// Start the application
initApp();
