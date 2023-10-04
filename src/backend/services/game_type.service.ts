import { TABLE_NAME_CONSTANT } from "src/common/constant";
import { IGameType, IPaginationResponse } from "src/interfaces";
import { prisma, AppError, getListResponses, getKey, parseStringifyResponses, customListResponses, getData, customDetailsResponse } from "src/utility";

const { gameTypes: Game_Types } = prisma;

const getGameTypes = async (page: number, itemNo: number): Promise<IPaginationResponse<IGameType>> => {
  // const pagination_query = paginated_query(page, itemNo);

  const game_type_key = getKey(TABLE_NAME_CONSTANT.GameTypes);

  const get_cached_data = await getListResponses(game_type_key);
  if (get_cached_data.length) {
    const custom_data = parseStringifyResponses(get_cached_data);
    return {
      total_count: custom_data.length,
      data: custom_data
    };
  }

  const [count, game_types] = await prisma.$transaction([
    Game_Types.count(),
    Game_Types.findMany({
      /* ...pagination_query */
      // include: {
      //   Games: true
      // }
    })
  ]);

  const custom_data = await customListResponses(TABLE_NAME_CONSTANT.GameTypes, game_types);
  return {
    data: custom_data,
    total_count: count
  };
};

const getGameTypeDetailsBySlug = async (slug: string): Promise<IGameType> => {
  const game_type_key = getKey(TABLE_NAME_CONSTANT.GameTypes, slug);

  const cached_data = await getData(game_type_key);
  if (cached_data) return JSON.parse(cached_data);

  const game_type = await Game_Types.findUnique({ where: { slug } /* , include: { Games: true } */ });
  if (!game_type) throw new AppError("Game type record not found", 404);

  const custom_data = await customDetailsResponse(TABLE_NAME_CONSTANT.GameTypes, slug, game_type);
  return custom_data;
};

export const game_type_service = {
  getGameTypes,
  getGameTypeDetailsBySlug
};
