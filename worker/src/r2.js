import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export const createPresignedUrl = async (env, key, contentType) => {
  const r2 = new S3Client({
    region: 'auto',
    endpoint: `https://<YOUR_ACCOUNT_ID>.r2.cloudflarestorage.com`, // TODO: User needs to replace <YOUR_ACCOUNT_ID>
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID, // TODO: User needs to add these as secrets
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });

  const command = new PutObjectCommand({
    Bucket: env.BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(r2, command, { expiresIn: 600 }); // 10 minutes
};
