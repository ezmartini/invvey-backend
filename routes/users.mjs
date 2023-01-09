import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import Users from "../models/user.mjs";
import User from "../models/user.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();

import { Strategy as LocalStrategy } from "passport-local";

const router = express.Router();

router.post("/register", function (req, res) {
  Users.findOne({ username: req.body.username }, function (err, user) {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
    if (user) {
      return res
        .status(409)
        .json({ success: false, message: "Username already exists." });
    } else {
      const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        businessName: req.body.businessName,
      });
      newUser.save(function (err) {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Server error" });
        } else {
          req.logIn(newUser, function (err) {
            if (err) {
              return res
                .status(500)
                .json({ success: false, message: "Server error" });
            } else {
              return res.status(200).json({ success: true });
            }
          });
        }
      });
    }
  });
});

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },

    function (req, username, password, done) {
      Users.findOne({ username: username }, async function (err, user) {
        if (!user) {
          return done(err);
        }

        if (err) {
          return done(null, false, {
            message: "Couldn't find the account with the requested username.",
          });
        } else {
          const isPassword = await bcrypt.compare(password, user.password);
          if (!isPassword) {
            return done(null, false, { message: "Incorrect password." });
          } else {
            return done(null, user);
          }
        }
      });
    }
  )
);

router.post(
  "/login",
  passport.authenticate("local-login", { session: false }),
  function (req, res) {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
    return res.status(200).json({ success: true, token: token });
  }
);
export default router;
