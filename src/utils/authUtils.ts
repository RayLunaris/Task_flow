import bcrypt from 'bcryptjs';

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

export const verifyPassword = (password: string, hashed: string): boolean => {
  return bcrypt.compareSync(password, hashed);
};
