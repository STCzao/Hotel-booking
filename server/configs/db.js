import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("-> [MongoDB] Database Connected") // Añadido un prefijo para mejor visibilidad en logs
    );
    // Asegúrate de que process.env.MONGODB_URI no tenga una barra final si '/Hotel' se añade
    await mongoose.connect(`${process.env.MONGODB_URI}/Hotel`);
  } catch (error) {
    console.error("!!! ERROR [MongoDB] Database connection failed:", error.message); // Usar console.error
    // Puedes también considerar un process.exit(1) aquí en un entorno de producción
    // para asegurar que la app no siga ejecutándose sin DB.
  }
};

export default connectDB;