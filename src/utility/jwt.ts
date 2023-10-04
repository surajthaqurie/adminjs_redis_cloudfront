import jwt from "jsonwebtoken";
import { IUser } from "src/interfaces";

const generateJWTToken = (userInfo: IUser): string => {
  try {
    return jwt.sign(
      {
        user: userInfo.id,
        role: userInfo.role
      },
      process.env.JWT_SECRET as string,
      {
        algorithm: "HS256",
        issuer: process.env.APP_URL as string,
        expiresIn: process.env.JWT_EXPIRES as string
      }
    );
  } catch (error) {
    throw error;
  }
};

const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    throw error;
  }
};

const decodeJWTToken = (token: string): any => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw error;
  }
};

export { generateJWTToken, decodeJWTToken, verifyToken };
