import { Router } from "express";

import authenticationValidation from "../validations/authentication-validation";
import authenticationController from "../controllers/authentication-controller";

export default (router: Router) => {
  router
    .route("/auth/register")
    .post(
      authenticationValidation.registerReqBody,
      authenticationController.register
    );

  router.route("/auth/logout").delete(authenticationController.logout);

  router
    .route("/auth/login")
    .post(
      authenticationValidation.loginReqBody,
      authenticationController.login
    );

  router
    .route("/auth/verify/:email")
    .post(
      authenticationValidation.authReqEmailParam,
      authenticationController.sendVerificationMail
    )
    .put(
      authenticationValidation.authReqEmailParam,
      authenticationController.verifyOneUserByEmail
    );

  router
    .route("/auth/reset/:email")
    .post(
      authenticationValidation.authReqEmailParam,
      authenticationController.sendPasswordResetMail
    );

  router
    .route("/auth/reset")
    .put(
      authenticationValidation.resetReqBody,
      authenticationController.resetPassword
    );

  router.route("/auth/token").put(authenticationController.refreshToken);
};
