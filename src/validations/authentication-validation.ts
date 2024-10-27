import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { handleValidationError } from "../utils/helpers";

const registerReqBodySchema = z
  .object({
    name: z.string().min(1).max(64).trim(),
    email: z.string().email().trim(),
    password: z.string().min(8).max(64).trim().optional(),
  })
  .strict();

type RegisterReqBodySchema = z.infer<typeof registerReqBodySchema>;

const registerReqBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await registerReqBodySchema.parseAsync(req.body);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const loginReqBodySchema = z
  .object({
    email: z.string().email().trim(),
    password: z.string().trim(),
  })
  .strict();

type LoginReqBodySchema = z.infer<typeof loginReqBodySchema>;

const loginReqBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await loginReqBodySchema.parseAsync(req.body);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const verifyReqBodySchema = z
  .object({
    verificationCode: z.string().min(6).max(6).trim(),
  })
  .strict();

type VerifyReqBodySchema = z.infer<typeof verifyReqBodySchema>;

const verifyReqBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authReqEmailParamSchema.parseAsync(req.params);
    await verifyReqBodySchema.parseAsync(req.body);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const resetReqBodySchema = z
  .object({
    token: z.string().trim(),
    newPassword: z.string().min(8).max(64).trim(),
  })
  .strict();

type ResetReqBodySchema = z.infer<typeof resetReqBodySchema>;

const resetReqBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await resetReqBodySchema.parseAsync(req.body);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const authReqEmailParamSchema = z
  .object({
    email: z.string().email().min(1).trim(),
  })
  .strict();

const authReqEmailParam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authReqEmailParamSchema.parseAsync(req.params);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

export default {
  registerReqBody,
  loginReqBody,
  verifyReqBody,
  resetReqBody,
  authReqEmailParam,
};

export type {
  RegisterReqBodySchema,
  LoginReqBodySchema,
  VerifyReqBodySchema,
  ResetReqBodySchema,
};
