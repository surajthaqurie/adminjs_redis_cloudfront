import { page_controller } from "../controllers/page.controller";

export default (router: any): void => {
  router.route("/pages").get(page_controller.getPages);
  router.route("/pages/:slug").get(page_controller.getPageDetailsBySlug);
};
