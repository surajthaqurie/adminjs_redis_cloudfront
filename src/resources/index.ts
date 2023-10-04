import page_resource from "./pages.resource";
import game_resource from "./game.resource";
import game_type_resource from "./game_type.resource";
import game_category_resource from "./game_category.resource";
import add_game_with_category_resource from "./add_game_with_category.resource";
import { componentLoader, Components } from "../frontend/components";

export const AdminJsResourcesConfig = {
  resources: [
    page_resource,
    game_type_resource,
    game_resource,
    game_category_resource,
    add_game_with_category_resource
  ],
  componentLoader,
  dashboard: {
    component: Components.Dashboard
  },
  branding: {
    companyName: process.env.APP_NAME,
    adminJSteam: false,
    favicon: "/public/logo.png",
    logo: "/public/logo.png",
    withMadeWithLove: false
  },
  env: {
    APP_NAME: process.env.APP_NAME as string,
    APP_URL: process.env.APP_URL as string
  },
  assets: {
    styles: ["/public/quill.snow.css"]
  },
  locale: {
    language: "en",
    translations: {
      properties: {
        gallery: "Gallery (multiple images)"
      }
    }
  }
};
