import bcrypt from "bcrypt";

export async function hashPassword(password) {
  let salt = await bcrypt.genSalt(10); // enter number of rounds, default: 10
  let hash = await bcrypt.hash(password, salt);
  return hash;
}

export function calculateStockStatus(curr, low) {
  let current = curr;
  let lower = low;

  if (isNaN(current)) {
    current = +current;
  }

  if (isNaN(low)) {
    lower = +low;
  }

  if (current <= 0) {
    return "Zero";
  }
  if (current > lower) {
    return "OK";
  } else {
    return "Low";
  }
}
