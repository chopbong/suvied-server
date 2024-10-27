import { Router } from "express";

import userController from "../controllers/user-controller";

export default (router: Router) => {
  router.get("/users/:email", userController.getOneUserByEmail);

  // router.delete("/users/:id", userController.deleteOneUser);

  // router.put("/users", )
};
