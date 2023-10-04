import { game_type_controller } from "../controllers/game_type.controller";

export default (router: any): void => {
  router.route("/game-type").get(game_type_controller.getGameTypes);
  router.route("/game-type/:slug").get(game_type_controller.getGameTypeDetailsBySlug);
};
