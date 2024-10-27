import { Router } from "express";

import authMiddleware from "../middleware/auth-middleware";
import eventValidation from "../validations/event-validation";
import eventController from "../controllers/event-controller";

export default (router: Router) => {
  router
    .route("/events")
    .get(
      // authMiddleware.isAutheticated,
      // authMiddleware.isAuthorized("admin"),
      eventValidation.eventReqEraIdQuery,
      eventController.getManyEventsByEraId
    )
    .post(
      // authMiddleware.isAutheticated,
      // authMiddleware.isAuthorized("admin"),
      eventValidation.eventReqBody,
      eventController.createOneEvent
    );

  router
    .route("/events/:id")
    .get(eventValidation.eventReqIdParam, eventController.getOneEventById)
    .put(
      // authMiddleware.isAutheticated,
      // authMiddleware.isAuthorized("admin"),
      eventValidation.eventReqUpdateBody,
      eventController.updateOneEventById
    )
    .delete(
      // authMiddleware.isAutheticated,
      // authMiddleware.isAuthorized("admin"),
      eventValidation.eventReqIdParam,
      eventController.deleteOneEventById
    );

  router
    .route("/published-events/:slug")
    .get(eventValidation.eventReqSlugParam, eventController.getOneEventBySlug);
};
