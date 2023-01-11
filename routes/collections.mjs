import express from "express";
import Collection from "../models/collection.mjs";
import passport from "passport";
import User from "../models/user.mjs";

const router = express.Router();

router.get("/", passport.authenticate("jwt"), async function (req, res) {
  await req.user.populate({
    path: "collections",
    options: { sort: { dateCreated: -1 } },
  });

  if (req.user.populated("collections")) {
    return res.status(200).json({ collections: req.user.collections });
  } else {
    return res.status(500).json({ message: "Internal server error " });
  }
});

export default router;
