import express from "express";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4001;

app.get("/", (req, res) => {
    res.send("Welcome to the Event Management Service!");
});

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
