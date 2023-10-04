import { NextFunction, Response } from "express";
import { verifyToken, prisma } from "../../utility";
import { sendUnAuthorizedError } from "../../utility/AppError";
import { IAuthJWTRequest } from "src/interfaces";

const { users: Users } = prisma;

export const adminRole = async (req: IAuthJWTRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    let token: any;
    token = req.headers["Authorization"] || req.headers["authorization"];

    if (!token) return sendUnAuthorizedError(res);
    token = token.replace("Bearer ", "");

    const decoded_user = verifyToken(token);
    if (!decoded_user) return sendUnAuthorizedError(res);

    const user = await Users.findUnique({
      where: { id: decoded_user.user },
      select: { id: true, role: true }
    });

    if (!user || decoded_user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        msg: "Forbidden access to requested resources"
      });
    }

    req["user"] = user;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return sendUnAuthorizedError(res);
    } else {
      return next(err);
    }
  }
};
