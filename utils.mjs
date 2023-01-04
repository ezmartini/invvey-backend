import bcrypt from "bcrypt";

export async function hashPassword(password) {
  let salt = await bcrypt.genSalt(10); // enter number of rounds, default: 10
  let hash = await bcrypt.hash(password, salt);
  return hash;
}
