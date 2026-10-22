import { SignJWT, jwtVerify } from 'jose';

const ALG = 'HS256';
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signToken(payload, expiresIn) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, secretKey, { algorithms: [ALG] });
  return payload;
}