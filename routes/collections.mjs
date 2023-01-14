import express from "express";
import Collection from "../models/collection.mjs";
import passport from "passport";
import Product from "../models/product.mjs";
import User from "../models/user.mjs";
import { model } from "mongoose";

const router = express.Router();

router.get("/", passport.authenticate("jwt"), async function (req, res) {
  const query = req.query;
  let opts = {};

  console.log(query);

  async function populateCollections(opts) {
    await req.user.populate({
      path: "collections",
      populate: {
        path: "allProducts",
        model: "Product",
      },
      options: opts,
    });
  }

  if (req.query.filter) {
    if (req.query.filter === "noDesc") {
      await populateCollections();
      const found = req.user.collections.filter((collection) => {
        return !collection.description;
      });

      return res.status(200).json({ collections: found });
    } else if (req.query.filter === "yesDesc") {
      await populateCollections();
      const found = req.user.collections.filter((collection) => {
        return collection.description;
      });

      return res.status(200).json({ collections: found });
    }
  }

  if (req.query.search) {
    await populateCollections();
    const found = req.user.collections.filter((collection) =>
      collection.name.toLowerCase().includes(req.query.search.toLowerCase())
    );
    return res.status(200).json({ collections: found });
  }

  if (req.query.sort) {
    if (req.query.sort === "alphaAtoZ") {
      opts = { sort: { name: 1 } };
    }

    if (req.query.sort === "alphaZtoA") {
      opts = { sort: { name: -1 } };
    }

    await populateCollections(opts);
    return res.status(200).json({ collections: req.user.collections });
  }

  await populateCollections();
  return res.status(200).json({ collections: req.user.collections });
});

export default router;
