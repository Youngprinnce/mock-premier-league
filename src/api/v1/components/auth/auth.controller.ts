import authService from "./auth.service";
import { IUser } from "../users/users.model";
import { Request, Response, NextFunction } from 'express';

export = {
  async signup(req:Request, res:Response, next:NextFunction) {
    const userData = req.body as IUser;
    try {
      const {status, ...rest} = await authService.signup({userData});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  },

  async login(req:Request, res:Response, next:NextFunction) {
    const {email, password} = req.body;

    try {
      const {status, ...rest} = await authService.login({email, password});
      return res.status(status).json(rest);
    } catch (err) {
      return next(err);
    }
  }
}