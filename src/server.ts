import "dotenv/config";
import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import { StatusCodes } from "http-status-codes";

import { env } from "./config/environment";
import { connectDb } from "./config/mongodb";
import { errorHandlingMiddleware } from "./middleware/error-handling-middleware";
import router from "./routes";

const startServer = () => {
  const app = express();

  // Middlewares
  app.use(
    cors({
      origin: env.ORIGIN,
      credentials: true,
    })
  );
  // app.use(compression());
  app.use(cookieParser());
  app.use(express.json());

  // Routes
  app.get(
    "/health-check",
    async (req: express.Request, res: express.Response) => {
      res.status(StatusCodes.OK).json({
        message: "Healthcheck API passed!",
      });
    }
  );

  app.use("/api/v1", router());

  // Errors handler
  app.use(errorHandlingMiddleware);

  // Server
  const server = http.createServer(app);

  server.listen(env.APP_PORT, () =>
    console.log(
      `3. Server is running on http://${env.APP_HOST}:${env.APP_PORT}/`
    )
  );
};

// Only start the server after database connection is established (IIFE)
(async () => {
  try {
    console.log("1. Connecting to MongoDB...");
    await connectDb();
    console.log("2. Connected to MongoDB");
    startServer();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
