import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { env } from "../config/environment";
import jwtProvider from "../providers/jwt-provider";

const isAutheticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Please login to access this resource",
    });
  }

  try {
    const decodedAccessToken = await jwtProvider.verifyToken(
      accessToken,
      env.ACCESS_TOKEN_SECRET
    );

    req.jwtDecoded = Object(decodedAccessToken);

    next();
  } catch (error) {
    // * CASE 1: accessToken is expired
    if (error.message?.includes("jwt expired")) {
      return res.status(StatusCodes.GONE).json({
        success: false,
        message: "Access token expired",
      });
    }

    // * CASE 2: accessToken is invalid
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid access token",
    });
  }
};

const isAuthorized = (...acepptedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.jwtDecoded) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid JWT payload",
      });
    }

    if (!acepptedRoles.includes(req.jwtDecoded.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: `You're not authorized to access this resource with role: ${req.jwtDecoded.role}`,
      });
    }

    next();
  };
};

export default { isAutheticated, isAuthorized };
