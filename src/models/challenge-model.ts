import { ObjectId } from "mongodb";
import { z } from "zod";

import { getDb } from "../config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "../utils/validators";

const challengeCollectionName = "challenges";

const challengeCollectionSchema = z.object({
  type: z.enum(["multiple-choice", "fill-in-blank"]),
  question: z.string().min(1).trim(),
  answer: z.string().min(1).trim(),
  explanation: z.string().min(1).trim(),
  category: z.string().min(1).trim(),
  era_id: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
  difficulty: z.enum(["easy", "medium", "hard"]),
  points: z.number().min(1).max(100).int().positive(),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
  // TODO: For future scaling, add "created_by", "updated_by"
});
