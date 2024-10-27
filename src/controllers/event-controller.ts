import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import eventService from "../services/event-service";

const createOneEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createdEvent = await eventService.createOneEvent(req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      createdEvent,
    });
  } catch (error) {
    return next(error);
  }
};

const getManyEventsByEraId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { eraId } = req.query as { eraId: string };

    const events = await eventService.getManyEventsByEraId(eraId);

    return res.status(StatusCodes.OK).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(error);
  }
};

const getOneEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const event = await eventService.getOneEventById(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      event,
    });
  } catch (error) {
    return next(error);
  }
};

const getOneEventBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params;

    const event = await eventService.getOneEventBySlug(slug);

    return res.status(StatusCodes.OK).json({
      success: true,
      event,
    });
  } catch (error) {
    return next(error);
  }
};

const updateOneEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const updatedEvent = await eventService.updateOneEventById(id, req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      updatedEvent,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteOneEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const message = await eventService.deleteOneEventById(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message,
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  createOneEvent,
  getManyEventsByEraId,
  getOneEventById,
  getOneEventBySlug,
  updateOneEventById,
  deleteOneEventById,
};
