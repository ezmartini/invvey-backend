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

router.get("/", passport.authenticate("jwt"), async function (req, res) {
  // would have used mongo db find for Products, but this is faster,
  // and less mongoDB calls

  console.log(req.query);

  let products = req.user.products;

  async function populateUser(opts) {
    await req.user.populate({
      path: "products",
      populate: {
        path: "collectionName",
        model: "Collection",
      },
      options: opts,
    });
  }

  async function populateCollection(opts) {
    const relevant = await Collection.findOne({ _id: req.query.collection });
    await relevant.populate({
      path: "allProducts",
      model: "Product",
      options: opts,
    });

    products = relevant.allProducts;
  }

  if (req.query.collection) {
    await populateCollection();
  }

  if (req.query.search) {
    const found = products.filter((product) =>
      product.name.toLowerCase().includes(req.query.search.toLowerCase())
    );
    return res.status(200).json({ products: found });
  }

  if (req.query.filter) {
    await populateUser();
    if (req.query.filter !== "0") {
      const found = products.filter(
        (product) => product.stockStatus === req.query.filter
      );
      return res.status(200).json({ products: found });
    }
  }

  if (req.query.sort) {
    const sortBy = req.query.sort;
    let options;

    // more clever way to do this using params!!
    if (sortBy === "mostRecent") {
      options = { sort: { dateLastUpdated: -1 } };
    } else if (sortBy === "leastRecent") {
      options = { sort: { dateLastUpdated: 1 } };
    } else if (sortBy === "stockHtoL") {
      options = { sort: { currentQuantity: -1 } };
    } else if (sortBy === "stockLtoH") {
      options = { sort: { currentQuantity: 1 } };
    } else if (sortBy === "alphaAtoZ") {
      options = { sort: { name: 1 } };
    } else if (sortBy === "alphaZtoA") {
      options = { sort: { name: -1 } };
    }

    if (!req.query.collection) {
      await populateUser(options);
    } else {
      await populateCollection(options);
    }
    return res.status(200).json({ products });
  }
});

export default router;
