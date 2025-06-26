import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    role: { type: String, enum: ["user", "hotelOwner"], default: "user" },
    recentSearchedCities: [{ type: String }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
<<<<<<< HEAD
=======

>>>>>>> parent of b6fe0c9 (Probando la conexion a MongoDB)
export default User;
