import AdminJs from "adminjs";
import { Database, Resource } from "@adminjs/prisma";
import { AdminJsResourcesConfig } from "../resources";
import Login from "../frontend/components/overridable/Login";

import AdminJsExpress from "@adminjs/express";
import AdminJS from "adminjs/types/src";
import express from "express";

import { adminAuthenticate } from "./admin_auth";
import { adminSessionStore } from "./admin_pg_session";

const adminExpressRouter = (admin: AdminJS): express.Router => {
  return AdminJsExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: adminAuthenticate,
      cookieName: process.env.COOKIES_NAME,
      cookiePassword: process.env.COOKIES_SECRET as string
    },
    null,
    {
      store: adminSessionStore(),
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
};

export const adminConfig = (): { admin: AdminJs; adminRouter: express.Router } => {
  AdminJs.registerAdapter({ Database, Resource });
  const admin = new AdminJs(AdminJsResourcesConfig);
  admin.overrideLogin({ component: Login });

  const adminRouter = adminExpressRouter(admin);

  return { admin, adminRouter };
};
