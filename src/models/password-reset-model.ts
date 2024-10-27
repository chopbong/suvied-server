import { ObjectId } from "mongodb";
import { z } from "zod";
import ms from "ms";

import { getDb } from "../config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "../utils/validators";

// Define collection (Name & Schema)
const passwordResetCollectionName = "password-resets";

const passwordResetCollectionSchema = z
  .object({
    token: z.string().trim(),
    user_id: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
    created_at: z.coerce.date().default(new Date()),
    expires_at: z.coerce.date().default(new Date(Date.now() + ms("10mins"))),
  })
  .strict();

const validateData = async (
  data: z.infer<typeof passwordResetCollectionSchema>
) => {
  return await passwordResetCollectionSchema.parseAsync(data);
};

const createOnePasswordReset = async (
  data: z.infer<typeof passwordResetCollectionSchema>
) => {
  try {
    const validData = await validateData(data);

    const createResult = await getDb()
      .collection(passwordResetCollectionName)
      .insertOne({ ...validData, user_id: new ObjectId(validData.user_id) }); // Convert type of user_id to ObjectId

    return createResult;
  } catch (error) {
    throw new Error(error);
  }
};

const getOnePasswordResetByToken = async (token: string) => {
  try {
    const passwordReset = await getDb()
      .collection(passwordResetCollectionName)
      .findOne({ token });

    return passwordReset;
  } catch (error) {
    throw new Error(error);
  }
};

const getOnePasswordResetByUserId = async (userId: ObjectId | string) => {
  try {
    if (typeof userId === "string" && !OBJECT_ID_RULE.test(userId)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    const passwordReset = (
      await getDb()
        .collection(passwordResetCollectionName)
        .find({ user_id: new ObjectId(userId) })
        .sort({ expiresAt: -1 })
        .limit(1)
        .toArray()
    )[0];

    return passwordReset;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteManyPasswordResetsByUserId = async (userId: ObjectId | string) => {
  try {
    if (typeof userId === "string" && !OBJECT_ID_RULE.test(userId)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    const deleteResult = await getDb()
      .collection(passwordResetCollectionName)
      .deleteMany({ user_id: new ObjectId(userId) });

    return deleteResult;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  createOnePasswordReset,
  getOnePasswordResetByToken,
  getOnePasswordResetByUserId,
  deleteManyPasswordResetsByUserId,
};
