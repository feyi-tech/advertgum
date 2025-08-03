import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

export const authenticate = async (request, env) => {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Missing or invalid Authorization header', status: 401 };
  }

  const token = authHeader.substring(7);
  const firebaseProjectId = env.FIREBASE_PROJECT_ID;

  if (!firebaseProjectId) {
    return { error: 'Firebase Project ID not configured on backend', status: 500 };
  }

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${firebaseProjectId}`,
      audience: firebaseProjectId,
    });

    return { userId: payload.sub };
  } catch (err) {
    return { error: 'Invalid token', status: 401 };
  }
};
