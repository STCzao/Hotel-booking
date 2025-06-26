import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    console.log("🚨 Webhook recibido:", req.body);

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verificación de la firma
    await wh.verify(JSON.stringify(req.body), headers);

    const { data, type } = req.body;

    const userData = {
      clerkId: data.id,
      email: data.email_addresses[0].email_address,
      username: `${data.first_name} ${data.last_name}`,
      image: data.image_url,
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        console.log("✅ Usuario creado en MongoDB:", userData.clerkId);
        break;

      case "user.updated":
        await User.findOneAndUpdate({ clerkId: data.id }, userData);
        console.log("🔄 Usuario actualizado:", userData.clerkId);
        break;

      case "user.deleted":
        await User.findOneAndDelete({ clerkId: data.id });
        console.log("🗑️ Usuario eliminado:", data.id);
        break;

      default:
        console.log("ℹ️ Evento no manejado:", type);
        break;
    }

    res.status(200).json({ success: true, message: "Webhook recibido" });
  } catch (error) {
    console.error("❌ Error en webhook:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
