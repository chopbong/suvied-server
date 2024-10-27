import { Router } from "express";

import authMiddleware from "../middleware/auth-middleware";
import multipleChoiceValidation from "../validations/multiple-choice-validation";
import multipleChoiceController from "../controllers/multiple-choice-controller";

export default (router: Router) => {
  router
    .route("/multiple-choices")
    .get(multipleChoiceController.getAllMultipleChoices)
    .post(
      // authMiddleware.isAutheticated,
      // authMiddleware.isAuthorized("admin"),
      multipleChoiceValidation.multipleChoiceReqBody,
      multipleChoiceController.createOneMultipleChoice
    );

  router
    .route("/multiple-choices/:id")
    .get(
      multipleChoiceValidation.multipleChoiceReqIdParam,
      multipleChoiceController.getOneMultipleChoiceById
    )
    .put(
      // authMiddleware.isAutheticated,
      // authMiddleware.isAuthorized("admin"),
      multipleChoiceValidation.multipleChoiceReqIdParam,
      multipleChoiceValidation.multipleChoiceReqUpdateBody,
      multipleChoiceController.updateOneMultipleChoiceById
    )
    .delete(
      // authMiddleware.isAutheticated,
      multipleChoiceValidation.multipleChoiceReqIdParam,
      multipleChoiceController.deleteOneMultipleChoiceById
    );

  // router
  //   .route("/public/multiple-choices")
  //   .get(multipleChoiceController.getManyMultipleChoicesByEraSlug);

  // router
  //   .route("/published-multiple-choices/:slug")
  //   .get(multipleChoiceController.getOneMultipleChoiceBySlug);
};
