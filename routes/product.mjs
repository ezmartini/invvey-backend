import express from "express";
import passport from "passport";
import Product from "../models/product.mjs";
import User from "../models/user.mjs";
import { ObjectId } from "mongodb";
import { calculateStockStatus } from "../utils.mjs";
import Collection from "../models/collection.mjs";
const router = express.Router();

router.post("/", passport.authenticate("jwt"), function (req, res) {
  console.log(req.body);
  const stockStatus = calculateStockStatus(
    req.body.currentStock,
    req.body.lowStock
  );

  console.log(stockStatus);

  const inSavedCollection = ObjectId.isValid(req.body.inCollection);

  const newProduct = new Product({
    name: req.body.productName,
    description:
      req.body.description === ""
        ? "No description provided."
        : req.body.description,
    currentQuantity: req.body.currentStock,
    lowStockQuantity: req.body.lowStock,
    idealQuantity: req.body.idealStock,
    stockStatus,
    collectionName: inSavedCollection ? req.body.inCollection : undefined,
  });

  newProduct.save(async function (err, doc) {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false });
    } else {
      //not the best - find a smarter way
      const newUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { products: newProduct } }
      );

      if (inSavedCollection) {
        const addToCollection = await Collection.findOneAndUpdate(
          { _id: req.body.inCollection },
          { $push: { allProducts: newProduct } }
        );
      }
    }

    res.status(200).json({ success: true, newProduct });
  });
});

router.get("/:slug", passport.authenticate("jwt"), async function (req, res) {
  if (!req.params.slug) {
    return res.status(404).json({ message: "Page not found." });
  }

  // check if user has access to product
  const userProducts = await req.user.populate("products");
  for (const userProduct of req.user.products) {
    if (userProduct.slug === req.params.slug) {
      return res.status(200).json({ product: userProduct });
    }
  }
  return res.status(500).json({ message: "Request cannot be fulfilled." });
});

export default router;
