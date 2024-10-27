import { Router } from "express";

import authMiddleware from "../middleware/auth-middleware";
import eraValidation from "../validations/era-validation";
import eraController from "../controllers/era-controller";

export default (router: Router) => {
  router.route("/eras").get(eraController.getAllEras).post(
    // authMiddleware.isAutheticated,
    // authMiddleware.isAuthorized("admin"),
    eraValidation.eraReqBody,
    eraController.createOneEra
  );

  router
    .route("/eras/:id")
    .get(eraValidation.eraReqIdParam, eraController.getOneEraById)
    .put(
      // authMiddleware.isAutheticated,
      // authMiddleware.isAuthorized("admin"),
      eraValidation.eraReqUpdateBody,
      eraController.updateOneEraById
    )
    .delete(
      // authMiddleware.isAutheticated,
      eraValidation.eraReqIdParam,
      eraController.deleteOneEraById
    );

  router
    .route("/published-eras/:slug")
    .get(eraValidation.eraReqSlugParam, eraController.getOneEraBySlug);
};
