import { ObjectId } from "mongodb";
import { z } from "zod";

import { getDb } from "../config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "../utils/validators";

const multipleChoiceCollectionName = "multiple-choices";

const multipleChoiceCollectionSchema = z.object({
  question: z.string().min(1).trim(),
  options: z
    .array(
      z.object({
        text: z.string().min(1).trim(),
        is_correct: z.boolean().default(false),
      })
    )
    .min(1),
  explanation: z.string().min(1).trim(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  points: z.number().min(1).max(100).int().positive(),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
  // TODO: For future scaling, add "created_by", "updated_by"
});

const multipleChoiceCollectionReadOnlyField = ["_id", "created_at"];

const createOneMultipleChoice = async (
  data: z.infer<typeof multipleChoiceCollectionSchema>
) => {
  try {
    const validData = multipleChoiceCollectionSchema.parse(data);

    const createResult = await getDb()
      .collection(multipleChoiceCollectionName)
      .insertOne({
        ...validData,
        options: validData.options.map((option) => ({
          ...option,
          option_id: new ObjectId(), // Generate new unique id for each option
        })),
        // TODO: For future scaling, convert some to ObjectId type
      });

    return createResult;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllMultipleChoices = async () => {
  try {
    const multipleChoices = await getDb()
      .collection(multipleChoiceCollectionName)
      .find()
      .toArray();

    return multipleChoices;
  } catch (error) {
    throw new Error(error);
  }
};

const getOneMultipleChoiceById = async (id: ObjectId | string) => {
  try {
    if (typeof id === "string" && !OBJECT_ID_RULE.test(id)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    const multipleChoice = await getDb()
      .collection(multipleChoiceCollectionName)
      .findOne({ _id: new ObjectId(id) });

    return multipleChoice;
  } catch (error) {
    throw new Error(error);
  }
};

const updateOneMultipleChoiceById = async (
  id: ObjectId | string,
  updateData: any
) => {
  try {
    if (typeof id === "string" && !OBJECT_ID_RULE.test(id)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    Object.keys(updateData).map((field) => {
      if (multipleChoiceCollectionReadOnlyField.includes(field)) {
        delete updateData[field];
      }
    });

    const updatedMultipleChoice = await getDb()
      .collection(multipleChoiceCollectionName)
      .findOneAndUpdate(
        {
          _id: new ObjectId(id),
        },
        {
          $set: updateData,
        },
        {
          returnDocument: "after",
        }
      );

    return updatedMultipleChoice;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOneMultipleChoiceById = async (id: ObjectId | string) => {
  try {
    if (typeof id === "string" && !OBJECT_ID_RULE.test(id)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    const deleteResult = await getDb()
      .collection(multipleChoiceCollectionName)
      .deleteOne({ _id: new ObjectId(id) });

    return deleteResult;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  multipleChoiceCollectionName,
  multipleChoiceCollectionSchema,
  createOneMultipleChoice,
  getAllMultipleChoices,
  getOneMultipleChoiceById,
  updateOneMultipleChoiceById,
  deleteOneMultipleChoiceById,
};
