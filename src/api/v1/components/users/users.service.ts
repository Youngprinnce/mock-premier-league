// noinspection ExceptionCaughtLocallyJS

import userRepository from "./users.repository";
import * as utils from "../../../../utils/helpers";
import { BadRequestError } from "../../../../utils/api-errors";

export = {
  async users({ currentPage = 1, limit = 10 }: { currentPage?:any, limit?: any}) {
    currentPage = +currentPage;
    limit = +limit > 200 ? 200 : +limit;
    const filter: any = {};
    try {
      const [users, totalUsers] = await userRepository.getAll({currentPage, limit, filter});
      return utils.responseData({
        data: {
          users: users.map((user:any) => user.toObject({getters: true})),
          totalUsers, currentPage, totalPages: Math.ceil(totalUsers / limit)
        }
      });
    } catch (err: any) {
      console.log({ err });
      throw new BadRequestError(err.message);
    }
  },
};
