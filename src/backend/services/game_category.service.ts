import { IGameByCategory, IGameInCategory, IPaginationResponse } from "src/interfaces";
import { prisma, paginated_query } from "src/utility";
const { gameCategory: GameCategory } = prisma;

const getGameCategories = async (
  page: number,
  itemNo: number
): Promise<IPaginationResponse<IGameInCategory>> => {
  const pagination_query = paginated_query(page, itemNo);

  const [count, game_categories] = await prisma.$transaction([
    GameCategory.count(),
    GameCategory.findMany({
      ...pagination_query,
      include: {
        GameByCategory: {
          select: {
            Game: {
              include: {
                GameTypes: true
              }
            }
          }
        }
      }
    })
  ]);

  const games_in_category = game_categories.map((category) => {
    const cat_with_game = category.GameByCategory.map((d) => {
      return d.Game;
    });
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      Games: cat_with_game
    };
  });

  return {
    data: games_in_category,
    total_count: count
  };
};

const getGamesByCategory = async (
  slug: string,
  page: number,
  itemNo: number
): Promise<IPaginationResponse<IGameByCategory>> => {
  const pagination_query = paginated_query(page, itemNo);

  const [count, games] = await prisma.$transaction([
    GameCategory.count({ where: { slug } }),
    GameCategory.findMany({
      ...pagination_query,
      where: { slug },
      select: {
        name: true,
        GameByCategory: {
          select: {
            Game: true
          }
        }
      }
    })
  ]);

  return {
    data: games,
    total_count: count
  };
};

export const game_category_service = {
  getGameCategories,
  getGamesByCategory
};
