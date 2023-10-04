import { SEARCH_TYPE_CONSTANT, TABLE_NAME_CONSTANT } from "src/constant";
import { IGame, IPaginationResponse } from "src/interfaces";
import { prisma, AppError, getSearchResponse, getKey, getListResponses, parseStringifyResponses, customSearchResponse, customListResponses, getData, customDetailsResponse } from "src/utility";

const { games: Games } = prisma;

const getGames = async (page: number, itemNo: number, game_type: string): Promise<IPaginationResponse<IGame>> => {
  const search_game_type_key = getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_TYPE);
  const game_key = getKey(TABLE_NAME_CONSTANT.Games);

  let cached_data;

  if (game_type) {
    cached_data = await getSearchResponse(search_game_type_key, game_type);
  } else {
    cached_data = await getListResponses(game_key);
  }

  const is_cache = Array.isArray(cached_data) ? cached_data.length : cached_data;
  if (cached_data && is_cache) {
    const data = Array.isArray(cached_data) ? parseStringifyResponses(cached_data) : JSON.parse(cached_data);
    return {
      total_count: data.length,
      data
    };
  }

  // const pagination_query = paginated_query(page, itemNo);
  const [count, games] = await prisma.$transaction([
    Games.count({
      where: {
        GameTypes: {
          slug: {
            equals: game_type,
            mode: "insensitive"
          }
        }
      }
    }),
    Games.findMany({
      // ...pagination_query,
      where: {
        GameTypes: {
          slug: {
            equals: game_type,
            mode: "insensitive"
          }
        }
      },
      include: {
        GameTypes: {
          select: {
            id: true,
            name: true,
            description: true,
            image: true,
            orders: true,
            slug: true
          }
        }
        // GameByCategory: {
        //   include: {
        //     GameCategory: {
        //       select: {
        //         id: true,
        //         name: true,
        //         slug: true
        //       }
        //     }
        //   }
        // }
      }
    })
  ]);

  // const sanitize_game_by_category = games.map((game) => {
  //   const game_detail = {
  //     ...game,
  //     Category: game.GameByCategory.map((d) => d.GameCategory)
  //   };
  //   const { GameByCategory, ...games_list } = game_detail;
  //   return games_list;
  // });

  let custom_data;
  if (game_type) {
    custom_data = await customSearchResponse(search_game_type_key, game_type, games);
  } else {
    custom_data = await customListResponses(TABLE_NAME_CONSTANT.Games, games);
  }

  return {
    data: custom_data,
    total_count: count
  };
};

const getGameDetailsBySlug = async (slug: string): Promise<IGame> => {
  let game_key = getKey(TABLE_NAME_CONSTANT.Games, slug);

  const cached_data = await getData(game_key);
  if (cached_data) return JSON.parse(cached_data);

  const game = await Games.findFirst({
    where: {
      slug
    },
    include: {
      GameTypes: {
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          orders: true,
          slug: true
        }
      }
    }
  });

  if (!game) throw new AppError("Game record not found", 404);
  const custom_data = await customDetailsResponse(TABLE_NAME_CONSTANT.Games, slug, game);
  return custom_data;
};

export const game_service = {
  getGames,
  getGameDetailsBySlug
};
