import { ActionRequest, ActionContext } from "adminjs";
import { slugify_string } from "../utility";

export const slugify = (request: ActionRequest, context: ActionContext): ActionRequest => {
  const { payload, method } = request;

  if (payload && method === "post") {
    payload.slug = slugify_string(payload.name);
    return request;
  }

  return request;
};

export const pageSectionSlugify = (request: ActionRequest, context: ActionContext): ActionRequest => {
  const { payload, method } = request;

  if (payload && method === "post") {
    const validSectionKey = (i = 0) => {
      if (payload.sections && payload.sections[`${i}`].title) {
        // console.log(payload.sections[`${i}`].title);
        payload.sections[`${i}`].title = slugify_string(payload.sections[`${i}`].title);
        i++;
        validSectionKey(i);
      }
      return request;
    };

    validSectionKey();
  }
  return request;
};
