import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import express, { Application, NextFunction, Request, Response } from "express";
import AdminJs from "adminjs";
import AdminJsExpress from "@adminjs/express";
import session from "express-session";
import Connect from "connect-pg-simple";
import swaggerUI from "swagger-ui-express";
import { Database, Resource } from "@adminjs/prisma";

import { adminAuthenticate } from "./src/utility";
import { AdminJsResourcesConfig } from "./src/resources";
import swaggerFile from "./public/swagger_output.json";

dotenv.config({ path: "./.env" });

const start = async (): Promise<void> => {
  const PORT = process.env.PORT || 3001;
  const server: Application = express();
  const router = express.Router();

  server.use(cors({ origin: "*" }));
  server.use("/public", express.static(path.join(__dirname, "public")));

  AdminJs.registerAdapter({ Database, Resource });
  const admin = new AdminJs(AdminJsResourcesConfig);

  const ConnectSession = Connect(session);
  const sessionStore = new ConnectSession({
    conObject: {
      connectionString: process.env.DATABASE_URL,
      ssl: false
    },
    tableName: "session",
    createTableIfMissing: true
  });

  const adminRouter = AdminJsExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: adminAuthenticate,
      cookieName: process.env.COOKIES_NAME,
      cookiePassword: process.env.COOKIES_SECRET as string
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: process.env.COOKIES_SECRET as string,
      cookie: {
        httpOnly: false,
        secure: false
      },
      name: process.env.COOKIES_NAME
    }
  );

  server.use(admin.options.rootPath, adminRouter);
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));

  server.get("/", (req: Request, res: Response) => {
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

  server.listen(PORT, (): void => {
    console.log(`Server is started on ${process.env.APP_URL}`);
    console.log(`Admin panel is started on ${process.env.APP_URL}/api-docs`);
    console.log(
      `Admin panel is started on ${process.env.APP_URL}${admin.options.rootPath}`
    );
  });
};

start();
