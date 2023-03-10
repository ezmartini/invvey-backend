import mongoose from "mongoose";
import mongooseSlugPlugin from "mongoose-slug-plugin";

const collectionSchema = new mongoose.Schema({
  name: { type: String, default: "Untitled" },
  description: String,
  allProducts: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  // last updated
});

collectionSchema.plugin(mongooseSlugPlugin, {
  tmpl: "<%=name%>",
});

const Collection = mongoose.model("Collection", collectionSchema);

export default Collection;
