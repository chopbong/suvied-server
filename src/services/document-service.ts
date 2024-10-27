import { StatusCodes } from "http-status-codes";

import type {
  DocumentReqBodySchema,
  DocumentReqUpdateBodySchema,
} from "../validations/document-validation";
import ApiError from "../utils/api-error";
import documentModel from "../models/document-model";
import eraModel from "../models/era-model";

const createOneDocument = async (reqBody: DocumentReqBodySchema) => {
  try {
    const { slug } = reqBody;

    const existedDocument = await documentModel.getOneDocumentBySlug(slug);

    if (existedDocument) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Document with slug '${slug}' already exists`
      );
    }

    const createResult = await documentModel.createOneDocument(reqBody);

    if (!createResult.acknowledged) {
      throw new Error("Failed to create document");
    }

    const createdDocument = await documentModel.getOneDocumentById(
      createResult.insertedId
    );

    if (!createdDocument) {
      throw new Error("Failed to get created document");
    }

    return createdDocument;
  } catch (error) {
    throw error;
  }
};

const getAllDocuments = async () => {
  try {
    const documents = await documentModel.getAllDocuments();

    if (!documents) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No documents found");
    }

    return documents;
  } catch (error) {
    throw error;
  }
};

const getManyDocumentsByEraSlug = async (eraSlug: string) => {
  try {
    const era = await eraModel.getOneEraBySlug(eraSlug);

    if (!era) {
      throw new ApiError(StatusCodes.NOT_FOUND, `No era '${eraSlug}' found`);
    }

    const documents = await documentModel.getManyDocumentsByEraId(era._id);

    if (!documents.length) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `No documents belonged to era '${eraSlug}' found`
      );
    }

    return documents;
  } catch (error) {
    throw error;
  }
};

const getOneDocumentById = async (documentId: string) => {
  try {
    const document = await documentModel.getOneDocumentById(documentId);

    if (!document) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `No document with id '${documentId}' found`
      );
    }

    return document;
  } catch (error) {
    throw error;
  }
};

const getOneDocumentBySlug = async (documentSlug: string) => {
  try {
    const document = await documentModel.getOneDocumentBySlug(documentSlug);

    if (!document) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `No document with slug '${documentSlug}' found`
      );
    }

    return document;
  } catch (error) {
    throw error;
  }
};

const updateOneDocumentById = async (
  documentId: string,
  reqBody: DocumentReqUpdateBodySchema
) => {
  try {
    const updateDocumentData = {
      ...reqBody,
      updated_at: new Date(),
    };

    const updatedDocument = await documentModel.updateOneDocumentById(
      documentId,
      updateDocumentData
    );

    if (!updatedDocument) {
      throw new Error("Failed to updated document");
    }

    return updatedDocument;
  } catch (error) {
    throw error;
  }
};

const deleteOneDocumentById = async (documentId: string) => {
  try {
    const deleteResult = await documentModel.deleteOneDocumentById(documentId);

    if (!deleteResult.acknowledged) {
      throw new Error("Failed to delete document");
    }

    return "Deleted document successfully";
  } catch (error) {
    throw error;
  }
};

export default {
  createOneDocument,
  getAllDocuments,
  getManyDocumentsByEraSlug,
  getOneDocumentById,
  getOneDocumentBySlug,
  updateOneDocumentById,
  deleteOneDocumentById,
};
