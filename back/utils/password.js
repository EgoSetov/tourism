import bcrypt from "bcrypt";

const generatePassword = async (password) => {
  let saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const comparePasswords = (password, dbPassword) => {
  return bcrypt.compareSync(password, dbPassword);
};

export { generatePassword, comparePasswords };
