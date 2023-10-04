import { ActionContext, ActionRequest, ValidationError } from "adminjs";
import { isEmptyString } from "./validation.helper";
import { IAddGameWithCategoryForm } from "src/interfaces";

export const addGameWithCategoryValidation = (request: ActionRequest, context: ActionContext): ActionRequest => {
  const { payload, method } = request;
  if (payload && method === "post") {
    const errors: Partial<IAddGameWithCategoryForm> = {};

    if (isEmptyString(payload.Game)) {
      errors.Game = {
        message: "Game is required"
      };
    }

    if (isEmptyString(payload.GameCategory)) {
      errors.GameCategory = {
        message: "Game category is required"
      };
    }

    if (Object.keys(errors).length) {
      throw new ValidationError(errors);
    }

    return request;
  }

  return request;
};
