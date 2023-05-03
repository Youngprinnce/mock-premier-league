// noinspection ExceptionCaughtLocallyJS

import bcrypt from "bcryptjs";
import { IUser } from "../users/users.model";
import authRepository from "./auth.repository";
import * as utils from "../../../../utils/helpers";
import * as tokenAuth from "../../../middlewares/auth";
import { BadRequestError, ForbiddenError } from "../../../../utils/api-errors";

export = {
  async signup({ userData }: { userData: IUser }) {
    let { password, role } = userData;
    try {
      userData.password = await bcrypt.hash(password, 12);
      userData.role = role ? role : 'user'
      await authRepository.signup({userData});
    } catch (err: any) {
      console.log({ err });
      throw new BadRequestError(err.message);
    }
    return utils.responseData({
      status: 201,
      message: "Registration successful",
    });
  },

  async login({ email, password }: { email: string; password: string }) {
    let user, isPasswordValid, accessToken, userId;
    try {
      user = await authRepository.findOneUser({ filter: { email } });
      if (!user) throw new ForbiddenError(`you're not yet a user, please signup`);

      userId = user.id;
      isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) throw new BadRequestError("invalid credentials");

      accessToken = await tokenAuth.signAccessToken({ userId });

      user = user.toObject({ getters: true });
      delete user.password;
    } catch (err: any) {
      console.log({ err });
      throw new BadRequestError(err.message);
    }
    return utils.responseData({
      data: { user, accessToken },
      message: "Logged in",
    });
  },
};
