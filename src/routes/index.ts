import { Router } from "express";

import authenticationRoute from "./authentication-route";
import userRoute from "./user-route";
import eraRoute from "./era-route";
import eventRoute from "./event-route";
import documentRoute from "./document-route";
import multipleChoiceRoute from "./multiple-choice-route";

const router = Router();

export default (): Router => {
  // * User routes
  authenticationRoute(router);
  userRoute(router);

  // * Historical materials routes
  eraRoute(router);
  eventRoute(router);
  documentRoute(router);
  multipleChoiceRoute(router);

  return router;
};
