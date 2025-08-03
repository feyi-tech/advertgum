import { createRemoteJWKSet, jwtVerify } from 'jose';

const FIREBASE_PROJECT_ID = 'YOUR_FIREBASE_PROJECT_ID'; // TODO: Replace with your Firebase project ID
const JWKS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

export const authenticate = async (request) => {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Missing or invalid Authorization header', status: 401 };
  }

  const token = authHeader.substring(7);

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });

    return { userId: payload.sub };
  } catch (err) {
    return { error: 'Invalid token', status: 401 };
  }
};
