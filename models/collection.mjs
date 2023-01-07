import mongoose from "mongoose";
import mongooseSlugPlugin from "mongoose-slug-plugin";

const collectionSchema = new mongoose.Schema({
  name: { type: String, default: "Untilted" },
  description: String,
  allProducts: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  // last updated
});

collectionSchema.plugin(mongooseSlugPlugin, {
  tmpl: "<%=name%>",
});

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
