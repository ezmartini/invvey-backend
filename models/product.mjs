import mongoose from "mongoose";
import mongooseSlugPlugin from "mongoose-slug-plugin";

const productSchema = new mongoose.Schema({
  createdBy: String,
  name: String,
  units: String,
  isArchived: { type: Boolean, default: false },
  description: { type: String, default: "No description provided." },
  purchasePrice: String,
  currentQuantity: Number,
  lowStockQuantity: Number,
  stockStatus: String,
  collection: { type: mongoose.Types.ObjectId, ref: "Collection" },
  dateCreated: { type: Date, default: Date.now() },
  dateLastUpdated: { type: Date, default: Date.now() },
});

productSchema.plugin(mongooseSlugPlugin, {
  tmpl: "<%=name%>",
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
