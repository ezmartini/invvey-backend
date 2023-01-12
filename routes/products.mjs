import express from "express";
import passport from "passport";
import Collection from "../models/collection.mjs";
const router = express.Router();

router.get("/all", passport.authenticate("jwt"), async function (req, res) {
  await req.user.populate({
    path: "products",
    populate: {
      path: "collectionName",
      model: "Collection",
    },
    options: { sort: { dateCreated: -1 } },
  });

  if (req.user.populated("products")) {
    return res.status(200).json({ products: req.user.products });
  } else {
    return res.status(500).json({ message: "Internal server error " });
  }
});

export default router;
