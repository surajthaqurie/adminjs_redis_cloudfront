import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";

export const S3Config = () => {
  try {
    const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || null;
    const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || null;
    const AWS_REGION_S3_BUCKET = process.env.AWS_REGION || null;
    const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || null;

    if (!AWS_ACCESS_KEY_ID) throw new Error("AWS access key id is not set");
    if (!AWS_SECRET_ACCESS_KEY) throw new Error("AWS secret access key is not set");
    if (!AWS_REGION_S3_BUCKET) throw new Error("AWS region S3 bucket is not set");
    if (!AWS_S3_BUCKET) throw new Error("ASW s3 bucket is not set");

    return { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION_S3_BUCKET, AWS_S3_BUCKET };
  } catch (err) {
    throw err;
  }
};

export const getObjects = async () => {
  const input = {
    Bucket: process.env.AWS_S3_BUCKET,
    Prefix: (process.env.APP_NAME as string).toLowerCase()
    // MaxKeys: 5
  };

  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION_S3_BUCKET } = S3Config();
  const client = new S3Client({
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    },
    region: AWS_REGION_S3_BUCKET
  });

  const command = new ListObjectsCommand(input);
  const response = await client.send(command);

  return response;
};
