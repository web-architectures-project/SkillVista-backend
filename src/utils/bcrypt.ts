import * as bcrypt from 'bcrypt';

// Generate a salt value for password hashing with a cost factor of 10.
const salt = bcrypt.genSaltSync(10);

// Function to hash a raw password and return the hashed password.
export const encodePassword = (rawPassword: string) => {
  return bcrypt.hashSync(rawPassword, salt);
};

// Function to compare an entered password with a hashed password and return a boolean indicating a match.
export const decodePassword = (
  enteredPassword: string,
  hashedPassword: string,
) => {
  return bcrypt.compareSync(enteredPassword, hashedPassword);
};
