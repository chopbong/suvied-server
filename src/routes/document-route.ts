import { Router } from "express";

import authMiddleware from "../middleware/auth-middleware";
import documentValidation from "../validations/document-validation";
import documentController from "../controllers/document-controller";

export default (router: Router) => {
  router.route("/documents").get(documentController.getAllDocuments).post(
    // authMiddleware.isAutheticated,
    // authMiddleware.isAuthorized("admin"),
    documentValidation.documentReqBody,
    documentController.createOneDocument
  );

  router
    .route("/documents/:id")
    .get(
      documentValidation.documentReqIdParam,
      documentController.getOneDocumentById
    )
    .put(
      // authMiddleware.isAutheticated,
      // authMiddleware.isAuthorized("admin"),
      documentValidation.documentReqUpdateBody,
      documentController.updateOneDocumentById
    )
    .delete(
      // authMiddleware.isAutheticated,
      documentValidation.documentReqIdParam,
      documentController.deleteOneDocumentById
    );

  router
    .route("/public/documents")
    .get(
      documentValidation.documentReqEraSlugQuery,
      documentController.getManyDocumentsByEraSlug
    );

  router
    .route("/published-documents/:slug")
    .get(
      documentValidation.documentReqSlugParam,
      documentController.getOneDocumentBySlug
    );
};
