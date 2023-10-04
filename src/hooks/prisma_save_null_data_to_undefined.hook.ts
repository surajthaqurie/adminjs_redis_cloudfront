import { ActionRequest, ActionContext } from "adminjs";

export const prismaSaveNullDataToUndefined = (request: ActionRequest, context: ActionContext): ActionRequest => {
  const { payload, method } = request;
  if (payload && method === "post") {
    if (payload.sections === null) {
      payload.sections = undefined;
    }

    if (payload.meta_box === null) {
      payload.meta_box = undefined;
    }

    return request;
  }
  return request;
};
