import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    role: { type: String, enum: ["user", "hotelOwner"], default: "user" },
    // MODIFICADO: Añadido un valor por defecto para recentSearchedCities
    // para que no sea estrictamente requerido en la creación si no se proporciona,
    // y para asegurar que es un array.
    recentSearchedCities: {
      type: [{ type: String }],
      default: [], // Valor por defecto: un array vacío
      required: false, // Ya no es estrictamente requerido si tiene un default
    },
  },
  {
    timestamps: true,
    // OPCIONAL: Si estás absolutamente seguro de que quieres que la colección se llame
    // 'Hotel.users' (donde 'Hotel' es parte del nombre de la colección, no solo la DB),
    // puedes añadir esto. Pero lo estándar es que Mongoose lo ponga en 'users'
    // dentro de la DB 'Hotel'. Si no añades 'collection', Mongoose usará 'users'.
    // collection: 'users' // Esto aseguraría el nombre 'users'
  }
);

const User = mongoose.model("User", userSchema);

export default User;

