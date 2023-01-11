import express from "express";
import Collection from "../models/collection.mjs";
import passport from "passport";
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

export default router;
