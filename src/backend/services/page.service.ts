import { TABLE_NAME_CONSTANT } from "src/common/constant";
import { IPage, IPaginationResponse } from "src/interfaces";
import { prisma, AppError, getListResponses, getKey, parseStringifyResponses, customListResponses, getData, pageDetailsCustomResponse, customDetailsResponse } from "src/utility";

const { pages: Pages } = prisma;

const getPages = async (page: number, itemNo: number): Promise<IPaginationResponse<IPage>> => {
  // const pagination_query = paginated_query(page, itemNo);

  const cached_data = await getListResponses(getKey(TABLE_NAME_CONSTANT.Pages));
  if (cached_data.length) {
    const custom_data = parseStringifyResponses(cached_data);

    return { total_count: custom_data.length, data: custom_data };
  }

  const [count, pages] = await prisma.$transaction([
    Pages.count(),
    Pages.findMany({
      // ...pagination_query
    })
  ]);

  const custom_data = await customListResponses(TABLE_NAME_CONSTANT.Pages, pages);
  return {
    data: custom_data,
    total_count: count
  };
};

const getPageDetailsBySlug = async (slug: string): Promise<IPage> => {
  const cached_data = await getData(getKey(TABLE_NAME_CONSTANT.Pages, slug));
  if (cached_data) {
    const page_details_custom_response = pageDetailsCustomResponse(JSON.parse(cached_data));

    return page_details_custom_response;
  }

  const page = await Pages.findUnique({ where: { slug } });
  if (!page) throw new AppError("Page record not found", 404);

  const custom_data = await customDetailsResponse(TABLE_NAME_CONSTANT.Pages, slug, page);
  const page_details_custom_response = pageDetailsCustomResponse(custom_data);

  return page_details_custom_response;
};

export const page_service = {
  getPages,
  getPageDetailsBySlug
};
