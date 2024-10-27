import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

import ApiError from "./api-error";

/**
 * Handles validation errors by generating an appropriate `ApiError`.
 *
 * This function checks if the provided error is an instance of `ZodError`.
 * If it is, it maps through the error issues to create a detailed error message
 * indicating which fields are problematic. If the error is not a `ZodError`,
 * a generic internal server error message is returned.
 *
 * @param {any} error - The error object that needs to be handled. This can
 * be an instance of ZodError or any other error type.
 * @returns {ApiError} An instance of `ApiError` containing the appropriate
 * status code and error message.
 *
 * @throws {Error} Will throw if `error.message` is not defined for non-ZodError instances.
 */
export const handleValidationError = (error: any): ApiError => {
  if (error instanceof ZodError) {
    const errorMessages = error.errors
      .map((issue: any) =>
        issue.path.length
          ? `'${issue.path.join(".")}' is ${issue.message}`
          : "All required data is empty"
      )
      .join(". ");

    return new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessages);
  } else {
    return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
