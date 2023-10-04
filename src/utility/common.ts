export function getKey(...subKeys: string[]) {
  let key = process.env.APP_NAME as string;
  for (let arg of subKeys) {
    key = key.concat(":", arg);
  }

  return key;
}
