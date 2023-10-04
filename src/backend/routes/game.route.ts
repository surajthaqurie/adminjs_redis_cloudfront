import { game_controller } from "../controllers/game.controller";

export default (router: any): void => {
  router.route("/game").get(game_controller.getGames);
  router.route("/game/:slug").get(game_controller.getGameDetailsBySlug);
};
