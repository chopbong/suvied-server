import { StatusCodes } from "http-status-codes";

// import type {
//   MultipleChoiceReqBodySchema,
//   MultipleChoiceReqUpdateBodySchema,
// } from "../validations/multiple-choice-validation";
import ApiError from "../utils/api-error";
import multipleChoiceModel from "../models/mutiple-choice-model";

// TODO: Change type of parameters in create and update function in future

const createOneMultipleChoice = async (reqBody: any) => {
  try {
    const createResult = await multipleChoiceModel.createOneMultipleChoice(
      reqBody
    );

    if (!createResult.acknowledged) {
      throw new Error("Failed to create multiple choice challenge");
    }

    const createdMultipleChoice =
      await multipleChoiceModel.getOneMultipleChoiceById(
        createResult.insertedId
      );

    if (!createdMultipleChoice) {
      throw new Error("Failed to get created multiple choice challenge");
    }

    return createdMultipleChoice;
  } catch (error) {
    throw error;
  }
};

const getAllMultipleChoices = async () => {
  try {
    const multipleChoices = await multipleChoiceModel.getAllMultipleChoices();

    if (!multipleChoices) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "No multiple choice challenges found"
      );
    }

    return multipleChoices;
  } catch (error) {
    throw error;
  }
};

const getOneMultipleChoiceById = async (multipleChoiceId: string) => {
  try {
    const multipleChoice = await multipleChoiceModel.getOneMultipleChoiceById(
      multipleChoiceId
    );

    if (!multipleChoice) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `No multiple choice challenge with id '${multipleChoiceId}' found`
      );
    }

    return multipleChoice;
  } catch (error) {
    throw error;
  }
};

const updateOneMultipleChoiceById = async (
  multipleChoiceId: string,
  reqBody: any
) => {
  try {
    const updateMultipleChoiceData = {
      ...reqBody,
      updated_at: new Date(),
    };

    const updatedMultipleChoice =
      await multipleChoiceModel.updateOneMultipleChoiceById(
        multipleChoiceId,
        updateMultipleChoiceData
      );

    if (!updatedMultipleChoice) {
      throw new Error("Failed to updated multiple choice challenge");
    }

    return updatedMultipleChoice;
  } catch (error) {
    throw error;
  }
};

const deleteOneMultipleChoiceById = async (multipleChoiceId: string) => {
  try {
    const deleteResult = await multipleChoiceModel.deleteOneMultipleChoiceById(
      multipleChoiceId
    );

    if (!deleteResult.acknowledged) {
      throw new Error("Failed to delete multiple choice challenge");
    }

    return "Deleted multiple choice challenge successfully";
  } catch (error) {
    throw error;
  }
};

export default {
  createOneMultipleChoice,
  getAllMultipleChoices,
  getOneMultipleChoiceById,
  updateOneMultipleChoiceById,
  deleteOneMultipleChoiceById,
};
