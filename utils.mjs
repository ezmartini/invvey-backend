import bcrypt from "bcrypt";

export async function hashPassword(password) {
  let salt = bcrypt.genSaltSync(10); // enter number of rounds, default: 10
  let hash = bcrypt.hashSync(password, salt);
  return hash;
}
