import { game_category_controller } from "../controllers/game_category.controller";

export default (router: any): void => {
  router.route("/game-category").get(game_category_controller.getCategories);
  router.route("/game-category/:slug").get(game_category_controller.getGamesByCategory);
};
