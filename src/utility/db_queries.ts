export const paginated_queries = (page: number, itemNo: number): { take?: number; skip?: number } => {
  let query: { take?: number; skip?: number } = {};
  if (page && itemNo) {
    query = { take: itemNo, skip: page * itemNo - itemNo };
  } else if (!page && itemNo) {
    query = { take: itemNo };
  }

  return query;
};

export const paginated_query = (page: number, itemNo: number): { take?: number; skip?: number } => {
  let takeItem = itemNo || 10;

  let query: { take?: number; skip?: number } = {};
  if (page && takeItem) {
    query = { take: takeItem, skip: page * takeItem - takeItem };
  } else if (!page && takeItem) {
    query = { take: takeItem };
  }

  return query;
};
