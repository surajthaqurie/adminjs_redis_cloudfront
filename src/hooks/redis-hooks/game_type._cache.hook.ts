import { ActionRequest, ActionContext, ActionResponse, AppError } from "adminjs";
import { customDetailsResponse, deleteCacheData, getKey, prisma, removeOldKeys, saveListResponses } from "src/utility";
import { SEARCH_TYPE_CONSTANT, TABLE_NAME_CONSTANT } from "src/common/constant";
const { gameTypes: Game_Types, games: Games } = prisma;

export const saveGameTypeCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.record && originalResponse.notice && originalResponse.notice.type === "success") {
    const game_type = await Game_Types.findUnique({ where: { id: originalResponse.record.id } });
    if (!game_type) throw new AppError("Something went wrong please refresh once");

    const response = await customDetailsResponse(TABLE_NAME_CONSTANT.GameTypes, game_type.id, game_type);
    await saveListResponses(getKey(TABLE_NAME_CONSTANT.GameTypes), response);
  }
  return originalResponse;
};

export const updateGameTypeCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.record && originalResponse.notice && originalResponse.notice.type === "success") {
    const game_type = await Game_Types.findUnique({ where: { id: originalResponse.record.id } });
    if (!game_type) throw new AppError("Something went wrong please refresh once");

    await deleteCacheData(game_type.id, TABLE_NAME_CONSTANT.GameTypes, game_type.slug);
    const response = await customDetailsResponse(TABLE_NAME_CONSTANT.GameTypes, game_type.id, game_type);
    await saveListResponses(getKey(TABLE_NAME_CONSTANT.GameTypes), response);

    // remove old_keys
    const game_types = await Game_Types.findMany({ select: { slug: true } });
    const new_keys = game_types.map(({ slug }) => slug);

    await removeOldKeys(getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_TYPE), new_keys as string[]);

    return originalResponse;
  }
  return originalResponse;
};

export const deleteGameTypeCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.record && originalResponse.notice && originalResponse.notice.type === "success") {
    await deleteCacheData(originalResponse.record.id, TABLE_NAME_CONSTANT.GameTypes, originalResponse.record.params.slug);

    return originalResponse;
  }
  return originalResponse;
};

export const bulkDeleteGameTypeCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.records && originalResponse.records.length && originalResponse.notice && originalResponse.notice.type === "success") {
    for (let record of originalResponse.records) {
      await deleteCacheData(record.id, TABLE_NAME_CONSTANT.GameTypes, record.params.slug);
    }
    return originalResponse;
  }
  return originalResponse;
};

export const preventUsedDelete = async (request: ActionRequest, context: ActionContext): Promise<ActionRequest> => {
  const game = await Games.findMany({ where: { game_type: request.params.recordId } });
  if (game.length) throw new AppError(`Unable to delete game type, because it is used !!`);

  return request;
};
