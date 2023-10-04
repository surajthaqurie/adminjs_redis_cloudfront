import bcrypt from "bcrypt";

export const generateSalt = (): Promise<string> => {
  try {
    return bcrypt.genSalt(10);
  } catch (error) {
    throw error;
  }
};

export const generateHashPassword = (plainPassword: string, salt: string): Promise<string> => {
  try {
    return bcrypt.hash(plainPassword, salt);
  } catch (error) {
    throw error;
  }
};

export const verifyPassword = (plainPassword: string, hashPassword: string): Promise<boolean> => {
  try {
    return bcrypt.compare(plainPassword, hashPassword);
  } catch (error) {
    throw error;
  }
};
