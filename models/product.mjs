import mongoose from "mongoose";
import mongooseSlugPlugin from "mongoose-slug-plugin";
import { calculateStockStatus } from "../utils.mjs";

const productSchema = new mongoose.Schema({
  name: String,
  createdBy: String,
  isArchived: { type: Boolean, default: false },
  description: { type: String, default: "No description provided." },
  currentQuantity: Number,
  lowStockQuantity: Number,
  stockStatus: String,
  idealQuantity: Number,
  collectionName: {
    type: mongoose.Types.ObjectId,
    ref: "Collection",
  },
  dateCreated: { type: Date, default: Date.now() },
  dateLastUpdated: { type: Date, default: Date.now() },
});

productSchema.plugin(mongooseSlugPlugin, {
  tmpl: "<%=name%>",
});

productSchema.pre("findOneAndUpdate", async function () {
  const newStock = this.getUpdate()["$set"].currentQuantity;
  const lowStock = this.getUpdate()["$set"].lowStockQuantity;

  const filters = this.getFilter("_id");
  const doc = await Product.findOne({ _id: filters });

  if (newStock) {
    this.set({
      stockStatus: calculateStockStatus(newStock, doc.lowStockQuantity),
    });
  } else if (lowStock) {
    this.set({
      stockStatus: calculateStockStatus(doc.currentQuantity, lowStock),
    });
  }
  this.set({ dateLastUpdated: new Date() });
});
const Product = mongoose.model("Product", productSchema);

export default Product;
