import { IGame, IPaginationResponse } from "src/interfaces";
import { prisma, paginated_query, AppError } from "src/utility";

const { games: Games } = prisma;

const getGames = async (
  page: number,
  itemNo: number,
  game_type: string
): Promise<IPaginationResponse<IGame>> => {
  const where_query = {
    GameTypes: {
      slug: {
        equals: game_type,
        mode: "insensitive"
      }
    }
  };

  const query = game_type ? where_query : {};
  const pagination_query = paginated_query(page, itemNo);

  const [count, games] = await prisma.$transaction([
    Games.count(),
    Games.findMany({
      ...pagination_query,
      where: query,
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
        },
        GameByCategory: {
          include: {
            GameCategory: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        }
      }
    })
  ]);

  const sanitize_game_by_category = games.map((game) => {
    const game_detail = {
      ...game,
      Category: game.GameByCategory.map((d) => d.GameCategory)
    };
    const { GameByCategory, ...games_list } = game_detail;
    return games_list;
  });

  return {
    data: sanitize_game_by_category,
    total_count: count
  };
};

const getGameDetailsBySlug = async (slug: string): Promise<IGame> => {
  const game_details = await Games.findFirst({
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

  if (!game_details) throw new AppError("Game record not found", 404);

  return game_details;
};

export const game_service = {
  getGames,
  getGameDetailsBySlug
};
