import { SEARCH_TYPE_CONSTANT, TABLE_NAME_CONSTANT } from "src/common/constant";
import { IGameByCategory, IGameInCategory, IPaginationResponse } from "src/interfaces";
import { prisma, getKey, getSearchResponse, customGameByCategoryResponse } from "src/utility";
const { gameCategory: GameCategory } = prisma;

const getGameCategories = async (page: number, itemNo: number): Promise<IPaginationResponse<IGameInCategory>> => {
  // const pagination_query = paginated_query(page, itemNo);

  const [count, game_categories] = await prisma.$transaction([
    GameCategory.count(),
    GameCategory.findMany({
      // ...pagination_query,
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

const getGamesByCategory = async (slug: string, page: number, itemNo: number): Promise<IPaginationResponse<IGameByCategory>> => {
  // const pagination_query = paginated_query(page, itemNo);

  const key = getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_CATEGORY);
  const cached_data = await getSearchResponse(key, slug);
  if (cached_data) {
    return {
      //@ts-expect-error
      data: cached_data,
      total_count: cached_data.length
    };
  }
  const [count, games] = await prisma.$transaction([
    GameCategory.count({ where: { slug } }),
    GameCategory.findMany({
      // ...pagination_query,
      where: { slug },
      select: {
        name: true,
        slug: true,
        GameByCategory: {
          select: {
            Game: true
          }
        }
      }
    })
  ]);

  const custom_data = await customGameByCategoryResponse(key, slug, games);
  return {
    data: custom_data,
    total_count: count
  };
};

export const game_category_service = {
  getGameCategories,
  getGamesByCategory
};
