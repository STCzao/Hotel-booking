import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB();

const app = express();
<<<<<<< HEAD
app.use(cors());
app.use(express.json()); // JSON para rutas normales

// Webhook Clerk (firma requiere type: "*/*")
app.post("/api/clerk", express.json({ type: "*/*" }), clerkWebhooks);
=======
app.use(cors()); // Enable Cross-Origin Resource Sharing

//Middleware
app.use(express.json());
app.use(clerkMiddleware());

// API to listen to Clerl Webhooks
app.use("/api/clerk", clerkWebhooks)
>>>>>>> parent of b6fe0c9 (Probando la conexion a MongoDB)

app.get("/", (req, res) => res.send("API is working"));

const PORT = process.env.PORT || 3000;
<<<<<<< HEAD
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
=======

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> parent of b6fe0c9 (Probando la conexion a MongoDB)
