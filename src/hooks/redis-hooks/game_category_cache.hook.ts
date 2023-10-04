import { ActionRequest, ActionContext, ActionResponse, AppError } from "adminjs";
import { SEARCH_TYPE_CONSTANT, TABLE_NAME_CONSTANT } from "src/common/constant";
import { getKey, prisma, deleteSearchResponse, customGameByCategoryResponse, deleteGameByCategoryCache, removeOldKeys } from "src/utility";

const { gameCategory: GameCategory, games: Games } = prisma;

export const saveGameWithCategoryCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.record && originalResponse.notice && originalResponse.notice.type === "success") {
    const games = await GameCategory.findMany({
      where: {
        id: originalResponse.record.params.GameCategory
      },
      select: {
        name: true,
        slug: true,
        GameByCategory: {
          select: {
            Game: true
          }
        }
      }
    });

    const key = getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_CATEGORY);
    if (originalResponse.record && originalResponse.record.populated.GameCategory && originalResponse.record.populated.GameCategory.params && originalResponse.record.populated.GameCategory.params.slug) {
      const slug = originalResponse.record.populated.GameCategory.params.slug;
      await Promise.all([await deleteSearchResponse(key, slug), await customGameByCategoryResponse(key, slug, games)]);
    }
    return originalResponse;
  }

  return originalResponse;
};

export const updateGameWithCategoryCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.record && originalResponse.notice && originalResponse.notice.type === "success") {
    const games = await GameCategory.findMany({
      where: {
        id: originalResponse.record.params.GameCategory
      },
      select: {
        name: true,
        slug: true,
        GameByCategory: {
          select: {
            Game: true
          }
        }
      }
    });

    const key = getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_CATEGORY);
    if (originalResponse.record && originalResponse.record.populated.GameCategory && originalResponse.record.populated.GameCategory.params && originalResponse.record.populated.GameCategory.params.slug) {
      await deleteGameByCategoryCache(originalResponse.record.params.Game, key);
      const game_categories = await Games.findUnique({
        where: {
          id: originalResponse.record.params.Game
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
        await customGameByCategoryResponse(key, slug.GameCategory.slug as string, games);
      }
    }
  }

  return originalResponse;
};

export const deleteGameWithCategoryCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.record && originalResponse.notice && originalResponse.notice.type === "success") {
    const key = getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_CATEGORY);
    await deleteGameByCategoryCache(originalResponse.record.params.Game, key);
  }

  return originalResponse;
};

export const bulkDeleteGameWithCategoryCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.records && originalResponse.records.length && originalResponse.notice && originalResponse.notice.type === "success") {
    const key = getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_CATEGORY);
    for (let record of originalResponse.records) {
      await deleteGameByCategoryCache(record.params.Game, key);
    }
    return originalResponse;
  }
  return originalResponse;
};

export const deleteGameCategoryCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.record && originalResponse.notice && originalResponse.notice.type === "success") {
    const key = getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_CATEGORY);
    await deleteSearchResponse(key, originalResponse.record.params.slug);
  }

  return originalResponse;
};

export const bulkDeleteGameCategoryCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.records && originalResponse.records.length && originalResponse.notice && originalResponse.notice.type === "success") {
    const key = getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_CATEGORY);
    for (let record of originalResponse.records) {
      await deleteSearchResponse(key, record.params.slug);
    }

    return originalResponse;
  }
  return originalResponse;
};

export const editGameCategoryCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.record && originalResponse.notice && originalResponse.notice.type === "success") {
    const categories = await GameCategory.findMany({ select: { slug: true } });
    const key = getKey(TABLE_NAME_CONSTANT.Games, SEARCH_TYPE_CONSTANT.GAME_CATEGORY);

    const new_keys = categories.map(({ slug }) => slug);
    await removeOldKeys(key, new_keys as string[]);
  }

  return originalResponse;
};
