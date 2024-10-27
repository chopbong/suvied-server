import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import eraService from "../services/era-service";

const createOneEra = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createdEra = await eraService.createOneEra(req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      createdEra,
    });
  } catch (error) {
    return next(error);
  }
};

const getAllEras = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eras = await eraService.getAllEras();

    return res.status(StatusCodes.OK).json({
      success: true,
      eras,
    });
  } catch (error) {
    return next(error);
  }
};

const getOneEraById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const era = await eraService.getOneEraById(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      era,
    });
  } catch (error) {
    return next(error);
  }
};

const getOneEraBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;

    const era = await eraService.getOneEraBySlug(slug);

    return res.status(StatusCodes.OK).json({
      success: true,
      era,
    });
  } catch (error) {
    return next(error);
  }
};

const updateOneEraById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const updatedEra = await eraService.updateOneEraById(id, req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      updatedEra,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteOneEraById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const message = await eraService.deleteOneEraById(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message,
    });
  } catch (error) {
    return next(error);
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
