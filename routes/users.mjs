import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";

import Users from "../models/user.mjs";

const router = express.Router();

router.post("/register", (req, res) => {});

router.login("/login", (req, res) => {});

export default router;
