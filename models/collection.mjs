import mongoose from "mongoose";
import mongooseSlugPlugin from "mongoose-slug-plugin";

const collectionSchema = new mongoose.Schema({
  name: String,
  description: String,
  contents: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
});

collectionSchema.plugin(mongooseSlugPlugin, {
  tmpl: "<%=name%>",
});

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
