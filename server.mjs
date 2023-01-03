import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongodb from "mongodb";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";

import UsersRoute from "./routes/users.mjs";

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

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", UsersRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
