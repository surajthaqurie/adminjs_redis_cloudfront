import { ActionContext, ActionRequest, AppError, ValidationError } from "adminjs";
import { checkDBUniqueOnEdit, isDbUniqueField, isEmptyQuillJsDescription, isEmptyString } from "./validation.helper";
import { IGameForm } from "src/interfaces";

import { prisma } from "src/utility";
const { games: Games } = prisma;

export const gameValidation = (request: ActionRequest, context: ActionContext): ActionRequest => {
  const { payload, method } = request;
  if (payload && method === "post") {
    const errors: Partial<IGameForm> = {};

    if (isEmptyString(payload.name)) {
      errors.name = {
        message: "Name is required"
      };
    }

    if (isEmptyString(payload.description) || isEmptyQuillJsDescription(payload.description)) {
      errors.description = {
        message: "Description is required"
      };
    }

    if (isEmptyString(payload.image_alternative_text)) {
      errors.image_alternative_text = {
        message: "Image alternative text is required"
      };
    }

    if (isEmptyString(payload.gallery_alternative_text)) {
      errors.gallery_alternative_text = {
        message: "Gallery alternative text is required"
      };
    }

    if (isEmptyString(payload.GameTypes)) {
      errors.GameTypes = {
        message: "Game Types is required"
      };
    }

    if (Object.keys(errors).length) {
      throw new ValidationError(errors);
    }

    return request;
  }

  return request;
};

export const checkGameUniqueFields = async (request: ActionRequest, context: ActionContext): Promise<ActionRequest> => {
  const { payload, method } = request;
  if (payload && method === "post") {
    const name_taken = await isDbUniqueField(Games, "slug", payload.slug);
    if (name_taken) throw new AppError(`This name "${payload.name}" is already taken`);

    return request;
  }
  return request;
};

export const checkEditGameUniqueFields = async (request: ActionRequest, context: ActionContext): Promise<ActionRequest> => {
  const { payload, method } = request;
  if (payload && method === "post") {
    const name_taken = await checkDBUniqueOnEdit(Games, payload.id, "slug", payload.slug);
    if (name_taken) throw new AppError(`This name "${payload.name}" is already taken`);

    return request;
  }
  return request;
};
