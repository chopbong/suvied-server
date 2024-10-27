import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "../utils/validators";
import { handleValidationError } from "../utils/helpers";

const eraReqBodySchema = z
  .object({
    name: z.string().min(1).max(256).trim(),
    slug: z.string().min(1).trim(),
    start_date: z.object({
      year: z.number().int().max(new Date().getFullYear()),
      month: z.number().int().min(1).max(12).optional(),
      day: z.number().int().min(1).max(31).optional(),
    }),
    end_date: z
      .object({
        year: z.number().int().max(new Date().getFullYear()),
        month: z.number().int().min(1).max(12).optional(),
        day: z.number().int().min(1).max(31).optional(),
      })
      .optional(),
    description: z.string().min(1).max(1000).trim(),
    thumbnail: z
      .object({
        public_id: z.string().trim().default(""),
        url: z.string().trim().default(""),
      })
      .default({
        public_id: "",
        url: "",
      }),
  })
  .strict();

type EraReqBodySchema = z.infer<typeof eraReqBodySchema>;

const eraReqBody = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await eraReqBodySchema.parseAsync(req.body);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const eraReqUpdateBodySchema = z
  .object({
    name: z.string().min(1).max(256).trim().optional(),
    slug: z.string().min(1).trim().optional(),
    start_date: z
      .object({
        year: z.number().int().max(new Date().getFullYear()),
        month: z.number().int().min(1).max(12).optional(),
        day: z.number().int().min(1).max(31).optional(),
      })
      .optional(),
    end_date: z
      .object({
        year: z.number().int().max(new Date().getFullYear()),
        month: z.number().int().min(1).max(12).optional(),
        day: z.number().int().min(1).max(31).optional(),
      })
      .optional(),
    description: z.string().min(1).max(1000).trim().optional(),
    thumbnail: z
      .object({
        public_id: z.string().trim().optional(),
        url: z.string().trim().optional(),
      })
      .optional(),
    status: z.enum(["draft", "completed", "published"]).optional(),
  })
  .strict();

type EraReqUpdateBodySchema = z.infer<typeof eraReqUpdateBodySchema>;

const eraReqUpdateBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await eraReqIdParamSchema.parseAsync(req.params);
    await eraReqUpdateBodySchema.parseAsync(req.body);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const eraReqIdParamSchema = z
  .object({
    id: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
  })
  .strict();

const eraReqIdParam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await eraReqIdParamSchema.parseAsync(req.params);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const eraReqSlugParamSchema = z
  .object({ slug: z.string().min(1).trim() })
  .strict();

const eraReqSlugParam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await eraReqSlugParamSchema.parseAsync(req.params);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

export default {
  eraReqBody,
  eraReqUpdateBody,
  eraReqIdParam,
  eraReqSlugParam,
};

export type { EraReqBodySchema, EraReqUpdateBodySchema };
