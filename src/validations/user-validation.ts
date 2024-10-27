// import { Request, Response, NextFunction } from "express";
// import { z, ZodError } from "zod";
// import { StatusCodes } from "http-status-codes";

// import ApiError from "../utils/api-error";
// import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "../utils/validators";

// const userReqUpdateBodySchema = z
//   .object({
//     name: z.string().min(1).max(64).trim().optional(),
//     avatar: z
//       .object({
//         public_id: z.string().trim().default(""),
//         url: z.string().trim().default(""),
//       })
//       .optional(),
//     role: z.enum(["user", "admin"]).optional(),
//     econficiency: z.number().optional(),
//     emailVerified: z.coerce.date().optional(),
//     isBanned: z.boolean().optional(),
//   })
//   .strict();

// type UserReqUpdateBodySchema = z.infer<typeof userReqUpdateBodySchema>;

// const userReqUpdateBody = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     await userReqEmailParamSchema.parseAsync(req.params);
//     await userReqUpdateBodySchema.parseAsync(req.body);

//     next();
//   } catch (error) {
//     if (error instanceof ZodError) {
//       const errorMessages = error.errors
//         .map((issue: any) => `'${issue.path.join(".")}' is ${issue.message}`)
//         .join(". ");

//       next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages));
//     } else {
//       next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
//     }
//   }
// };

// const userReqIdParamSchema = z
//   .object({
//     id: z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE),
//   })
//   .strict();

// const userReqIdParam = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     await userReqIdParamSchema.parseAsync(req.params);

//     next();
//   } catch (error) {
//     if (error instanceof ZodError) {
//       const errorMessages = error.errors
//         .map((issue: any) => `'${issue.path.join(".")}' is ${issue.message}`)
//         .join(". ");

//       next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages));
//     } else {
//       next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
//     }
//   }
// };

// const userReqEmailParamSchema = z
//   .object({
//     id: z.string().email().min(1).trim(),
//   })
//   .strict();

// const userReqEmailParam = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     await userReqEmailParamSchema.parseAsync(req.params);

//     next();
//   } catch (error) {
//     if (error instanceof ZodError) {
//       const errorMessages = error.errors
//         .map((issue: any) => `'${issue.path.join(".")}' is ${issue.message}`)
//         .join(". ");

//       next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages));
//     } else {
//       next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
//     }
//   }
// };

// export default { userReqUpdateBody, userReqIdParam, userReqEmailParam };

// export type { UserReqUpdateBodySchema };
