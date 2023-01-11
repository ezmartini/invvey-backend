import bcrypt from "bcrypt";

export async function hashPassword(password) {
  let salt = await bcrypt.genSalt(10); // enter number of rounds, default: 10
  let hash = await bcrypt.hash(password, salt);
  return hash;
}

export function calculateStockStatus(curr, low) {
  if (curr <= 0) {
    return "Zero";
  }
  if (curr > low) {
    return "OK";
  } else {
    return "Low";
  }
}
