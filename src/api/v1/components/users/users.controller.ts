import userService from "./users.service";
import { Request, Response, NextFunction } from 'express';
import { cacheData, getCache } from "../../../../utils/helpers";

export = {
  async users(req:Request, res:Response, next:NextFunction) {
    let {currentPage, limit} = req.query;
    try {
      const cachedUsers = await getCache({req});
      if(cachedUsers) {
        const {status, ...rest} = cachedUsers
        return res.status(status).json(rest);
      }
      const {status, ...rest} = await userService.users({currentPage, limit});
      await cacheData({req, data: {status, ...rest}})
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },
}