import { StatusCodes } from "http-status-codes";

import type { UserReqUpdateBodySchema } from "../validations/user-validation";
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

const updateOneUserByEmail = async (
  email: string,
  reqBody: UserReqUpdateBodySchema
) => {
  try {
    const user = await userModel.getOneUserByEmail(email);

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `No user with email '${email}' found`
      );
    }

    const updateUserData = {
      ...reqBody,
      updated_at: new Date(),
    };

    const updatedUser = await userModel.updateOneUserById(
      user._id,
      updateUserData
    );

    if (!updatedUser) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to update user"
      );
    }

    delete updatedUser.password;

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export default { getOneUserByEmail, updateOneUserByEmail };
