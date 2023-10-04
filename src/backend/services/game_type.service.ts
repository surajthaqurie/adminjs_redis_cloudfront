import { IGameType, IPaginationResponse } from "src/interfaces";
import { prisma, paginated_query, AppError } from "src/utility";

const { gameTypes: Game_Types } = prisma;

const getGameTypes = async (
  page: number,
  itemNo: number
): Promise<IPaginationResponse<IGameType>> => {
  const pagination_query = paginated_query(page, itemNo);

  const [count, game_types] = await prisma.$transaction([
    Game_Types.count(),
    Game_Types.findMany({
      ...pagination_query,
      include: {
        Games: true
      }
    })
  ]);

  return {
    data: game_types,
    total_count: count
  };
};

const getGameTypeDetailsBySlug = async (slug: string): Promise<IGameType> => {
  const game_type_details = await Game_Types.findUnique({
    where: { slug },
    include: {
      Games: true
    }
  });

  if (!game_type_details) throw new AppError("Game type record not found", 404);

  return game_type_details;
};

export const game_type_service = {
  getGameTypes,
  getGameTypeDetailsBySlug
};
