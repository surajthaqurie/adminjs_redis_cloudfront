import { ActionResponse, ActionRequest, ActionContext } from "adminjs";

export const imageName = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.record && originalResponse.record.params && originalResponse.record.params["image.key"]) {
    originalResponse.record.params["image.key"] = originalResponse.record.params["image.filename"];

    return originalResponse;
  }

  return originalResponse;
};

export const galleryImagesName = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  const validGalleryKey = (i = 0) => {
    if (originalResponse.record && originalResponse.record.params[`gallery.key.${i}`]) {
      originalResponse.record.params[`gallery.key.${i}`] = originalResponse.record.params[`gallery.key.${i}`].split("~~")[1];
      i++;
      validGalleryKey(i);
    }
    return originalResponse;
  };

  validGalleryKey();
  return originalResponse;
};
