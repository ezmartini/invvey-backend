import mongoose from "mongoose";
import { hashPassword } from "../utils.mjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  businessName: { type: String, required: true },
  collections: [{ type: mongoose.Types.ObjectId, ref: "Collection" }],
  products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
