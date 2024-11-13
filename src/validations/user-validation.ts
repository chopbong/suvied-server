import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { handleValidationError } from "../utils/helpers";

const userReqUpdateBodySchema = z
  .object({
    name: z.string().min(1).max(64).trim().optional(),
    avatar: z
      .object({
        public_id: z.string().trim().default(""),
        url: z.string().trim().default(""),
      })
      .optional(),
    role: z.enum(["user", "admin"]).optional(),
    points: z.number().optional(),
    is_banned: z.boolean().optional(),
  })
  .strict();

type UserReqUpdateBodySchema = z.infer<typeof userReqUpdateBodySchema>;

const userReqUpdateBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await userReqUpdateBodySchema.parseAsync(req.body);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const userReqEmailParamSchema = z
  .object({
    email: z.string().email().min(1).trim(),
  })
  .strict();

const userReqEmailParam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await userReqEmailParamSchema.parseAsync(req.params);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

export default {
  userReqUpdateBody,
  userReqEmailParam,
};

export type { UserReqUpdateBodySchema };
