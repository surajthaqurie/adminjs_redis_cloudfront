import { IPage, IPaginationResponse } from "src/interfaces";
import { prisma, paginated_query, AppError } from "src/utility";

const { pages: Pages } = prisma;

const getPages = async (
  page: number,
  itemNo: number
): Promise<IPaginationResponse<IPage>> => {
  const pagination_query = paginated_query(page, itemNo);

  const [count, pages] = await prisma.$transaction([
    Pages.count(),
    Pages.findMany({
      ...pagination_query
    })
  ]);

  return {
    data: pages,
    total_count: count
  };
};

const getPageDetailsBySlug = async (slug: string): Promise<IPage> => {
  const page_details = await Pages.findUnique({ where: { slug } });
  if (!page_details) throw new AppError("Page record not found", 404);

  return page_details;
};

export const page_service = {
  getPages,
  getPageDetailsBySlug
};
