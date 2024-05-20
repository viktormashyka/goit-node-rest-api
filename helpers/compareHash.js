import bcrypt from "bcrypt";

export const compareHash = (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);
