import { Router } from "express";

import userValidation from "../validations/user-validation";
import userController from "../controllers/user-controller";

export default (router: Router) => {
  router
    .route("/users/:email")
    .get(userValidation.userReqEmailParam, userController.getOneUserByEmail)
    .put(
      userValidation.userReqEmailParam,
      userValidation.userReqUpdateBody,
      userController.updateOneUserByEmail
    );

  // router.delete("/users/:id", userController.deleteOneUser);

  // router.put("/users", )
};
