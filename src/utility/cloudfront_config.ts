import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const cloudfrontConfig = () => {
  try {
    const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL || null;
    const CLOUDFRONT_ACCESS_KEY_ID = process.env.CLOUDFRONT_ACCESS_KEY_ID || null;
    const CLOUDFRONT_PRIVATE_KEY = process.env.CLOUDFRONT_PRIVATE_KEY || null;

    if (!CLOUDFRONT_URL) throw new Error("Cloud front url is not set");
    if (!CLOUDFRONT_ACCESS_KEY_ID) throw new Error("Cloud front access key Id is not set");
    if (!CLOUDFRONT_PRIVATE_KEY) throw new Error("Cloud front private key is not set");

    return { CLOUDFRONT_URL, CLOUDFRONT_ACCESS_KEY_ID, CLOUDFRONT_PRIVATE_KEY };
  } catch (err) {
    throw err;
  }
};

export const generateFileSignedUrl = (filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const { CLOUDFRONT_URL, CLOUDFRONT_ACCESS_KEY_ID, CLOUDFRONT_PRIVATE_KEY } = cloudfrontConfig();

      const options = {
        url: CLOUDFRONT_URL + filename,
        keyPairId: CLOUDFRONT_ACCESS_KEY_ID,
        privateKey: CLOUDFRONT_PRIVATE_KEY,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString() // Expires in 3 hours
      };

      const signedUrl = getSignedUrl(options);

      resolve(signedUrl);
    } catch (err) {
      reject(err);
    }
  });
};
