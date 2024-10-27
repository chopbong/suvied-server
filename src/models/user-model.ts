import { ObjectId } from "mongodb";
import { z } from "zod";

import { getDb } from "../config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "../utils/validators";

// Define collection (Name & Schema)
const userCollectionName = "users";

const userCollectionSchema = z
  .object({
    name: z.string().min(1).max(64).trim(),
    email: z.string().email().trim(),
    password: z.string().min(6).max(64).trim().optional(),
    avatar: z
      .object({
        public_id: z.string().trim().default(""),
        url: z.string().trim().default(""),
      })
      .default({
        public_id: "",
        url: "",
      }),
    role: z.enum(["user", "admin"]).default("user"),
    points: z.number().default(0),
    email_verified: z.coerce.date().nullable().default(null),
    is_banned: z.boolean().default(false),
    created_at: z.coerce.date().default(new Date()),
    updated_at: z.coerce.date().default(new Date()),
  })
  .strict();

const userCollectionReadOnlyField = ["_id", "email", "createdAt"];

const validateData = async (data: z.infer<typeof userCollectionSchema>) => {
  return await userCollectionSchema.parseAsync(data);
};

const createOneUser = async (data: z.infer<typeof userCollectionSchema>) => {
  try {
    const validData = await validateData(data);

    const createResult = await getDb()
      .collection(userCollectionName)
      .insertOne(validData);

    return createResult;
  } catch (error) {
    throw new Error(error);
  }
};

const getOneUserById = async (id: ObjectId | string) => {
  try {
    if (typeof id === "string" && !OBJECT_ID_RULE.test(id)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    const user = await getDb()
      .collection(userCollectionName)
      .findOne({ _id: new ObjectId(id) });

    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const getOneUserByEmail = async (email: string) => {
  try {
    const user = await getDb()
      .collection(userCollectionName)
      .findOne({ email });

    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const updateOneUserById = async (
  userId: ObjectId | string,
  updateData: any
) => {
  try {
    if (typeof userId === "string" && !OBJECT_ID_RULE.test(userId)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    Object.keys(updateData).map((field) => {
      if (userCollectionReadOnlyField.includes(field)) {
        delete updateData[field];
      }
    });

    const updatedUser = await getDb()
      .collection(userCollectionName)
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    return updatedUser;
  } catch (error) {
    throw new Error(error);
  }
};

// const updateOneUserPasswordById = async (
//   id: ObjectId | string,
//   newPassword: string
// ) => {
//   try {
//     if (typeof id === "string" && !OBJECT_ID_RULE.test(id)) {
//       throw new Error(OBJECT_ID_RULE_MESSAGE);
//     }

//     const updatedUser = await getDb()
//       .collection(userCollectionName)
//       .findOneAndUpdate(
//         {
//           _id: new ObjectId(id),
//         },
//         { $set: { password: newPassword } },
//         { returnDocument: "after" }
//       );

//     return updatedUser;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

export default {
  userCollectionName,
  userCollectionSchema,
  createOneUser,
  getOneUserById,
  getOneUserByEmail,
  updateOneUserById,
  // updateOneUserPasswordById,
};
