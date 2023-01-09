import passport from "passport";
import { Strategy as JWTStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import User from "./models/user.mjs";

import dotenv from "dotenv";
dotenv.config();

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          return done(err, false, {
            message: "Token not matched.",
          });
        });
    }
  )
);
export default jwtStrat;
