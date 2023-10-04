import { ActionContext, ActionRequest, AppError, ValidationError } from "adminjs";
import { checkDBUniqueOnEdit, isDbUniqueField, isEmptyString } from "./validation.helper";
import { IGameCategoryForm } from "src/interfaces";

import { prisma } from "src/utility";
const { gameCategory: GameCategory } = prisma;

export const gameCategoryValidation = (request: ActionRequest, context: ActionContext): ActionRequest => {
  const { payload, method } = request;
  if (payload && method === "post") {
    const errors: Partial<IGameCategoryForm> = {};

    if (isEmptyString(payload.name)) {
      errors.name = {
        message: "Name is required"
      };
    }

    if (Object.keys(errors).length) {
      throw new ValidationError(errors);
    }

    return request;
  }

  return request;
};

export const checkGameCategoryUniqueFields = async (request: ActionRequest, context: ActionContext): Promise<ActionRequest> => {
  const { payload, method } = request;
  if (payload && method === "post") {
    const name_taken = await isDbUniqueField(GameCategory, "slug", payload.slug);
    if (name_taken) throw new AppError(`This name "${payload.name}" is already taken`);

    return request;
  }
  return request;
};

export const checkEditGameCategoryUniqueFields = async (request: ActionRequest, context: ActionContext): Promise<ActionRequest> => {
  const { payload, method } = request;
  if (payload && method === "post") {
    const name_taken = await checkDBUniqueOnEdit(GameCategory, payload.id, "slug", payload.slug);
    if (name_taken) throw new AppError(`This name "${payload.name}" is already taken`);

    return request;
  }
  return request;
};
