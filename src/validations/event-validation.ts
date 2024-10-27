import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "../utils/validators";
import { handleValidationError } from "../utils/helpers";

const eventReqBodySchema = z
  .object({
    era_id: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
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

type EventReqBodySchema = z.infer<typeof eventReqBodySchema>;

const eventReqBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await eventReqBodySchema.parseAsync(req.body);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const eventReqUpdateBodySchema = z
  .object({
    era_id: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE).optional(),
    title: z.string().min(1).max(256).trim().optional(),
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
        public_id: z.string().trim().default(""),
        url: z.string().trim().default(""),
      })
      .optional(),
  })
  .strict();

type EventReqUpdateBodySchema = z.infer<typeof eventReqUpdateBodySchema>;

const eventReqUpdateBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await eventReqIdParamSchema.parseAsync(req.params);
    await eventReqUpdateBodySchema.parseAsync(req.body);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const eventReqEraIdQuerySchema = z
  .object({
    eraId: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
  })
  .strict();

const eventReqEraIdQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await eventReqEraIdQuerySchema.parseAsync(req.query);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const eventReqIdParamSchema = z
  .object({
    id: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
  })
  .strict();

const eventReqIdParam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await eventReqIdParamSchema.parseAsync(req.params);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const eventReqSlugParamSchema = z
  .object({
    slug: z.string().min(1).trim(),
  })
  .strict();

const eventReqSlugParam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await eventReqSlugParamSchema.parseAsync(req.params);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

export default {
  eventReqBody,
  eventReqUpdateBody,
  eventReqEraIdQuery,
  eventReqIdParam,
  eventReqSlugParam,
};

export type { EventReqBodySchema, EventReqUpdateBodySchema };
