import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

const app = express();

connectDB(); // ⬅️ asegurate que se ejecuta

app.use(cors());

// ✅ RAW body SOLO para Clerk Webhook
app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

// ✅ Middleware del resto de la app
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("API is working fine"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

