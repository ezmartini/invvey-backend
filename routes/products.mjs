import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/all", passport.authenticate("jwt"), function (req, res) {});

export default router;
