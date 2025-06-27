import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  // --- Inicio de los logs de depuración ---
  console.log("-> [clerkWebhooks] Function started.");
  console.log("-> [clerkWebhooks] Full request headers:", req.headers); // Muestra todos los encabezados recibidos
  // --- Fin de los logs de depuración ---

  try {
    // Create a Svix instance with clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Getting Headers for Svix verification
    // CORRECCIÓN CLAVE: 'svix-timestamps' a menudo es 'svix-timestamp' (sin la 's' al final)
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"], // <-- CORREGIDO AQUÍ: removida la 's' final de 'timestamps'
      "svix-signature": req.headers["svix-signature"],
    };

    // --- Logs de depuración ---
    console.log("-> [clerkWebhooks] Headers extracted for Svix:", headers);
    console.log("-> [clerkWebhooks] Attempting webhook verification...");
    // --- Fin de los logs de depuración ---

    // Veryfing headers
    await whook.verify(JSON.stringify(req.body), headers);

    // --- Logs de depuración ---
    console.log("-> [clerkWebhooks] Webhook verification SUCCEEDED!");
    // --- Fin de los logs de depuración ---

    // Getting Data from request body
    const { data, type } = req.body;

    // --- Logs de depuración ---
    console.log("-> [clerkWebhooks] Received Webhook Type:", type);
    console.log("-> [clerkWebhooks] Received Webhook Data:", data);
    // --- Fin de los logs de depuración ---

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      // Asegúrate de manejar casos donde first_name o last_name puedan ser null/undefined
      username: (data.first_name || "") + " " + (data.last_name || ""),
      image: data.image_url,
      // IMPORTANTE: Inicializar recentSearchedCities para evitar errores de validación 'required'
      recentSearchedCities: [],
    };

    // --- Logs de depuración ---
    console.log("-> [clerkWebhooks] Prepared userData for Mongoose:", userData);
    // --- Fin de los logs de depuración ---

    // Switch Cases for different Events
    switch (type) {
      case "user.created": {
        console.log("-> [clerkWebhooks] Handling 'user.created' event...");
        await User.create(userData);
        console.log("-> [clerkWebhooks] User created successfully!");
        break;
      }

      case "user.updated": {
        console.log("-> [clerkWebhooks] Handling 'user.updated' event...");
        await User.findByIdAndUpdate(data.id, userData);
        console.log("-> [clerkWebhooks] User updated successfully!");
        break;
      }

      case "user.deleted": {
        console.log("-> [clerkWebhooks] Handling 'user.deleted' event...");
        await User.findByIdAndDelete(data.id);
        console.log("-> [clerkWebhooks] User deleted successfully!");
        break;
      }

      default:
        console.log(`-> [clerkWebhooks] Unhandled webhook type: ${type}`);
        break;
    }
    console.log("-> [clerkWebhooks] Webhook handler finished, sending success response.");
    res.json({ success: true, message: "Webhook Received" });
  } catch (error) {
    // --- Manejo de errores mejorado ---
    console.error("!!! ERROR [clerkWebhooks]: An error occurred.");
    console.error("!!! ERROR Message:", error.message);
    console.error("!!! Full Error Object:", error); // Esto mostrará más detalles del error
    // --- Fin del manejo de errores mejorado ---
    res.status(500).json({ success: false, message: error.message }); // Envía un 500 para indicar error a Clerk
  }
};

export default clerkWebhooks;