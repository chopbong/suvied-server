import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "../utils/validators";
import { handleValidationError } from "../utils/helpers";

const multipleChoiceReqBodySchema = z
  .object({
    question: z.string().min(1).trim(),
    options: z
      .array(
        z.object({
          text: z.string().min(1).trim(),
          is_correct: z.boolean(),
        })
      )
      .min(1),
    explanation: z.string().min(1).trim(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    points: z.number().min(1).max(100).int().positive(),
    // TODO: For future scaling, add "created_by", "updated_by"
  })
  .strict();

type MultipleChoiceReqBodySchema = z.infer<typeof multipleChoiceReqBodySchema>;

const multipleChoiceReqBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await multipleChoiceReqBodySchema.parseAsync(req.body);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const multipleChoiceReqUpdateBodySchema = z
  .object({
    question: z.string().min(1).trim().optional(),
    options: z
      .array(
        z.object({
          option_id: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
          text: z.string().min(1).trim().optional(),
          is_correct: z.boolean().optional(),
        })
      )
      .min(1)
      .optional(),
    explanation: z.string().min(1).trim().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    points: z.number().min(1).max(100).int().positive().optional(),
    // TODO: For future scaling, add "created_by", "updated_by"
  })
  .strict();

type MultipleChoiceReqUpdateBodySchema = z.infer<
  typeof multipleChoiceReqUpdateBodySchema
>;

const multipleChoiceReqUpdateBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await multipleChoiceReqUpdateBodySchema.parseAsync(req.body);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const multipleChoiceReqIdParamSchema = z
  .object({
    id: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
  })
  .strict();

const multipleChoiceReqIdParam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await multipleChoiceReqIdParamSchema.parseAsync(req.params);

    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

export default {
  multipleChoiceReqBody,
  multipleChoiceReqUpdateBody,
  multipleChoiceReqIdParam,
};

export type { MultipleChoiceReqBodySchema, MultipleChoiceReqUpdateBodySchema };
