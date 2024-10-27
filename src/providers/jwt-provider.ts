import jwt, { Secret } from "jsonwebtoken";

const generateToken = async (
  payload: any,
  secretKey: Secret,
  tokenLife: string | number
) => {
  try {
    return jwt.sign(payload, secretKey, {
      algorithm: "HS256",
      expiresIn: tokenLife,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const verifyToken = async (token: string, secretKey: Secret) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error(error);
  }
};

export default { generateToken, verifyToken };
