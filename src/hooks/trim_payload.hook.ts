import { ActionRequest, ActionContext } from "adminjs";

export const payloadTrim = (
  request: ActionRequest,
  context: ActionContext
): ActionRequest => {
  const { payload, method } = request;

  if (payload && method === "post") {
    for (const property in payload) {
      if (typeof property === "string") {
        payload[property] = payload[property] && payload[property].trim();
      }
    }

    return request;
  }

  return request;
};
