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

const updateOneUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;

    const updatedUser = await userService.updateOneUserByEmail(email, req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      updatedUser,
    });
  } catch (error) {
    return next(error);
  }
};

export default { getOneUserByEmail, updateOneUserByEmail };
