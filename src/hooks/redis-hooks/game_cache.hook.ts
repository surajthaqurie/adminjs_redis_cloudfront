import { ActionRequest, ActionContext, ActionResponse, AppError } from "adminjs";
import { customDetailsResponse, deleteCacheData, getKey, prisma, saveListResponses, saveUniqueSearchCache, saveSimilarSearchCache, deleteSearchCache, deleteGameByCategoryCache, updateGameByCategoryCache } from "src/utility";

import { SEARCH_TYPE_CONSTANT, TABLE_NAME_CONSTANT } from "src/common/constant";
const { games: Games } = prisma;

export const saveGameCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.record && originalResponse.notice && originalResponse.notice.type === "success") {
    const game = await Games.findUnique({
      where: { id: originalResponse.record.id },
      include: {
        GameTypes: {
          select: {
            id: true,
            name: true,
            description: true,
            image: true,
            image_alternative_text: true,
            orders: true,
            slug: true
          }
        }
      }
    });

    if (!game) throw new AppError("Something went wrong please refresh once");

    const response = await customDetailsResponse(TABLE_NAME_CONSTANT.Games, game.id, game);
    await saveListResponses(getKey(TABLE_NAME_CONSTANT.Games), response);

    // search - filter
    await saveSimilarSearchCache(getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME), game.name, response);

    if (game.GameTypes && game.GameTypes.slug) {
      const game_type = game.GameTypes.slug;
      await saveUniqueSearchCache(getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_TYPE), game_type, response);

      return originalResponse;
    }
  }
  return originalResponse;
};

export const updateGameCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.record && originalResponse.notice && originalResponse.notice.type === "success") {
    const game = await Games.findUnique({
      where: { id: originalResponse.record.id },
      include: {
        GameTypes: {
          select: {
            id: true,
            name: true,
            description: true,
            image: true,
            image_alternative_text: true,
            orders: true,
            slug: true
          }
        }
      }
    });

    if (!game) throw new AppError("Something went wrong please refresh once");

    await Promise.all([
      deleteCacheData(game.id, TABLE_NAME_CONSTANT.Games, game.slug),
      // search
      deleteSearchCache(game.id, getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME)),
      deleteGameByCategoryCache(game.id, getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_CATEGORY))
    ]);

    const response = await customDetailsResponse(TABLE_NAME_CONSTANT.Games, game.id, game);
    await Promise.all([
      saveListResponses(getKey(TABLE_NAME_CONSTANT.Games), response),
      // search
      saveSimilarSearchCache(getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME), game.name, response)
    ]);

    if (game.GameTypes && game.GameTypes.slug) {
      const game_type = game.GameTypes.slug;
      await deleteSearchCache(game.id, getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_TYPE));
      await saveUniqueSearchCache(getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_TYPE), game_type, response);
    }

    const game_categories = await Games.findUnique({
      where: {
        id: game.id
      },
      select: {
        GameByCategory: {
          select: {
            GameCategory: {
              select: {
                slug: true
              }
            }
          }
        }
      }
    });

    if (!game_categories) throw new AppError("Something went wrong please refresh once");

    for (let slug of game_categories.GameByCategory) {
      await updateGameByCategoryCache(getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_CATEGORY), slug.GameCategory.slug as string, response);
    }

    return originalResponse;
  }
  return originalResponse;
};

export const deleteGameCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.record && originalResponse.notice && originalResponse.notice.type === "success") {
    await Promise.all([
      deleteCacheData(originalResponse.record.id, TABLE_NAME_CONSTANT.Games, originalResponse.record.params.slug),
      // search-filter
      deleteSearchCache(originalResponse.record.id, getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME)),
      deleteSearchCache(originalResponse.record.id, getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_TYPE)),
      deleteGameByCategoryCache(originalResponse.record.id, getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_CATEGORY))
    ]);

    return originalResponse;
  }
  return originalResponse;
};

export const bulkDeleteGameCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.records && originalResponse.records.length && originalResponse.notice && originalResponse.notice.type === "success") {
    for (let record of originalResponse.records) {
      await Promise.all([
        deleteCacheData(record.id, TABLE_NAME_CONSTANT.Games, record.params.slug),
        // search-filter
        deleteSearchCache(record.id, getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME)),
        deleteSearchCache(record.id, getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_TYPE)),
        deleteGameByCategoryCache(record.id, getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_CATEGORY))
      ]);
    }
    return originalResponse;
  }

  return originalResponse;
};
