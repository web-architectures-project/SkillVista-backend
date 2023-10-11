import * as bcrypt from 'bcrypt';

const salt = bcrypt.genSaltSync(10);
export const encodePassword = (rawPassword: string) => {
  return bcrypt.hashSync(rawPassword, salt);
};

export const decodePassword = (
  enteredPassword: string,
  hashedPassword: string,
) => {
  return bcrypt.compareSync(enteredPassword, hashedPassword);
};
