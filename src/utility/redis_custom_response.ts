import { generateFileSignedUrl } from "./cloudfront_config";
import { getKey } from "./common";
import { deleteData, deleteListData, deleteSearchResponse, getData, getListResponses, getSearchKeyResponse, getSearchKeys, getSearchResponse, saveData, saveListResponses, saveSearchResponse } from "./redis_connection_queries";

export const parseStringifyResponses = (responses: Array<string>) => {
  let custom_data: any[] = [];
  for (let data of responses) {
    custom_data = [JSON.parse(data), ...custom_data];
  }

  return custom_data;
};

export const customDetailsResponse = async (parent_key: string, key: string, data: any) => {
  const signedURL_data = await convertSignURLData(data);
  await saveData(getKey(parent_key, key), signedURL_data);
  // TODO: check In Array(SET) if not save
  return signedURL_data;
};

export const customListResponses = async (key: string, responses: Array<any>) => {
  let custom_data: any[] = [];
  for (let data of responses) {
    const signedURL_data = await convertSignURLData(data);
    custom_data = [signedURL_data, ...custom_data];

    await saveData(getKey(key, signedURL_data.id), signedURL_data);
    if (signedURL_data.slug) await saveData(getKey(key, signedURL_data.slug), signedURL_data);
    await saveListResponses(getKey(key), signedURL_data);
  }

  return custom_data;
};

export const deleteCacheData = async (id: string, list_key: string, slug: null | string = null): Promise<boolean> => {
  let cache_slug_data;

  if (slug) cache_slug_data = await getData(getKey(list_key, slug));
  const cache_id_data = await getData(getKey(list_key, id));
  const cache_data = cache_id_data || cache_slug_data;
  if (cache_data) {
    if (slug) await deleteData(getKey(list_key, slug));
    await Promise.all([deleteData(getKey(list_key, id)), deleteListData(getKey(list_key), cache_data)]);

    return true;
  } else {
    const list_responses = await getListResponses(getKey(list_key));
    if (list_responses.length) {
      const responses = parseStringifyResponses(list_responses);
      for (let [index, data] of responses.entries()) {
        if ((data as { id: string }).id === id) {
          await deleteListData(getKey(list_key), list_responses[index]);

          continue;
        }
      }
    }

    return true;
  }
};

export const customSearchResponse = async (key: string, query: string, responses: Array<any>) => {
  let custom_data: any[] = [];

  for (let data of responses) {
    const signedURL_data = await convertSignURLData(data);
    custom_data = [signedURL_data, ...custom_data];
  }

  if (custom_data.length) await saveSearchResponse(key, query, custom_data);

  return custom_data;
};

export const saveUniqueSearchCache = async (key: string, query: string, data: any) => {
  const get_search_data = await getSearchResponse(key, query);
  if (!get_search_data) {
    await saveSearchResponse(key, query, [data]);

    return true;
  }

  const search_data = [data, ...JSON.parse(get_search_data as string)];
  await saveSearchResponse(key, query, search_data);

  return true;
};

export const saveSimilarSearchCache = async (key: string, query: string, data: any) => {
  const search_keys = await getSearchKeys(key);
  if (!search_keys.length) {
    await saveSearchResponse(key, query, [data]);

    return true;
  }

  for (let searchKey of search_keys) {
    if (query.toLowerCase().indexOf(searchKey) !== -1) {
      const get_search_data = await getSearchResponse(key, searchKey);
      if (get_search_data) {
        const search_data = [data, ...JSON.parse(get_search_data as string)];
        await saveSearchResponse(key, searchKey, search_data);
      }
    }
  }

  return true;
};

export const deleteSearchCache = async (id: string, key: string): Promise<boolean> => {
  const search_keys = await getSearchKeyResponse(key);
  if (!search_keys) {
    return true;
  }

  for (let [searchKey, response] of Object.entries(search_keys)) {
    const search_data = JSON.parse(response);
    for (let [index, data] of search_data.entries()) {
      if (data.id === id) {
        await deleteSearchResponse(key, searchKey);
        search_data.splice(index, 1);
      }
    }

    if (search_data.length) {
      await saveSearchResponse(key, searchKey, search_data);
    }
  }
  return true;
};

