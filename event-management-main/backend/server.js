const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("./mongodbConnect"); // Ensure this is correct
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

// Default Route (Optional)
app.get("/", (req, res) => {
  res.send("Welcome to Event Management API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
