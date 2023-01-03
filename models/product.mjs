import mongoose from "mongoose";
import mongooseSlugPlugin from "mongoose-slug-plugin";

const productSchema = new mongoose.Schema({
  name: String,
  units: String,
  isArchived: { type: Boolean, default: false },
  isRetail: { type: Boolean, default: false },
  description: String,
  purchasePrice: Number,
  sellPrice: Number,
  currentQuantity: Number,
  lowStockQuantity: Number,
  isLowStock: { type: Boolean, default: false },
  collection: { type: mongoose.Types.ObjectId, ref: "Collection" },
  dateCreated: { type: Date, default: Date.now() },
  dateLastUpdated: { type: Date, default: Date.now() },
});

productSchema.plugin(mongooseSlugPlugin, {
  tmpl: "<%=name%>",
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
