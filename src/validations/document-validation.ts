import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "../utils/validators";
import { handleValidationError } from "../utils/helpers";

const documentReqBodySchema = z
  .object({
    era_id: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
    title: z.string().min(1).max(256).trim(),
    slug: z.string().min(1).trim(),
    content: z.string().trim(),
    // TODO: For future scaling
    // created_by: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
    // updated_by: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
  })
  .strict();

type DocumentReqBodySchema = z.infer<typeof documentReqBodySchema>;

const documentReqBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await documentReqBodySchema.parseAsync(req.body);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const documentReqUpdateBodySchema = z
  .object({
    era_id: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE).optional(),
    title: z.string().min(1).max(256).trim().optional(),
    slug: z.string().min(1).trim().optional(),
    content: z.string().trim().optional(),
    status: z.enum(["draft", "completed", "published"]).optional(),
    // TODO: For future scaling
    // updated_by: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
  })
  .strict();

type DocumentReqUpdateBodySchema = z.infer<typeof documentReqUpdateBodySchema>;

const documentReqUpdateBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await documentReqIdParamSchema.parseAsync(req.params);
    await documentReqUpdateBodySchema.parseAsync(req.body);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const documentReqEraSlugQuerySchema = z
  .object({
    era: z.string().min(1),
  })
  .strict();

const documentReqEraSlugQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await documentReqEraSlugQuerySchema.parseAsync(req.query);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const documentReqIdParamSchema = z
  .object({
    id: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
  })
  .strict();

const documentReqIdParam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await documentReqIdParamSchema.parseAsync(req.params);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const documentReqSlugParamSchema = z
  .object({ slug: z.string().min(1).trim() })
  .strict();

const documentReqSlugParam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await documentReqSlugParamSchema.parseAsync(req.params);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

export default {
  documentReqBody,
  documentReqUpdateBody,
  documentReqEraSlugQuery,
  documentReqIdParam,
  documentReqSlugParam,
};

export type { DocumentReqBodySchema, DocumentReqUpdateBodySchema };
