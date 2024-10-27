import { ObjectId } from "mongodb";
import { z } from "zod";

import { getDb } from "../config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "../utils/validators";

const eventCollectionName = "events";

const eventCollectionSchema = z
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
    created_at: z.date().default(new Date()),
    updated_at: z.date().default(new Date()),
  })
  .strict();

const eventCollectionReadOnlyField = ["_id", "created_at"];

const validateData = async (data: z.infer<typeof eventCollectionSchema>) => {
  return await eventCollectionSchema.parseAsync(data);
};

const createOneEvent = async (data: z.infer<typeof eventCollectionSchema>) => {
  try {
    const validData = await validateData(data);

    const createResult = await getDb()
      .collection(eventCollectionName)
      .insertOne({
        ...validData,
        era_id: new ObjectId(validData.era_id), // Convert era_id to type ObjectId
      });

    return createResult;
  } catch (error) {
    throw new Error(error);
  }
};

const getManyEventsByEraId = async (eraId: ObjectId | string) => {
  try {
    if (typeof eraId === "string" && !OBJECT_ID_RULE.test(eraId)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    const events = await getDb()
      .collection(eventCollectionName)
      .find({ era_id: new ObjectId(eraId) })
      .toArray();

    return events;
  } catch (error) {
    throw new Error(error);
  }
};

const getOneEventById = async (id: ObjectId | string) => {
  try {
    if (typeof id === "string" && !OBJECT_ID_RULE.test(id)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    const event = await getDb()
      .collection(eventCollectionName)
      .findOne({ _id: new ObjectId(id) });

    return event;
  } catch (error) {
    throw new Error(error);
  }
};

const getOneEventBySlug = async (slug: string) => {
  try {
    const event = await getDb()
      .collection(eventCollectionName)
      .findOne({ slug });

    return event;
  } catch (error) {
    throw new Error(error);
  }
};

const updateOneEventById = async (
  eventId: ObjectId | string,
  updateData: any
) => {
  try {
    if (typeof eventId === "string" && !OBJECT_ID_RULE.test(eventId)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    Object.keys(updateData).map((field) => {
      if (eventCollectionReadOnlyField.includes(field)) {
        delete updateData[field];
      }

      if (field === "era_id") {
        updateData[field] = new ObjectId(
          updateData[field] as string | ObjectId
        );
      }
    });

    const updatedEvent = getDb()
      .collection(eventCollectionName)
      .findOneAndUpdate(
        {
          _id: new ObjectId(eventId),
        },
        {
          $set: updateData,
        },
        {
          returnDocument: "after",
        }
      );

    return updatedEvent;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOneEventById = async (eventId: ObjectId | string) => {
  try {
    if (typeof eventId === "string" && !OBJECT_ID_RULE.test(eventId)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    const deleteResult = await getDb()
      .collection(eventCollectionName)
      .deleteOne({ _id: new ObjectId(eventId) });

    return deleteResult;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  eventCollectionName,
  eventCollectionSchema,
  createOneEvent,
  getManyEventsByEraId,
  getOneEventById,
  getOneEventBySlug,
  updateOneEventById,
  deleteOneEventById,
};
