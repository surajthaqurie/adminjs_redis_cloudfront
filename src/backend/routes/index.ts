import games from "./game.route";
import pages from "./page.route";
import game_category from "./game_category.route";
import game_type from "./game_type.route";

export default (router: any): void => {
  games(router);
  pages(router);
  game_category(router);
  game_type(router);
};
