import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import multipleChoiceService from "../services/multiple-choice-service";

const createOneMultipleChoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createdMultipleChoice =
      await multipleChoiceService.createOneMultipleChoice(req.body);

    res
      .status(StatusCodes.CREATED)
      .json({ success: true, createdMultipleChoice });
  } catch (error) {
    next(error);
  }
};

const getAllMultipleChoices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const multipleChoices = await multipleChoiceService.getAllMultipleChoices();

    res.status(StatusCodes.OK).json({ success: true, multipleChoices });
  } catch (error) {
    next(error);
  }
};

const getOneMultipleChoiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const multipleChoice = await multipleChoiceService.getOneMultipleChoiceById(
      id
    );

    res.status(StatusCodes.OK).json({ success: true, multipleChoice });
  } catch (error) {
    next(error);
  }
};

const updateOneMultipleChoiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const updatedMultipleChoice =
      await multipleChoiceService.updateOneMultipleChoiceById(id, req.body);

    res.status(StatusCodes.OK).json({ success: true, updatedMultipleChoice });
  } catch (error) {
    next(error);
  }
};

const deleteOneMultipleChoiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const message = await multipleChoiceService.deleteOneMultipleChoiceById(id);

    res.status(StatusCodes.OK).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};

export default {
  createOneMultipleChoice,
  getAllMultipleChoices,
  getOneMultipleChoiceById,
  updateOneMultipleChoiceById,
  deleteOneMultipleChoiceById,
};
