import userService from "./users.service";
import { Request, Response, NextFunction } from 'express';

export = {
  async users(req:Request, res:Response, next:NextFunction) {
    let {currentPage, limit} = req.query;
    try {
      const {status, ...rest} = await userService.users({currentPage, limit});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },
}