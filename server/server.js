import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRoutes from "./routes/users.js"; // <--- importa las rutas

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Rutas
app.use("/api/clerk", clerkWebhooks);
app.use("/api/users", userRoutes); // <--- monta las rutas de usuarios

app.get("/", (req, res) => res.send("API is working"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
