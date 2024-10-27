import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import documentService from "../services/document-service";

const createOneDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createdDocument = await documentService.createOneDocument(req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      createdDocument,
    });
  } catch (error) {
    return next(error);
  }
};

const getAllDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const documents = await documentService.getAllDocuments();

    return res.status(StatusCodes.OK).json({
      success: true,
      documents,
    });
  } catch (error) {
    return next(error);
  }
};

const getManyDocumentsByEraSlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { era } = req.query as { era: string };

    const documents = await documentService.getManyDocumentsByEraSlug(era);

    return res.status(StatusCodes.OK).json({
      success: true,
      documents,
    });
  } catch (error) {
    return next(error);
  }
};

const getOneDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const document = await documentService.getOneDocumentById(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      document,
    });
  } catch (error) {
    return next(error);
  }
};

const getOneDocumentBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;

    const document = await documentService.getOneDocumentBySlug(slug);

    return res.status(StatusCodes.OK).json({
      success: true,
      document,
    });
  } catch (error) {
    return next(error);
  }
};

const updateOneDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const updatedDocument = await documentService.updateOneDocumentById(
      id,
      req.body
    );

    return res.status(StatusCodes.CREATED).json({
      success: true,
      updatedDocument,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteOneDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const message = await documentService.deleteOneDocumentById(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message,
    });
  } catch (error) {
    return next(error);
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
