import { ObjectId } from "mongodb";
import { z } from "zod";

import { getDb } from "../config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "../utils/validators";

const documentCollectionName = "documents";

const documentCollectionSchema = z
  .object({
    era_id: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
    title: z.string().min(1).max(256).trim(),
    slug: z.string().min(1).trim(),
    content: z.string().trim(),
    status: z.enum(["draft", "published"]).default("draft"),
    created_at: z.date().default(new Date()),
    updated_at: z.date().default(new Date()),
    // TODO: For future scaling
    // created_by: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
    // updated_by: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
  })
  .strict();

// TODO: For future scaling, add "created_by"
const documentCollectionReadOnlyField = ["_id", "created_at"];

const createOneDocument = async (
  data: z.infer<typeof documentCollectionSchema>
) => {
  try {
    const validData = await documentCollectionSchema.parseAsync(data);

    const createResult = await getDb()
      .collection(documentCollectionName)
      .insertOne({
        ...validData,
        era_id: new ObjectId(validData.era_id), // Convert type of era_id to ObjectId
        // TODO: For future scaling, convert type of "created_by", "updated_by"
      });

    return createResult;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllDocuments = async () => {
  try {
    const documents = await getDb()
      .collection(documentCollectionName)
      .find()
      .toArray();

    return documents;
  } catch (error) {
    throw new Error(error);
  }
};

const getManyDocumentsByEraId = async (eraId: ObjectId | string) => {
  try {
    if (typeof eraId === "string" && !OBJECT_ID_RULE.test(eraId)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    const documents = await getDb()
      .collection(documentCollectionName)
      .find({ era_id: new ObjectId(eraId) })
      .toArray();

    return documents;
  } catch (error) {
    throw new Error(error);
  }
};

const getOneDocumentById = async (id: ObjectId | string) => {
  try {
    if (typeof id === "string" && !OBJECT_ID_RULE.test(id)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    const document = await getDb()
      .collection(documentCollectionName)
      .findOne({
        _id: new ObjectId(id),
      });

    return document;
  } catch (error) {
    throw new Error(error);
  }
};

const getOneDocumentBySlug = async (slug: string) => {
  try {
    const document = await getDb().collection(documentCollectionName).findOne({
      slug,
    });

    return document;
  } catch (error) {
    throw new Error(error);
  }
};

const updateOneDocumentById = async (
  id: ObjectId | string,
  updateData: any
) => {
  try {
    if (typeof id === "string" && !OBJECT_ID_RULE.test(id)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    Object.keys(updateData).map((field) => {
      if (documentCollectionReadOnlyField.includes(field)) {
        delete updateData[field];
      }

      if (field === "era_id") {
        updateData[field] = new ObjectId(
          updateData[field] as string | ObjectId
        );
      }
    });

    const updatedDocument = await getDb()
      .collection(documentCollectionName)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    return updatedDocument;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOneDocumentById = async (id: ObjectId | string) => {
  try {
    if (typeof id === "string" && !OBJECT_ID_RULE.test(id)) {
      throw new Error(OBJECT_ID_RULE_MESSAGE);
    }

    const deleteResult = await getDb()
      .collection(documentCollectionName)
      .deleteOne({
        _id: new ObjectId(id),
      });

    return deleteResult;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  documentCollectionName,
  documentCollectionSchema,
  createOneDocument,
  getAllDocuments,
  getManyDocumentsByEraId,
  getOneDocumentById,
  getOneDocumentBySlug,
  updateOneDocumentById,
  deleteOneDocumentById,
};
