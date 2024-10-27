import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import userService from "../services/user-service";

const getOneUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;

    const user = await userService.getOneUserByEmail(email);

    return res.status(StatusCodes.OK).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(error);
  }
};

export default { getOneUserByEmail };
