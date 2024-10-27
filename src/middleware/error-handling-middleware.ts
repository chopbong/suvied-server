import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/environment";
import ApiError from "../utils/api-error";

export const errorHandlingMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err.statusCode) {
    err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  const errorResponse = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    stack: err.stack,
  };

  if (env.BUILD_MODE !== "dev") {
    delete errorResponse.stack;
  }

  return res.status(err.statusCode).json(errorResponse);
};
