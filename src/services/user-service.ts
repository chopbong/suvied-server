import { StatusCodes } from "http-status-codes";

// import type {
// ? ...
// } from "../validations/user-validation";
import userModel from "../models/user-model";
import ApiError from "../utils/api-error";

const getOneUserByEmail = async (email: string) => {
  try {
    const user = await userModel.getOneUserByEmail(email);

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `No user with email '${email}' found`
      );
    }

    delete user.password;

    return user;
  } catch (error) {
    throw error;
  }
};

export default { getOneUserByEmail };
