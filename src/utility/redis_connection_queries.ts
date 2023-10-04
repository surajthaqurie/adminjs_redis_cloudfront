import { createClient } from "redis";

export const redisClientInit = () => {
  try {
    const REDIS_CONNECTION_URL = process.env.REDIS_CONNECTION_URL || null;
    if (!REDIS_CONNECTION_URL) throw new Error("Redis connection url is not set");

    const client = createClient({ url: process.env.REDIS_CONNECTION_URL as string });
    client.connect();
    client.on("ready", () => {
      console.log("Redis connection successfully !!");
    });

    client.on("error", (err) => {
      console.log("Redis Client Connection Error: ", err);
    });

    return client;
  } catch (error) {
    throw error;
  }
};

const redisClient = redisClientInit();

/* String-base data */
export const saveData = async (key: string, data: any, timeout = 60 * 60 * 3): Promise<string | null> => {
  try {
    if (typeof data === "object") data = JSON.stringify(data);
    const response = await redisClient.SET(key, data);
    await redisClient.expire(key, timeout);
    return response;
  } catch (err) {
    throw err;
  }
};

export const getData = async (key: string): Promise<string | null> => {
  try {
    return await redisClient.GET(key);
  } catch (err) {
    throw err;
  }
};

export const deleteData = async (key: string): Promise<number> => {
  try {
    return await redisClient.DEL(key);
  } catch (err) {
    throw err;
  }
};

/* List-base data */
export const saveListResponses = async (key: string, data: any, timeout = 60 * 60 * 3): Promise<number> => {
  try {
    if (typeof data === "object") data = JSON.stringify(data);
    const response = await redisClient.SADD(key, data);
    await redisClient.expire(key, timeout);
    return response;
  } catch (err) {
    throw err;
  }
};

export const getListResponses = async (key: string): Promise<string[]> => {
  try {
    const response = await redisClient.SMEMBERS(key);
    return response;
  } catch (err) {
    throw err;
  }
};

export const getListResponseDetails = async (key: string, data: any): Promise<boolean> => {
  try {
    if (typeof data === "object") data = JSON.stringify(data);
    const response = await redisClient.SISMEMBER(key, data);
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteListData = async (key: string, data: any): Promise<number> => {
  try {
    if (typeof data === "object") data = JSON.stringify(data);
    const response = await redisClient.SREM(key, data);
    return response;
  } catch (err) {
    throw err;
  }
};

/* Search-base data */
export const saveSearchResponse = async (key: string, query: string, data: any, timeout = 60 * 60 * 3): Promise<number> => {
  try {
    if (typeof data === "object") data = JSON.stringify(data);

    const response = await redisClient.HSET(key, query.toLowerCase(), data);
    await redisClient.expire(key, timeout);

    return response;
  } catch (err) {
    throw err;
  }
};

export const getSearchResponse = async (key: string, query: string): Promise<string | undefined> => {
  try {
    const response = await redisClient.HGET(key, query.toLowerCase());
    return response;
  } catch (err) {
    throw err;
  }
};

export const deleteSearchResponse = async (key: string, query: string): Promise<number> => {
  try {
    const response = redisClient.HDEL(key, query.toLowerCase());
    return response;
  } catch (err) {
    throw err;
  }
};

export const getSearchKeys = async (key: string): Promise<string[]> => {
  try {
    const response = await redisClient.HKEYS(key);
    return response;
  } catch (err) {
    throw err;
  }
};

export const getSearchKeyResponse = async (key: string): Promise<{ [key: string]: string }> => {
  try {
    const responses = await redisClient.HGETALL(key);
    return responses;
  } catch (err) {
    throw err;
  }
};
