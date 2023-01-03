import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  businessName: String,
  collections: [{ type: mongoose.Types.ObjectId, ref: "Collection" }],
  products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  password: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
