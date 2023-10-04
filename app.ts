import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import cors from "cors";
import path from "path";
import swaggerUI from "swagger-ui-express";
import morgan from "morgan";

import express, { Application, NextFunction, Request, Response } from "express";
import { adminConfig } from "./src/utility";
import routes from "./src/backend/routes";
import errorGlobalHandler from "./src/backend/controllers/error.controller";
import swaggerFile from "./public/swagger_output.json";

const start = async (): Promise<void> => {
  const PORT = process.env.PORT || 3001;
  const server: Application = express();
  const router = express.Router();

  server.use(cors({ origin: "*" }));
  server.use(morgan("dev"));

  server.use("/public", express.static(path.join(__dirname, "public")));

  const { admin, adminRouter } = adminConfig();

  server.use(admin.options.rootPath, adminRouter);
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));
  routes(router);

  server.get("/", (req: Request, res: Response, next: NextFunction) => {
    return res.redirect(admin.options.rootPath);
  });
  server.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

  server.use(
    "/api/v1",
    (req: Request, res: Response, next: NextFunction) => {
      next();
    },
    router
  );

  server.use(errorGlobalHandler);
  server.listen(PORT, (): void => {
    console.log(`Server is started on ${process.env.APP_URL}`);
    console.log(`Admin panel is started on ${process.env.APP_URL}${admin.options.rootPath}`);
    console.log(`Swagger API docs is  started on ${process.env.APP_URL}/api-docs`);
  });
};

start();
