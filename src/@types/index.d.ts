declare global {
  namespace Express {
    export interface Request {
      jwtDecoded?: Record<string, any>;
    }
  }
}

export {};
