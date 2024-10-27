import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import ms from "ms";

import { env } from "../config/environment";
import jwtProvider from "../providers/jwt-provider";
import authenticationService from "../services/authentication-service";
import ApiError from "../utils/api-error";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const registedUser = await authenticationService.register(req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      registedUser,
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginedUser = await authenticationService.login(req.body);

    const userPayload = {
      id: loginedUser._id,
      email: loginedUser.email,
      role: loginedUser.role,
    };

    const accessToken = await jwtProvider.generateToken(
      userPayload,
      env.ACCESS_TOKEN_SECRET,
      "1h"
    );
    const refreshToken = await jwtProvider.generateToken(
      userPayload,
      env.REFRESH_TOKEN_SECRET,
      "7 days"
    );

    res.cookie("accessToken", accessToken, {
      maxAge: ms("7 days"),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: ms("7 days"),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      loginedUser,
    });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const sendVerificationMail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;

    const user = await authenticationService.sendVerificationMail(email);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Sent verification mail successfully to ${user.email}`,
    });
  } catch (error) {
    return next(error);
  }
};

const verifyOneUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;

    const verifiedUser = await authenticationService.verifyOneUserByEmail(
      email,
      req.body
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Verified user successfully at ${verifiedUser.emailVerified}`,
    });
  } catch (error) {
    return next(error);
  }
};

const sendPasswordResetMail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;

    const user = await authenticationService.sendPasswordResetMail(email);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Sent password reset mail successfully to ${user.email}`,
    });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authenticationService.resetPassword(req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Reset password successfully with user ${user.email}`,
    });
  } catch (error) {
    return next(error);
  }
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "No refresh token provided");
    }

    const decodedRefreshToken = await jwtProvider.verifyToken(
      refreshToken,
      env.REFRESH_TOKEN_SECRET
    );

    if (!decodedRefreshToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }

    const accessToken = await jwtProvider.generateToken(
      decodedRefreshToken,
      env.ACCESS_TOKEN_SECRET,
      "1h"
    );

    res.cookie("accessToken", accessToken, {
      maxAge: ms("1h"),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Refreshed access token",
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  register,
  login,
  logout,
  sendVerificationMail,
  verifyOneUserByEmail,
  sendPasswordResetMail,
  resetPassword,
  refreshToken,
};
