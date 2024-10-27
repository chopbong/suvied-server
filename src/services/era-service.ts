import { StatusCodes } from "http-status-codes";

import type {
  EraReqBodySchema,
  EraReqUpdateBodySchema,
} from "../validations/era-validation";
import ApiError from "../utils/api-error";
import eraModel from "../models/era-model";

const createOneEra = async (reqBody: EraReqBodySchema) => {
  try {
    const { slug } = reqBody;

    const existedEra = await eraModel.getOneEraBySlug(slug);

    if (existedEra) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Era with slug '${slug}' already exists`
      );
    }

    const createResult = await eraModel.createOneEra(reqBody);

    if (!createResult.acknowledged) {
      throw new Error("Failed to create era");
    }

    const createdEra = await eraModel.getOneEraById(createResult.insertedId);

    if (!createdEra) {
      throw new Error("Failed to get created era");
    }

    return createdEra;
  } catch (error) {
    throw error;
  }
};

const getAllEras = async () => {
  try {
    const eras = await eraModel.getAllEras();

    if (!eras) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No eras found");
    }

    return eras;
  } catch (error) {
    throw error;
  }
};

const getOneEraById = async (eraId: string) => {
  try {
    const era = await eraModel.getOneEraById(eraId);

    if (!era) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `No era with id '${eraId}' found`
      );
    }

    return era;
  } catch (error) {
    throw error;
  }
};

const getOneEraBySlug = async (eraSlug: string) => {
  try {
    const era = await eraModel.getOneEraBySlug(eraSlug);

    if (!era) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `No era with slug '${eraSlug}' found`
      );
    }

    return era;
  } catch (error) {
    throw error;
  }
};

const updateOneEraById = async (
  eraId: string,
  reqBody: EraReqUpdateBodySchema
) => {
  try {
    const updateEraData = {
      ...reqBody,
      lastModifiedAt: new Date(),
    };

    const updatedEra = await eraModel.updateOneEraById(eraId, updateEraData);

    if (!updatedEra) {
      throw new Error("Failed to updated era");
    }

    return updatedEra;
  } catch (error) {
    throw error;
  }
};

const deleteOneEraById = async (eraId: string) => {
  try {
    const deleteResult = await eraModel.deleteOneEraById(eraId);

    if (!deleteResult.acknowledged) {
      throw new Error("Failed to delete era");
    }

    return "Deleted era successfully";
  } catch (error) {
    throw error;
  }
};

export default {
  createOneEra,
  getAllEras,
  getOneEraById,
  getOneEraBySlug,
  updateOneEraById,
  deleteOneEraById,
};
