import express from "express";
import "dotenv/config"; // Asegúrate de que dotenv esté configurado al principio
import cors from "cors";
import connectDB from "./configs/db.js"; // Asegúrate que la ruta sea correcta
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js"; // Asegúrate que la ruta sea correcta

// Conecta la base de datos al inicio
connectDB();

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing for all routes

// --- ¡CRÍTICO PARA WEBHOOKS DE SVIX! ---
// Para webhooks de Svix, necesitas el cuerpo RAW (sin parsear) para la verificación de la firma.
// Express.json() parsea el cuerpo, lo que puede invalidar la verificación de Svix.
// Por eso, aplicamos express.raw() SOLO a la ruta del webhook.
app.use("/api/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

// --- Middleware General ---
// Este middleware para parsear JSON se aplica a TODAS LAS OTRAS RUTAS que esperan JSON.
// Es importante que venga DESPUÉS de la definición de la ruta del webhook,
// porque el webhook ya manejó su propio parsing con express.raw().
app.use(express.json());

// clerkMiddleware() se aplica a todas las rutas.
// Esto es para autenticar requests a tus propias APIs usando Clerk,
// NO para recibir los webhooks de Clerk. Es correcto que esté aquí.
app.use(clerkMiddleware());


// Ruta de ejemplo (health check)
app.get("/", (req, res) => res.send("API is working"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`-> Server running on port ${PORT}`)); // Añadido un prefijo a los logs
