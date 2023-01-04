import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import Users from "../models/user.mjs";
import User from "../models/user.mjs";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// local strategies

passport.use(
  "local-register",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, username, password, done) {
      Users.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, { message: "Username already exists!" });
        } else {
          const newUser = new User({
            username: username,
            password: password,
            businessName: req.body.businessName,
          });
          newUser.save(function (err) {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
    }
  )
);

router.post(
  "/register",
  passport.authenticate("local-register"),
  function (req, res) {
    // on successful register
  }
);

export default router;
