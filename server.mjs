import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongodb from "mongodb";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";

import UsersRoute from "./routes/users.mjs";

import ProductsRoute from "./routes/products.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const uri = process.env.DB_CNXN;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use("/api/users", UsersRoute);
app.use("/api/products", ProductsRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
