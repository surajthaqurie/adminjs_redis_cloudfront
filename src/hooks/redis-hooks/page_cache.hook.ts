import { ActionRequest, ActionContext, ActionResponse, AppError } from "adminjs";
import { customDetailsResponse, deleteCacheData, getKey, prisma, saveListResponses } from "src/utility";
import { TABLE_NAME_CONSTANT } from "src/common/constant";

const { pages: Pages } = prisma;

export const savePageCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.record && originalResponse.notice && originalResponse.notice.type === "success") {
    const page = await Pages.findUnique({ where: { id: originalResponse.record.id } });
    if (!page) throw new AppError("Something went wrong please refresh once");

    const response = await customDetailsResponse(TABLE_NAME_CONSTANT.Pages, page.id, page);
    await saveListResponses(getKey(TABLE_NAME_CONSTANT.Pages), response);
  }
  return originalResponse;
};

export const updatePageCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.record && originalResponse.notice && originalResponse.notice.type === "success") {
    const page = await Pages.findUnique({ where: { id: originalResponse.record.id } });
    if (!page) throw new AppError("Something went wrong please refresh once");

    await deleteCacheData(page.id, TABLE_NAME_CONSTANT.Pages, page.slug);
    const response = await customDetailsResponse(TABLE_NAME_CONSTANT.Pages, page.id, page);
    await saveListResponses(getKey(TABLE_NAME_CONSTANT.Pages), response);

    return originalResponse;
  }
  return originalResponse;
};

export const deletePageCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.record && originalResponse.notice && originalResponse.notice.type === "success") {
    await deleteCacheData(originalResponse.record.id, TABLE_NAME_CONSTANT.Pages, originalResponse.record.params.slug);

    return originalResponse;
  }
  return originalResponse;
};

export const bulkDeletePageCache = async (originalResponse: ActionResponse, request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
  if (originalResponse.records && originalResponse.records.length && originalResponse.notice && originalResponse.notice.type === "success") {
    for (let record of originalResponse.records) {
      await deleteCacheData(record.id, TABLE_NAME_CONSTANT.Pages, record.params.slug);
    }
    return originalResponse;
  }

  return originalResponse;
};
