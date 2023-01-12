import express from "express";
import Collection from "../models/collection.mjs";
import passport from "passport";
import Product from "../models/product.mjs";
import User from "../models/user.mjs";
const router = express.Router();

router.post("/", passport.authenticate("jwt"), function (req, res) {
  const allProducts = [];

  const newCollection = new Collection({
    name: req.body.collectionName,
    description: req.body.collectionDesc,
    allProducts,
  });

  newCollection.save(async function (err, doc) {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false });
    } else {
      // find another way
      const newUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { collections: newCollection } }
      );
    }

    res.status(200).json({ success: true, newCollection });
  });
});

router.get("/:slug", passport.authenticate("jwt"), async function (req, res) {
  if (!req.params.slug) {
    return res.status(404).json({ message: "Page not found." });
  }

  const UserCollections = await req.user.populate({
    path: "collections",
    populate: {
      path: "allProducts",
      model: "Product",
    },
  });

  const foundCollection = req.user.collections.filter(
    (collection) => collection.slug === req.params.slug
  );

  if (foundCollection.length < 1) {
    return res.status(404).json({ message: "Page not found." });
  }

  return res.status(200).json({ collection: foundCollection[0] });
});

export default router;
