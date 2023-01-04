import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

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
  "/register",
  passport.authenticate("local-register"),
  function (req, res) {
    // on successful register
  }
);

router.post(
  "/login",
  passport.authenticate("local-login"),
  function (req, res) {
    // on successful login
  }
);
export default router;
