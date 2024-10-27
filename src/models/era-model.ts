import { ObjectId } from "mongodb";
import { z } from "zod";

import { getDb } from "../config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "../utils/validators";

const eraCollectionName = "eras";

const eraCollectionSchema = z
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
    status: z.enum(["draft", "completed", "published"]).default("draft"),
    created_at: z.date().default(new Date()),
    updated_at: z.date().default(new Date()),
  })
  .strict();

const eraCollectionReadOnlyField = ["_id", "created_at"];

const validateData = async (data: z.infer<typeof eraCollectionSchema>) => {
  return await eraCollectionSchema.parseAsync(data);
};

const createOneEra = async (data: z.infer<typeof eraCollectionSchema>) => {
  try {
    const validData = await validateData(data);

    const createResult = await getDb()
      .collection(eraCollectionName)
      .insertOne(validData);

    return createResult;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllEras = async () => {
  try {
    const eras = await getDb().collection(eraCollectionName).find().toArray();

    return eras;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllPublishedEras = async () => {
  try {
    const publishedEras = await getDb()
      .collection(eraCollectionName)
      .find({ status: "published" })
      .toArray();

    return publishedEras;
  } catch (error) {
    throw new Error(error);
  }
};

const getOneEraById = async (id: ObjectId | string) => {
  try {
    if (typeof id === "string" && !OBJECT_ID_RULE.test(id)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    const era = await getDb()
      .collection(eraCollectionName)
      .findOne({ _id: new ObjectId(id) });

    return era;
  } catch (error) {
    throw new Error(error);
  }
};

const getOneEraBySlug = async (slug: string) => {
  try {
    const era = await getDb().collection(eraCollectionName).findOne({ slug });

    return era;
  } catch (error) {
    throw new Error(error);
  }
};

const updateOneEraById = async (eraId: ObjectId | string, updateData: any) => {
  try {
    if (typeof eraId === "string" && !OBJECT_ID_RULE.test(eraId)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    Object.keys(updateData).map((field) => {
      if (eraCollectionReadOnlyField.includes(field)) {
        delete updateData[field];
      }
    });

    const updatedEra = getDb()
      .collection(eraCollectionName)
      .findOneAndUpdate(
        {
          _id: new ObjectId(eraId),
        },
        {
          $set: updateData,
        },
        {
          returnDocument: "after",
        }
      );

    return updatedEra;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOneEraById = async (eraId: ObjectId | string) => {
  try {
    if (typeof eraId === "string" && !OBJECT_ID_RULE.test(eraId)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    const deleteResult = await getDb()
      .collection(eraCollectionName)
      .deleteOne({ _id: new ObjectId(eraId) });

    return deleteResult;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  eraCollectionName,
  eraCollectionSchema,
  createOneEra,
  getAllEras,
  getAllPublishedEras,
  getOneEraById,
  getOneEraBySlug,
  updateOneEraById,
  deleteOneEraById,
};
