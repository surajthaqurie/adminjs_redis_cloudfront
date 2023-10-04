import { ValidationError, ActionResponse, ActionRequest, ActionContext, AppError } from "adminjs";
import { checkDBUniqueOnEdit, isDbUniqueField, isEmptyQuillJsDescription, isEmptyString } from "./validation.helper";
import { IPageForm } from "src/interfaces";

import { prisma } from "src/utility";
const { pages: Pages } = prisma;

export const pageValidation = (request: ActionRequest, context: ActionContext): ActionRequest => {
  const { payload, method } = request;
  if (payload && method === "post") {
    const errors: Partial<IPageForm> = {};

    if (isEmptyString(payload.name)) {
      errors.name = {
        message: "Name is required"
      };
    }

    if (isEmptyString(payload.image_alternative_text)) {
      errors.image_alternative_text = {
        message: "Image alternative text is required"
      };
    }

    if (isEmptyString(payload.description) || isEmptyQuillJsDescription(payload.description)) {
      errors.description = {
        message: "Description is required"
      };
    }

    if (Object.keys(errors).length) {
      throw new ValidationError(errors);
    }

    return request;
  }

  return request;
};

export const pageResponseMessage = (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): ActionResponse => {
  originalResponse.notice = {
    message: "Successfully created a new page",
    type: "success"
  };
  return originalResponse;
};

export const checkPageUniqueFields = async (request: ActionRequest, context: ActionContext): Promise<ActionRequest> => {
  const { payload, method } = request;
  if (payload && method === "post") {
    const name_taken = await isDbUniqueField(Pages, "slug", payload.slug);
    if (name_taken) throw new AppError(`This name "${payload.name}" is already taken`);

    return request;
  }
  return request;
};

export const checkEditPageUniqueFields = async (request: ActionRequest, context: ActionContext): Promise<ActionRequest> => {
  const { payload, method } = request;
  if (payload && method === "post") {
    const name_taken = await checkDBUniqueOnEdit(Pages, payload.id, "slug", payload.slug);
    if (name_taken) throw new AppError(`This name "${payload.name}" is already taken`);

    return request;
  }
  return request;
};
