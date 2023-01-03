import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  businessName: { type: String, required: true },
  collections: [{ type: mongoose.Types.ObjectId, ref: "Collection" }],
  products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
