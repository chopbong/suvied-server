import { StatusCodes } from "http-status-codes";

import type {
  EventReqBodySchema,
  EventReqUpdateBodySchema,
} from "../validations/event-validation";
import ApiError from "../utils/api-error";
import eventModel from "../models/event-model";

const createOneEvent = async (reqBody: EventReqBodySchema) => {
  try {
    const { slug } = reqBody;

    const existedEvent = await eventModel.getOneEventBySlug(slug);

    if (existedEvent) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Event with slug '${slug}' already exists`
      );
    }

    const createResult = await eventModel.createOneEvent(reqBody);

    if (!createResult.acknowledged) {
      throw new Error("Failed to create event");
    }

    const createdEvent = await eventModel.getOneEventById(
      createResult.insertedId
    );

    if (!createdEvent) {
      throw new Error("Failed to get created event");
    }

    return createdEvent;
  } catch (error) {
    throw error;
  }
};

const getManyEventsByEraId = async (eraId: string) => {
  try {
    const events = await eventModel.getManyEventsByEraId(eraId);

    if (!events.length) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No events found");
    }

    return events;
  } catch (error) {
    throw error;
  }
};

const getOneEventById = async (eventId: string) => {
  try {
    const event = await eventModel.getOneEventById(eventId);

    if (!event) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `No event with slug '${eventId}' found`
      );
    }

    return event;
  } catch (error) {
    throw error;
  }
};

const getOneEventBySlug = async (eventSlug: string) => {
  try {
    const event = await eventModel.getOneEventBySlug(eventSlug);

    if (!event) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `No event with slug '${eventSlug}' found`
      );
    }

    return event;
  } catch (error) {
    throw error;
  }
};

const updateOneEventById = async (
  eventId: string,
  reqBody: EventReqUpdateBodySchema
) => {
  try {
    const updateEventData = {
      ...reqBody,
      lastModifiedAt: new Date(),
    };

    const updatedEvent = await eventModel.updateOneEventById(
      eventId,
      updateEventData
    );

    if (!updatedEvent) {
      throw new Error("Failed to updated event");
    }

    return updatedEvent;
  } catch (error) {
    throw error;
  }
};

const deleteOneEventById = async (eventId: string) => {
  try {
    const eventToDelete = await eventModel.getOneEventById(eventId);

    if (!eventToDelete) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No event found to delete");
    }

    const deleteResult = await eventModel.deleteOneEventById(eventToDelete._id);

    if (!deleteResult.acknowledged) {
      throw new Error("Failed to delete event");
    }

    return "Delete event successfully";
  } catch (error) {
    throw error;
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
