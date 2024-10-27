import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

import type {
  RegisterReqBodySchema,
  LoginReqBodySchema,
  VerifyReqBodySchema,
  ResetReqBodySchema,
} from "../validations/authentication-validation";
import userModel from "../models/user-model";
import verificationModel from "../models/verification-model";
import passwordResetModel from "../models/password-reset-model";
import { env } from "../config/environment";
import ApiError from "../utils/api-error";
import { sendMail } from "../providers/nodemailer-provider";

const register = async (reqBody: RegisterReqBodySchema) => {
  try {
    const { name, email } = reqBody;

    const existedUser = await userModel.getOneUserByEmail(email);

    if (existedUser) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `User with email '${email}' already exists`
      );
    }

    const hashedPassword = await bcrypt.hash(reqBody.password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    const createResult = await userModel.createOneUser(newUser);

    if (!createResult.acknowledged) {
      throw new Error("Failed to create user");
    }

    const createdUser = await userModel.getOneUserById(createResult.insertedId);

    if (!createdUser) {
      throw new Error("Failed to get created user");
    }

    // * IMPORTANT: Do not allow password exposed to client
    delete createdUser.password;

    return createdUser;
  } catch (error) {
    throw error;
  }
};

const login = async (reqBody: LoginReqBodySchema) => {
  try {
    const { email } = reqBody;

    const user = await userModel.getOneUserByEmail(email);

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `User with email '${email}' haven't existed yet`
      );
    }

    const isPasswordMatched = await bcrypt.compare(
      reqBody.password,
      user.password
    );

    if (!isPasswordMatched) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    // * IMPORTANT: Do not allow password exposed to client
    delete user.password;

    return user;
  } catch (error) {
    throw error;
  }
};

const sendVerificationMail = async (userEmail: string) => {
  try {
    const user = await userModel.getOneUserByEmail(userEmail);

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `No user with email '${userEmail}' found to verify`
      );
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const verificationToken = await bcrypt.hash(verificationCode, 10);

    await verificationModel.createOneVerification({
      token: verificationToken,
      user_id: user._id.toString(),
      expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    });

    const data = { user: { name: user.name }, verificationCode };

    await sendMail({
      email: user.email,
      subject: "Verification your account",
      template: "verification-mail.ejs",
      data,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

const verifyOneUserByEmail = async (
  userEmail: string,
  reqBody: VerifyReqBodySchema
) => {
  try {
    const user = await userModel.getOneUserByEmail(userEmail);

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `No user with email '${userEmail}' found to verify`
      );
    }

    const verification = await verificationModel.getOneVerificationByUserId(
      user._id
    );

    if (!verification) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No verification found");
    }

    const { token, expires_at } = verification;

    if (expires_at < Date.now()) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Verification code has expired"
      );
    }

    const isCodeMatched = await bcrypt.compare(reqBody.verificationCode, token);

    if (!isCodeMatched) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "Verification code is not matched"
      );
    }

    await verificationModel.deleteManyVerificationsByUserId(user._id);

    const verifiedUser = await userModel.updateOneUserById(user._id, {
      email_verified: new Date(),
    });

    if (!verifiedUser) {
      throw new Error("Failed to verify user");
    }

    delete verifiedUser.password;

    return verifiedUser;
  } catch (error) {
    throw error;
  }
};

const sendPasswordResetMail = async (userEmail: string) => {
  try {
    const user = await userModel.getOneUserByEmail(userEmail);

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `No user with email '${userEmail}' found to verify`
      );
    }

    const token = uuidv4();

    await passwordResetModel.createOnePasswordReset({
      token: token,
      user_id: user._id.toString(),
      expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    const passwordResetUrl = `${env.ORIGIN}/auth/new-password?token=${token}`;

    const data = { user: { name: user.name }, passwordResetUrl };

    await sendMail({
      email: user.email,
      subject: "Forgot your password",
      template: "password-reset-mail.ejs",
      data,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (reqBody: ResetReqBodySchema) => {
  try {
    const passwordReset = await passwordResetModel.getOnePasswordResetByToken(
      reqBody.token
    );

    if (!passwordReset) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Invalid password reset token`);
    }

    const { userId, expires_at } = passwordReset;

    if (expires_at < Date.now()) {
      throw new ApiError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Password reset token has expired"
      );
    }

    await passwordResetModel.deleteManyPasswordResetsByUserId(userId);

    const hashedNewPassword = await bcrypt.hash(reqBody.newPassword, 10);

    const passwordResetUser = await userModel.updateOneUserById(userId, {
      password: hashedNewPassword,
    });

    if (!passwordResetUser) {
      throw new Error("Failed to reset user password");
    }

    return passwordResetUser;
  } catch (error) {
    throw error;
  }
};

export default {
  register,
  login,
  sendVerificationMail,
  verifyOneUserByEmail,
  sendPasswordResetMail,
  resetPassword,
};
