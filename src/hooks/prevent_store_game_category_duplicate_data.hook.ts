import { ActionRequest, ActionContext, AppError } from "adminjs";
import { prisma } from "../utility";

const { gameByCategory: GameByCategory } = prisma;

export const preventStoreGameCategoryDuplicationData = async (request: ActionRequest, context: ActionContext): Promise<ActionRequest> => {
  const { payload, method } = request;
  if (payload && method === "post") {
    const is_duplicate = await GameByCategory.findFirst({
      where: {
        categoryId: payload.GameCategory,
        gameId: payload.Game
      },
      select: {
        Game: {
          select: {
            name: true
          }
        },
        GameCategory: {
          select: {
            name: true
          }
        }
      }
    });

    if (is_duplicate) throw new AppError(`The game ${is_duplicate.Game.name} is already assigned with the category ${is_duplicate.GameCategory.name}.`);

    return request;
  }

  return request;
};
