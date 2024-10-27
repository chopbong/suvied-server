import { ObjectId } from "mongodb";
import { z } from "zod";
import ms from "ms";

import { getDb } from "../config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "../utils/validators";

// Define collection (Name & Schema)
const verificationCollectionName = "verifications";

const verificationCollectionSchema = z
  .object({
    token: z.string().trim(),
    user_id: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
    created_at: z.coerce.date().default(new Date()),
    expires_at: z.coerce.date().default(new Date(Date.now() + ms("30mins"))),
  })
  .strict();

const validateData = async (
  data: z.infer<typeof verificationCollectionSchema>
) => {
  return await verificationCollectionSchema.parseAsync(data);
};

const createOneVerification = async (
  data: z.infer<typeof verificationCollectionSchema>
) => {
  try {
    const validData = await validateData(data);

    const createResult = await getDb()
      .collection(verificationCollectionName)
      .insertOne({ ...validData, user_id: new ObjectId(validData.user_id) }); // Convert type of user_id to ObjectId

    return createResult;
  } catch (error) {
    throw new Error(error);
  }
};

const getOneVerificationByUserId = async (userId: ObjectId | string) => {
  try {
    if (typeof userId === "string" && !OBJECT_ID_RULE.test(userId)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    const verification = (
      await getDb()
        .collection(verificationCollectionName)
        .find({ user_id: new ObjectId(userId) })
        .sort({ expiresAt: -1 })
        .limit(1)
        .toArray()
    )[0];

    return verification;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteManyVerificationsByUserId = async (userId: ObjectId | string) => {
  try {
    if (typeof userId === "string" && !OBJECT_ID_RULE.test(userId)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    const deleteResult = await getDb()
      .collection(verificationCollectionName)
      .deleteMany({ user_id: new ObjectId(userId) });

    return deleteResult;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  createOneVerification,
  getOneVerificationByUserId,
  deleteManyVerificationsByUserId,
};