export const customGameByCategoryResponse = async (key: string, query: string, response: any) => {
  for (let [mainIndex, game] of response.entries()) {
    for (let [index, data] of game.GameByCategory.entries()) {
      const signedUrl = await convertSignURLData(data.Game);
      response[mainIndex].GameByCategory[index].Game = signedUrl;
    }
  }

  if (response.length) await saveSearchResponse(key, query, response);
  return response;
};

export const updateGameByCategoryCache = async (key: string, query: string, data: any): Promise<boolean> => {
  const cache_data = await getSearchResponse(key, query);
  if (!cache_data) {
    return true;
  }

  let search_data = JSON.parse(cache_data);
  delete data.GameTypes;

  //@ts-expect-error
  for (let [mainIndex, game] of search_data.entries()) {
    search_data[mainIndex].GameByCategory = [{ Game: data }, ...search_data[mainIndex].GameByCategory];
  }

  await saveSearchResponse(key, query, search_data);
  return true;
};

export const deleteGameByCategoryCache = async (id: string, key: string): Promise<boolean> => {
  const search_keys = await getSearchKeyResponse(key);
  if (!search_keys) {
    return true;
  }

  for (let [searchKey, response] of Object.entries(search_keys)) {
    let search_data = JSON.parse(response);
    for (let [mainIndex, game] of search_data.entries()) {
      for (let [index, data] of game.GameByCategory.entries()) {
        if (data.Game.id === id) {
          await deleteSearchResponse(key, searchKey);
          search_data[mainIndex].GameByCategory.splice(index, 1);
        }
      }

      if (search_data.length) await saveSearchResponse(key, searchKey, search_data);
    }
  }
  return true;
};

export const removeOldKeys = async (key: string, newKeys: string[]): Promise<boolean> => {
  const search_keys = await getSearchKeyResponse(key);
  if (!search_keys) {
    return true;
  }

  //@ts-expect-error
  for (let [searchKey, response] of Object.entries(search_keys)) {
    if (newKeys.indexOf(searchKey) === -1) {
      await deleteSearchResponse(key, searchKey);
    }
  }
  return true;
};

const convertSignURLData = async (data: { id: string; slug?: string; image: { key: string }; gallery: { key: string[] }; GameTypes: { image: { key: string } }; FAQCategory: { image: { key: string } } } | any) => {
  if (data.image) {
    const signedUrl = await generateFileSignedUrl(data.image.key);
    data.image.key = signedUrl;
  }

  if (data.gallery) {
    data.gallery.key.forEach(async (filepath: string, index: number) => {
      const signedUrl = await generateFileSignedUrl(filepath);
      if (data.gallery) {
        data.gallery.key[index] = signedUrl;
      }
    });
  }

  if (data.GameTypes) {
    if (data.GameTypes.image) {
      const signedUrl = await generateFileSignedUrl(data.GameTypes.image.key);
      data.GameTypes.image.key = signedUrl;
    }
  }

  if (data.FAQCategory) {
    if (data.FAQCategory.image) {
      const signedUrl = await generateFileSignedUrl(data.FAQCategory.image.key);
      data.FAQCategory.image.key = signedUrl;
    }
  }

  return data;
};

// TODO: Implement Redis---
export const customByCategoryResponse = async (key: string, query: string, response: any) => {
  // let custom_data: any[] = [];

  for (let [mainIndex, data] of response.entries()) {
    for (let [index, game] of data.GameByCategory.entries()) {
      if (game.Game) {
        const signedURL_data = await convertSignURLData(game.Game);
        response[mainIndex].GameByCategory[index].game = signedURL_data;
        // custom_data = [response, ...custom_data];
      }
    }
  }

  // if (custom_data.length) await saveSearchResponse(key, query, custom_data);
  return response;
};
